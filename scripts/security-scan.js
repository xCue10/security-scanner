const { exec } = require('child_process');
const path = require('path');

// Full path to semgrep as it was installed via pip --user
const SEMGREP_PATH = path.join(process.env.APPDATA, 'Python', 'Python313', 'Scripts', 'pysemgrep.exe');

console.log('--- STARTING SECURITY SCAN (SEMGREP) ---');
console.log('Target: OWASP Top 10 & Common Vulnerabilities');

// Run semgrep with auto-config (which includes many OWASP rules)
// --json: Output in JSON format
// --quiet: Minimize output
const command = `"${SEMGREP_PATH}" scan --config auto --json .`;

exec(command, { 
  maxBuffer: 10 * 1024 * 1024,
  env: { ...process.env, PYTHONUTF8: '1' } 
}, (error, stdout, stderr) => {
  if (error && !stdout) {
    console.error(`Error executing Semgrep: ${error.message}`);
    console.log('Note: Ensure Python and Semgrep are correctly installed.');
    return;
  }

  try {
    const results = JSON.parse(stdout);
    const findings = results.results || [];

    console.log(`Scan complete. Found ${findings.length} potential issues.\n`);

    if (findings.length > 0) {
      findings.forEach((finding, index) => {
        console.log(`[${index + 1}] ${finding.extra.severity}: ${finding.extra.message}`);
        console.log(`    File: ${finding.path}:${finding.start.line}`);
        console.log(`    Rule: ${finding.check_id}\n`);
      });
    } else {
      console.log('No vulnerabilities detected. System SECURE.');
    }

  } catch (parseError) {
    console.error('Failed to parse Semgrep output.');
    if (stdout) console.log('Raw Output:', stdout);
    if (stderr) console.error('Stderr:', stderr);
  }
});
