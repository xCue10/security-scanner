'use client';

import React, { useState } from 'react';
import { useLogs } from '@/context/LogContext';

export default function MitigationPanel() {
  const { logs } = useLogs();
  const [isOpen, setIsOpen] = useState(false);
  
  const logsWithMitigation = logs.filter(l => l.analysis && l.raw.toLowerCase().includes('error') || (l.riskScore && l.riskScore > 50));

  return (
    <div className="card">
      <div className="card-header" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h2>MITIGATION_PLAN</h2>
        <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
      </div>

      {isOpen && (
        <div className="card-body">
          {logsWithMitigation.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: '0.7rem', textAlign: 'center' }}>NO_THREATS_IDENTIFIED</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {logsWithMitigation.slice(0, 5).map((log, i) => (
                <div key={`mit-${log.id}`} style={{ padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(248, 81, 73, 0.05)' }}>
                  <h4 style={{ color: 'var(--danger)', fontSize: '0.65rem', marginBottom: '0.3rem' }}>THREAT_{log.id.split('-').pop()}</h4>
                  <p style={{ fontSize: '0.7rem', marginBottom: '0.4rem', lineHeight: '1.4' }}>{log.analysis}</p>
                  <div style={{ fontSize: '0.65rem' }}>
                    <div style={{ opacity: 0.5, marginBottom: '0.2rem' }}>PROCEDURE:</div>
                    <ul style={{ marginLeft: '1rem', opacity: 0.8 }}>
                      <li>Investigate {log.source}</li>
                      <li>Review at {log.timestamp}</li>
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
