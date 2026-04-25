'use client';

import React, { useState } from 'react';
import { analyzeFileIntegrity, IntegrityResult } from '@/lib/integrityLab';

export default function IntegrityLab() {
  const [result, setResult] = useState<IntegrityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const analysis = await analyzeFileIntegrity(file);
      setResult(analysis);
    } catch (error) {
      console.error('Integrity check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h2>INTEGRITY_LAB</h2>
        <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
      </div>

      {isOpen && (
        <div className="card-body">
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input type="file" onChange={handleFileChange} id="integrityInput" style={{ display: 'none' }} />
            <label htmlFor="integrityInput" className="btn" style={{ width: '100%', textAlign: 'center', display: 'block', borderStyle: 'dashed' }}>
              {loading ? 'ANALYZING...' : 'DROP EVIDENCE'}
            </label>
          </div>

          {result && (
            <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ padding: '0.6rem', background: 'var(--feed-item-bg)', borderRadius: '4px', borderLeft: `3px solid ${result.match ? 'var(--accent)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', opacity: 0.6, marginBottom: '0.2rem' }}>
                  <span>STATUS:</span>
                  <span style={{ color: result.match ? 'var(--accent)' : 'var(--danger)' }}>{result.match ? 'VERIFIED' : 'MASQUERADE'}</span>
                </div>
                <div style={{ fontWeight: 'bold' }}>{result.detectedType}</div>
              </div>

              <div style={{ padding: '0.6rem', background: 'var(--code-bg)', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '0.2rem' }}>SHA256:</div>
                <code style={{ wordBreak: 'break-all', fontSize: '0.6rem', display: 'block' }}>{result.sha256}</code>
              </div>

              {result.strings && result.strings.length > 0 && (
                <div style={{ padding: '0.6rem', background: 'var(--code-bg)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '0.4rem' }}>STRINGS_EXTRACT:</div>
                  <div style={{ height: '80px', overflowY: 'auto', fontSize: '0.6rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                    {result.strings.join('\n')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
