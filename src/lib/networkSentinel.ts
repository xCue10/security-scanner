import net from 'net';

export interface PortResult {
  port: number;
  status: 'open' | 'closed';
  service: string;
}

const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 443, service: 'HTTPS' },
  { port: 3306, service: 'MySQL' },
  { port: 3389, service: 'RDP' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 8080, service: 'HTTP-Proxy' }
];

export async function scanPorts(host: string): Promise<PortResult[]> {
  const results: PortResult[] = [];

  const checkPort = (port: number, service: string): Promise<PortResult> => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1500);

      socket.on('connect', () => {
        socket.destroy();
        resolve({ port, service, status: 'open' });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({ port, service, status: 'closed' });
      });

      socket.on('error', () => {
        socket.destroy();
        resolve({ port, service, status: 'closed' });
      });

      socket.connect(port, host);
    });
  };

  for (const p of COMMON_PORTS) {
    results.push(await checkPort(p.port, p.service));
  }

  return results;
}
