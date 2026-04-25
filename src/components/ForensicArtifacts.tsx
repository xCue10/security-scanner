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
    return Array.from(new Map(extracted.map(item => [item.value, item])).values());
  }, [logs]);

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-header">
        <h2>FORENSIC_ARTIFACTS</h2>
        <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>FOUND: {allArtifacts.length}</span>
      </div>
      <div className="card-body" style={{ overflowY: 'auto' }}>
        {logs.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, fontSize: '0.7rem' }}>
            AWAITING_DATA
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {allArtifacts.map((art, i) => (
              <div key={i} style={{ 
                padding: '0.8rem', 
                border: '1px solid var(--border)', 
                borderRadius: '6px', 
                background: 'var(--feed-item-bg)',
                borderLeft: `3px solid ${art.risk === 'high' ? 'var(--danger)' : art.risk === 'medium' ? 'var(--warning)' : 'var(--primary)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.6rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{art.type}</span>
                  <span style={{ opacity: 0.6 }}>LEVEL_{art.risk.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.2rem', wordBreak: 'break-all' }}>
                  {art.value}
                </div>
                <p style={{ fontSize: '0.65rem', opacity: 0.7, lineHeight: '1.3' }}>{art.significance}</p>
              </div>
            ))}
            {allArtifacts.length === 0 && <p style={{ textAlign: 'center', fontSize: '0.65rem', opacity: 0.4 }}>NO_ARTIFACTS_DETECTED</p>}
          </div>
        )}
      </div>
    </div>
  );
}
