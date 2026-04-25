'use client';

import React from 'react';
import { useLogs } from '@/context/LogContext';

export default function MitigationPanel() {
  const { logs } = useLogs();
  
  // Find logs with mitigation advice
  const logsWithMitigation = logs.filter(l => l.analysis && l.raw.toLowerCase().includes('error') || (l.riskScore && l.riskScore > 50));

  if (logsWithMitigation.length === 0) {
    return (
      <div className="card">
        <h2>Actionable Mitigation</h2>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No critical threats identified yet. Run AI analysis to generate remediation steps.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Actionable Mitigation</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logsWithMitigation.slice(0, 5).map((log, i) => (
          <div key={`mit-${log.id}`} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(248, 81, 73, 0.05)' }}>
            <h4 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Threat ID: {log.id.split('-').pop()}</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}><strong>Observation:</strong> {log.analysis}</p>
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Recommended Steps:</strong>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Investigate source: {log.source}</li>
                <li>Block associated IP (if applicable)</li>
                <li>Review access logs for the timestamp: {log.timestamp}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
