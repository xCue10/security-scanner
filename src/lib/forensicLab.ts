export interface ForensicArtifact {
  type: 'IoC' | 'User-Agent' | 'Entropy' | 'Geo-Logic';
  value: string;
  significance: string;
  risk: 'low' | 'medium' | 'high';
}

export function calculateEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  const frequencies: { [key: string]: number } = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export function parseUserAgent(ua: string): string | null {
  const tools = [
    { name: 'Nmap Scripting Engine', regex: /nmap/i },
    { name: 'SQLMap Payload', regex: /sqlmap/i },
    { name: 'Nikto Scanner', regex: /nikto/i },
    { name: 'CURL Request', regex: /curl/i },
    { name: 'Python Requests', regex: /python-requests/i }
  ];
  const found = tools.find(t => t.regex.test(ua));
  return found ? found.name : null;
}

export function extractArtifacts(logMessage: string): ForensicArtifact[] {
  const artifacts: ForensicArtifact[] = [];

  // 1. Entropy Check (Obfuscation Detection)
  const entropy = calculateEntropy(logMessage);
  if (entropy > 4.5 && logMessage.length > 20) {
    artifacts.push({
      type: 'Entropy',
      value: `Score: ${entropy.toFixed(2)}`,
      significance: 'High entropy suggests Base64, Hex, or obfuscated shellcode.',
      risk: 'high'
    });
  }

  // 2. User-Agent Tool Detection
  const tool = parseUserAgent(logMessage);
  if (tool) {
    artifacts.push({
      type: 'User-Agent',
      value: tool,
      significance: 'Automated security scanning tool detected.',
      risk: 'medium'
    });
  }

  // 3. IoC Extraction (Hashes & Domains)
  const md5Match = logMessage.match(/\b[a-fA-F0-9]{32}\b/);
  if (md5Match) {
    artifacts.push({
      type: 'IoC',
      value: md5Match[0],
      significance: 'Potential MD5 file hash identified.',
      risk: 'high'
    });
  }

  return artifacts;
}
