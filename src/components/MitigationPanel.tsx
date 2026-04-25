'use client';

import React, { useState } from 'react';
import { useLogs } from '@/context/LogContext';

export default function MitigationPanel() {
  const { logs } = useLogs();
  const [isOpen, setIsOpen] = useState(false);
  
  const logsWithMitigation = logs.filter(l => l.analysis && l.raw.toLowerCase().includes('error') || (l.riskScore && l.riskScore > 50));

  return (
    <div className="card" style={{ padding: 0 }}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <h2 style={{ margin: 0, fontSize: '0.7rem' }}>
          <span style={{ color: 'var(--primary)' }}>◈</span> MITIGATION_INTELLIGENCE
        </h2>
        <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>{isOpen ? '[ COLLAPSE ]' : '[ EXPAND ]'}</span>
      </div>

      {isOpen && (
        <div style={{ padding: '0 1rem 1.5rem 1rem' }}>
          {logsWithMitigation.length === 0 ? (
            <p style={{ opacity: 0.5, fontSize: '0.75rem' }}>No critical threats identified for remediation.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {logsWithMitigation.slice(0, 5).map((log, i) => (
                <div key={`mit-${log.id}`} style={{ padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(248, 81, 73, 0.05)' }}>
                  <h4 style={{ color: 'var(--danger)', fontSize: '0.7rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>THREAT_ID: {log.id.split('-').pop()}</h4>
                  <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>{log.analysis}</p>
                  <div style={{ fontSize: '0.7rem' }}>
                    <div style={{ opacity: 0.6, marginBottom: '0.3rem' }}>RECOMMENDED_ACTION:</div>
                    <ul style={{ marginLeft: '1.2rem', opacity: 0.8 }}>
                      <li>Investigate source: {log.source}</li>
                      <li>Review access at: {log.timestamp}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
