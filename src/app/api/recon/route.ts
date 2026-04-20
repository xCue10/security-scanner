import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { appendData, upsertByField, readData } from '@/lib/storage';

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

      // Save discovered assets
      const now = new Date().toISOString();
      for (const sub of subdomains) {
        upsertByField('discovered-assets', 'domain', sub, {
          id: sub,
          createdAt: now,
          domain: sub,
          ip: null,
          source: 'SUBFINDER',
          lastSeen: now,
        });
      }

      // Log the scan record
      appendData('scan-records', {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: now,
        type: 'RECON',
        target: sanitizedDomain,
        status: 'COMPLETED',
        data: JSON.stringify({ subdomains }),
        severity: 'CLEAN',
        summary: null,
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
    const assets = readData('discovered-assets');
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
