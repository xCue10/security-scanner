'use client';

import React, { useState } from 'react';

export default function ShadowRecon() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRecon = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch('/api/recon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>SHADOW RECON (OSINT)</h2>
      <p style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '1.5rem' }}>Perform stealth DNS intelligence collection on any domain.</p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="target-domain.com" 
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{ fontSize: '0.75rem' }}
        />
        <button onClick={handleRecon} disabled={loading} className="btn btn-primary" style={{ fontSize: '0.75rem' }}>
          {loading ? 'RECON_IN_PROGRESS...' : 'START_RECON'}
        </button>
      </div>

      {results && (
        <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.a && (
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <div style={{ opacity: 0.5, marginBottom: '0.3rem' }}>IPV4_ADDRESSES:</div>
              {results.a.map((ip: string, i: number) => <code key={i} style={{ color: 'var(--primary)', display: 'block' }}>{ip}</code>)}
            </div>
          )}
          {results.mx && (
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <div style={{ opacity: 0.5, marginBottom: '0.3rem' }}>MAIL_EXCHANGERS:</div>
              {results.mx.map((m: any, i: number) => <div key={i}>{m.exchange} (Prio: {m.priority})</div>)}
            </div>
          )}
          {results.txt && (
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <div style={{ opacity: 0.5, marginBottom: '0.3rem' }}>TXT_RECORDS (SPF/VERIFICATION):</div>
              {results.txt.map((t: any, i: number) => <div key={i} style={{ wordBreak: 'break-all', fontSize: '0.65rem', opacity: 0.8 }}>{t.join(' ')}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
