export interface ScanResult {
  type: 'SQLi' | 'XSS' | 'Header' | 'SensitiveFiles';
  status: 'vulnerable' | 'secure' | 'uncertain';
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export async function runSecurityProbes(targetUrl: string): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  // 1. Security Header Check
  try {
    const response = await fetch(targetUrl, { method: 'HEAD' });
    const headers = response.headers;
    const missingHeaders = [];
    
    if (!headers.has('Content-Security-Policy')) missingHeaders.push('CSP');
    if (!headers.has('Strict-Transport-Security')) missingHeaders.push('HSTS');
    if (!headers.has('X-Frame-Options')) missingHeaders.push('X-Frame-Options');

    if (missingHeaders.length > 0) {
      results.push({
        type: 'Header',
        status: 'vulnerable',
        description: `Missing critical security headers: ${missingHeaders.join(', ')}`,
        recommendation: 'Implement a strong Content-Security-Policy and enable HSTS.',
        severity: 'medium'
      });
    } else {
      results.push({
        type: 'Header',
        status: 'secure',
        description: 'All basic security headers are present.',
        recommendation: 'Periodically review header configurations.',
        severity: 'low'
      });
    }
  } catch (error) {
    console.error('Header scan failed:', error);
  }

  // 2. Sensitive File Probing (e.g., .env, .git)
  const sensitivePaths = ['.env', '.git/config', 'package.json'];
  for (const path of sensitivePaths) {
    try {
      const url = targetUrl.endsWith('/') ? `${targetUrl}${path}` : `${targetUrl}/${path}`;
      const res = await fetch(url, { method: 'GET' });
      if (res.status === 200) {
        results.push({
          type: 'SensitiveFiles',
          status: 'vulnerable',
          description: `Sensitive file accessible at ${url}`,
          recommendation: 'Restrict access to configuration files via web server rules.',
          severity: 'critical'
        });
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return results;
}
