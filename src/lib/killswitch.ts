export type FirewallType = 'Windows' | 'Linux' | 'Nginx';

export function generateFirewallRule(ip: string, type: FirewallType): string {
  switch (type) {
    case 'Windows':
      return `netsh advfirewall firewall add rule name="BLOCK ${ip}" dir=in action=block remoteip=${ip}`;
    case 'Linux':
      return `iptables -A INPUT -s ${ip} -j DROP`;
    case 'Nginx':
      return `deny ${ip};`;
    default:
      return '';
  }
}
