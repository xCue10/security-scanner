import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { storage } from '@/lib/storage';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Trivy command to scan the filesystem for dependency vulns
    // --severity HIGH,CRITICAL: Focus on what matters
    // --format json: Machine readable
    const command = `trivy fs . --severity HIGH,CRITICAL --format json --quiet`;

    try {
      const { stdout } = await execAsync(command, { timeout: 60000 });
      
      const rawResults = JSON.parse(stdout);
      
      // Flatten Trivy results into a clean format
      const findings = (rawResults.Results || []).flatMap((res: any) => 
        (res.Vulnerabilities || []).map((v: any) => ({
          id: v.VulnerabilityID,
          package: v.PkgName,
          version: v.InstalledVersion,
          fixed_version: v.FixedVersion,
          title: v.Title,
          severity: v.Severity,
          description: v.Description
        }))
      );

      const auditData = {
        summary: {
          total: findings.length,
          critical: findings.filter((f: any) => f.severity === 'CRITICAL').length,
          high: findings.filter((f: any) => f.severity === 'HIGH').length
        },
        findings
      };

      // PERSIST TO FILE STORAGE
      storage.addRecord({
        type: 'DEPENDENCY',
        target: 'PACKAGE_JSON',
        status: 'COMPLETED',
        data: JSON.stringify(auditData),
        severity: auditData.summary.critical > 0 ? 'CRITICAL' : 
                  auditData.summary.high > 0 ? 'HIGH' : 'CLEAN'
      });

      return NextResponse.json(auditData);

    } catch (execError: any) {
      console.error('Trivy Error:', execError);
      return NextResponse.json({ 
        error: 'Dependency engine failed. Check if Trivy is installed.' 
      }, { status: 501 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
