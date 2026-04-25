'use client';

import React, { useState } from 'react';

export default function NetworkBreachModule() {
  const [activeTab, setActiveTab] = useState<'network' | 'breach'>('network');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleScan = async () => {
    if (!target) return;
    setLoading(true);
    try {
      const endpoint = activeTab === 'network' ? '/api/network-scan' : '/api/breach';
      const body = activeTab === 'network' ? { host: target } : { target };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => { setActiveTab('network'); setResults(null); }}
          className="btn"
          style={{ opacity: activeTab === 'network' ? 1 : 0.5, fontSize: '0.7rem' }}
        >
          NETWORK_SENTINEL
        </button>
        <button 
          onClick={() => { setActiveTab('breach'); setResults(null); }}
          className="btn"
          style={{ opacity: activeTab === 'breach' ? 1 : 0.5, fontSize: '0.7rem' }}
        >
          BREACH_HUNTER
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder={activeTab === 'network' ? "IP or Hostname" : "Email or Domain"}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{ fontSize: '0.75rem' }}
        />
        <button onClick={handleScan} disabled={loading} className="btn btn-primary" style={{ fontSize: '0.75rem' }}>
          {loading ? 'RUNNING...' : 'EXECUTE'}
        </button>
      </div>

      {results && activeTab === 'network' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {results.results.map((r: any, i: number) => (
            <div key={i} style={{ 
              padding: '0.5rem', 
              border: '1px solid var(--border)', 
              borderRadius: '4px',
              textAlign: 'center',
              background: r.status === 'open' ? 'rgba(0, 255, 149, 0.05)' : 'transparent'
            }}>
              <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{r.port}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{r.service}</div>
              <div style={{ color: r.status === 'open' ? 'var(--accent)' : 'var(--danger)', fontSize: '0.65rem' }}>
                {r.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}

      {results && activeTab === 'breach' && (
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ 
            padding: '0.5rem', 
            background: results.status === 'compromised' ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 255, 149, 0.1)',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            STATUS: {results.status}
          </div>
          {results.leaks?.map((l: any, i: number) => (
            <div key={i} style={{ marginBottom: '0.8rem', padding: '0.5rem', borderLeft: '2px solid var(--danger)', background: 'rgba(255,255,255,0.02)' }}>
              <strong>{l.name}</strong> ({l.date})
              <p style={{ opacity: 0.7, fontSize: '0.7rem' }}>Data: {l.dataLeaked}</p>
            </div>
          ))}
          <p style={{ marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.7rem' }}>{results.recommendation}</p>
        </div>
      )}
    </div>
  );
}
