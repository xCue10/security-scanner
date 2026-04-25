'use client';

import React, { useState } from 'react';
import { useLogs } from '@/context/LogContext';

export default function LogFeed() {
  const { logs, isProcessing, updateLogs } = useLogs();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (logs.length === 0) return;
    setAnalyzing(true);
    try {
      const logsToAnalyze = logs.slice(0, 50);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logsToAnalyze })
      });
      const data = await response.json();
      if (data.analyses) updateLogs(data.analyses);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (isProcessing) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <p style={{ letterSpacing: '2px', fontSize: '0.7rem', opacity: 0.6 }}>DECRYPTING_DATA...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ flex: 1, height: '600px' }}>
      <div className="card-header">
        <h2>LIVE_FORENSIC_STREAM</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>COUNT: {logs.length}</span>
          <button onClick={handleAnalyze} disabled={analyzing || logs.length === 0} className="btn" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}>
            {analyzing ? 'ANALYZING...' : 'RUN_AI'}
          </button>
        </div>
      </div>
      
      <div className="card-body" style={{ overflowY: 'auto', padding: '0.5rem' }}>
        {logs.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, fontSize: '0.7rem' }}>
            AWAITING_INGESTION
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                fontSize: '0.7rem',
                padding: '0.8rem',
                border: '1px solid var(--border)',
                background: 'var(--feed-item-bg)',
                borderRadius: '6px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', opacity: 0.5, fontSize: '0.6rem' }}>
                  <span>{log.timestamp}</span>
                  <span style={{ 
                    color: log.riskScore && log.riskScore > 70 ? 'var(--danger)' : 
                           log.riskScore && log.riskScore > 30 ? 'var(--warning)' : 'var(--primary)'
                  }}>{log.level.toUpperCase()}</span>
                </div>
                <div style={{ wordBreak: 'break-all', lineHeight: '1.4' }}>
                  <span style={{ color: 'var(--primary)', marginRight: '0.4rem' }}>[{log.source}]</span>
                  {log.message}
                </div>
                {log.analysis && (
                  <div style={{ 
                    marginTop: '0.6rem', 
                    padding: '0.6rem', 
                    background: 'var(--primary-glow)', 
                    borderLeft: '2px solid var(--primary)',
                    fontSize: '0.65rem'
                  }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>AI: </span>{log.analysis}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
