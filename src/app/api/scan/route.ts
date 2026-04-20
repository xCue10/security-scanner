import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseStringPromise } from 'xml2js';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { target } = await req.json();

    if (!target) {
      return NextResponse.json({ error: 'Target IP or hostname is required' }, { status: 400 });
    }

    // Basic validation to prevent command injection
    const sanitizedTarget = target.replace(/[^a-zA-Z0-9.-]/g, '');

    // Execute nmap with XML output
    // -F: Fast mode (scan fewer ports)
    // -oX -: Output to stdout in XML format
    try {
      const { stdout, stderr } = await execAsync(`nmap -F -oX - ${sanitizedTarget}`);
      
      if (stderr && !stdout) {
        return NextResponse.json({ error: `Nmap Error: ${stderr}` }, { status: 500 });
      }

      // Parse XML to JSON
      const result = await parseStringPromise(stdout);

      // Extract meaningful data
      const host = result.nmaprun.host?.[0];
      if (!host) {
        return NextResponse.json({ 
          message: 'No host found or host is down',
          raw: result 
        });
      }

      const ports = host.ports?.[0]?.port?.map((p: any) => ({
        portid: p.$.portid,
        protocol: p.$.protocol,
        state: p.state?.[0]?.$.state,
        service: p.service?.[0]?.$.name
      })) || [];

      return NextResponse.json({
        target: sanitizedTarget,
        status: host.status?.[0]?.$.state,
        address: host.address?.[0]?.$.addr,
        ports: ports
      });

    } catch (execError: any) {
      if (execError.message.includes('not recognized')) {
        return NextResponse.json({ 
          error: 'Nmap is not installed on the server. Please install Nmap to use this feature.' 
        }, { status: 501 });
      }
      throw execError;
    }

  } catch (error: any) {
    console.error('Scan Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
