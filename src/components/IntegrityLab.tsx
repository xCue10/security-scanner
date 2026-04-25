'use client';

import React, { useState } from 'react';
import { analyzeFileIntegrity, IntegrityResult } from '@/lib/integrityLab';

export default function IntegrityLab() {
  const [result, setResult] = useState<IntegrityResult | null>(null);
  const [loading, setLoading] = useState(false);

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
      <h2>INTEGRITY & MAGIC BYTE LAB</h2>
      <p style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '1.5rem' }}>
        Verify file headers and generate cryptographic fingerprints.
      </p>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input 
          type="file" 
          onChange={handleFileChange}
          id="integrityInput"
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="integrityInput" 
          className="btn" 
          style={{ width: '100%', textAlign: 'center', display: 'block', borderStyle: 'dashed' }}
        >
          {loading ? 'ANALYZING...' : 'DROP EVIDENCE FOR HASHING'}
        </label>
      </div>

      {result && (
        <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', borderLeft: `3px solid ${result.match ? 'var(--accent)' : 'var(--danger)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ opacity: 0.6 }}>TRUE_IDENTITY:</span>
              <span style={{ color: result.match ? 'var(--accent)' : 'var(--danger)', fontWeight: 'bold' }}>
                {result.match ? 'VERIFIED' : 'MASQUERADE_DETECTED'}
              </span>
            </div>
            <div style={{ fontWeight: 'bold' }}>{result.detectedType}</div>
          </div>

          <div style={{ padding: '0.8rem', background: '#010409', borderRadius: '6px' }}>
            <div style={{ opacity: 0.6, marginBottom: '0.2rem' }}>MAGIC_BYTES (HEX):</div>
            <code style={{ color: 'var(--primary)', letterSpacing: '1px' }}>{result.magicBytes}</code>
          </div>

          <div style={{ padding: '0.8rem', background: '#010409', borderRadius: '6px' }}>
            <div style={{ opacity: 0.6, marginBottom: '0.2rem' }}>SHA-256 FINGERPRINT:</div>
            <code style={{ wordBreak: 'break-all', color: 'var(--accent)', fontSize: '0.65rem' }}>{result.sha256}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(result.sha256)}
              style={{ display: 'block', marginTop: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.6rem' }}
            >
              COPY_HASH
            </button>
          </div>

          <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>
            FILE_SIZE: {(result.fileSize / 1024).toFixed(2)} KB
          </div>

          {result.strings && result.strings.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ opacity: 0.6, fontSize: '0.65rem', marginBottom: '0.4rem' }}>PRINTABLE_STRINGS (FORENSIC_EXTRACT):</div>
              <div style={{ 
                height: '100px', 
                overflowY: 'auto', 
                background: '#010409', 
                padding: '0.5rem', 
                borderRadius: '4px',
                fontSize: '0.65rem',
                opacity: 0.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {result.strings.join('\n')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
