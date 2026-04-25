'use client';

import React, { useMemo } from 'react';
import { useLogs } from '@/context/LogContext';
import { extractArtifacts, ForensicArtifact } from '@/lib/forensicLab';

export default function ForensicArtifacts() {
  const { logs } = useLogs();

  const allArtifacts = useMemo(() => {
    const extracted: ForensicArtifact[] = [];
    logs.forEach(log => {
      extracted.push(...extractArtifacts(log.message));
    });
    // Deduplicate by value
    return Array.from(new Map(extracted.map(item => [item.value, item])).values());
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="card">
        <h2>FORENSIC ARTIFACTS</h2>
        <p style={{ opacity: 0.5, fontSize: '0.75rem' }}>No logs present for deep-dive extraction.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2>FORENSIC ARTIFACTS</h2>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {allArtifacts.length === 0 && (
          <p style={{ opacity: 0.5, fontSize: '0.75rem' }}>Scanning for obfuscation, IoCs, and automation tools...</p>
        )}
        {allArtifacts.map((art, i) => (
          <div key={i} style={{ 
            padding: '1rem', 
            border: '1px solid var(--border)', 
            borderRadius: '6px', 
            background: 'rgba(255,255,255,0.02)',
            borderLeft: `4px solid ${art.risk === 'high' ? 'var(--danger)' : art.risk === 'medium' ? 'var(--warning)' : 'var(--primary)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>
                {art.type}
              </span>
              <span style={{ fontSize: '0.6rem', color: art.risk === 'high' ? 'var(--danger)' : 'var(--foreground)', opacity: 0.7 }}>
                RISK_{art.risk.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem', wordBreak: 'break-all' }}>
              {art.value}
            </div>
            <p style={{ fontSize: '0.7rem', opacity: 0.7, lineHeight: '1.4' }}>
              {art.significance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
