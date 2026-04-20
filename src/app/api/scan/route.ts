import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStringPromise } from 'xml2js';
import { appendData } from '@/lib/storage';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { target } = await req.json();

    if (!target) {
      return NextResponse.json({ error: 'Target IP or hostname is required' }, { status: 400 });
    }

    const sanitizedTarget = target.replace(/[^a-zA-Z0-9.-]/g, '');

    try {
      const { stdout, stderr } = await execAsync(`nmap -F -oX - ${sanitizedTarget}`);
      
      if (stderr && !stdout) {
        return NextResponse.json({ error: `Nmap Error: ${stderr}` }, { status: 500 });
      }

      const result = await parseStringPromise(stdout);
      const host = result.nmaprun.host?.[0];
      
      const ports = host?.ports?.[0]?.port?.map((p: any) => ({
        portid: p.$.portid,
        protocol: p.$.protocol,
        state: p.state?.[0]?.$.state,
        service: p.service?.[0]?.$.name
      })) || [];

      const scanData = {
        target: sanitizedTarget,
        status: host?.status?.[0]?.$.state || 'down',
        address: host?.address?.[0]?.$.addr || 'unknown',
        ports: ports
      };

      // Persist to file storage
      appendData('scan-records', {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
        type: 'NETWORK',
        target: sanitizedTarget,
        status: 'COMPLETED',
        data: JSON.stringify(scanData),
        severity: ports.length > 0 ? 'LOW' : 'CLEAN',
        summary: null,
      });

      return NextResponse.json(scanData);

    } catch (execError: any) {
      return NextResponse.json({ error: 'Scanner execution failed.' }, { status: 501 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
