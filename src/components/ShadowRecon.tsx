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
      <div className="card-header">
        <h2>SHADOW_RECON_OSINT</h2>
      </div>
      
      <div className="card-body">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="target-domain.com" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button onClick={handleRecon} disabled={loading} className="btn btn-primary">
            {loading ? 'WAIT' : 'RECON'}
          </button>
        </div>

        {results && (
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {results.a && (
              <div style={{ padding: '0.6rem', background: 'var(--code-bg)', borderRadius: '4px' }}>
                <div style={{ opacity: 0.5, marginBottom: '0.2rem', fontSize: '0.6rem' }}>IPV4:</div>
                {results.a.map((ip: string, i: number) => <code key={i} style={{ color: 'var(--primary)', display: 'block', border: 'none', background: 'transparent' }}>{ip}</code>)}
              </div>
            )}
            {results.mx && (
              <div style={{ padding: '0.6rem', background: 'var(--code-bg)', borderRadius: '4px' }}>
                <div style={{ opacity: 0.5, marginBottom: '0.2rem', fontSize: '0.6rem' }}>MX:</div>
                {results.mx.map((m: any, i: number) => <div key={i}>{m.exchange}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
