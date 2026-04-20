import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // In production (Railway/Nixpacks), semgrep is in the PATH.
    // Locally, we use the pysemgrep wrapper.
    const isProduction = process.env.NODE_ENV === 'production';
    const SEMGREP_CMD = isProduction 
      ? 'semgrep' 
      : `"${path.join(process.env.APPDATA || '', 'Python', 'Python313', 'Scripts', 'pysemgrep.exe')}"`;

    // Run semgrep on the current directory (.)
    // --config auto: Use the best rules for the project
    // --json: Return machine-readable data
    const command = `${SEMGREP_CMD} scan --config auto --json .`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, PYTHONUTF8: '1' }
      });

      if (!stdout && stderr) {
        throw new Error(stderr);
      }

      const results = JSON.parse(stdout);
      return NextResponse.json({
        summary: {
          total_findings: results.results?.length || 0,
          errors: results.errors?.length || 0
        },
        findings: results.results?.map((f: any) => ({
          check_id: f.check_id,
          path: f.path,
          line: f.start.line,
          message: f.extra.message,
          severity: f.extra.severity
        })) || []
      });

    } catch (execError: any) {
      console.error('Semgrep Exec Error:', execError);
      return NextResponse.json({ 
        error: 'Security engine failed to execute. Ensure Semgrep is installed.',
        details: execError.message 
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
