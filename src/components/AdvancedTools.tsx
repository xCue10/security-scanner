'use client';

import React, { useState } from 'react';
import { generateCanaryToken, auditCodeForSecrets, SecretAuditResult } from '@/lib/scannerEngine';

export default function AdvancedTools() {
  const [canary, setCanary] = useState<any>(null);
  const [auditResults, setAuditResults] = useState<SecretAuditResult[]>([]);

  const [auditing, setAuditing] = useState(false);

  const handleGenCanary = () => {
    setCanary(generateCanaryToken());
  };

  const handleAuditCode = async () => {
    setAuditing(true);
    try {
      const res = await fetch('/api/audit-local');
      const data = await res.json();
      setAuditResults(data.results || []);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card">
        <h3>Deception (Canary Tokens)</h3>
        <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Create "bait" to trap attackers.</p>
        <button onClick={handleGenCanary} className="btn">Generate Canary</button>
        {canary && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'var(--code-bg)', border: '1px solid var(--primary)', borderRadius: '4px', fontSize: '0.75rem' }}>
            <p><strong>URL:</strong> {canary.url}</p>
            <p><strong>Token:</strong> <code>{canary.token}</code></p>
            <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>{canary.instructions}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Secret Auditor</h3>
        <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Scan local files for leaked credentials.</p>
        <button onClick={handleAuditCode} disabled={auditing} className="btn btn-primary">
          {auditing ? 'AUDITING...' : 'Audit Project Code'}
        </button>
        {auditResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {auditResults.map((r, i) => (
              <div key={i} style={{ padding: '0.5rem', borderLeft: '3px solid var(--danger)', background: 'rgba(248, 81, 73, 0.1)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                <strong>{r.type} found in {r.file}:L{r.line}</strong>
                <p><code>{r.snippet}</code></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
