import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Basic sanitization
    const sanitizedDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '');

    // Subfinder discovery
    // -silent: only subdomains
    // -d: target domain
    const command = `subfinder -d ${sanitizedDomain} -silent`;

    try {
      const { stdout } = await execAsync(command, { timeout: 30000 });
      const subdomains = stdout.split('\n').filter(s => s.trim());

      // Save to database
      const assets = await Promise.all(
        subdomains.map(sub => 
          prisma.discoveredAsset.upsert({
            where: { domain: sub },
            update: { lastSeen: new Date() },
            create: {
              domain: sub,
              source: 'SUBFINDER'
            }
          })
        )
      );

      // Log the scan record
      await prisma.scanRecord.create({
        data: {
          type: 'RECON',
          target: sanitizedDomain,
          status: 'COMPLETED',
          data: JSON.stringify({ subdomains }),
          severity: 'CLEAN'
        }
      });

      return NextResponse.json({ subdomains });

    } catch (execError: any) {
      console.error('Recon Error:', execError);
      return NextResponse.json({ error: 'Asset discovery engine failed.' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const assets = await prisma.discoveredAsset.findMany({
      orderBy: { lastSeen: 'desc' },
      take: 100
    });
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
