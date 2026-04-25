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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot online" style={{ width: '20px', height: '20px' }}></div>
          <p style={{ marginTop: '1rem', letterSpacing: '2px', fontSize: '0.8rem' }}>DECRYPTING DATA...</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, height: '600px' }}>
        <p>BUFFER EMPTY // AWAITING INGESTION</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '600px' }}>
      <div style={{ padding: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>SEQUENCE COUNT: {logs.length}</span>
        <button 
          onClick={handleAnalyze} 
          disabled={analyzing}
          className="btn"
          style={{ fontSize: '0.65rem', padding: '0.4rem 0.8rem' }}
        >
          {analyzing ? 'ANALYZING...' : 'RUN AI ANALYSIS'}
        </button>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: '0.5rem',
        maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {logs.map((log) => (
            <div key={log.id} style={{
              fontSize: '0.75rem',
              padding: '1rem',
              border: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              position: 'relative',
              transition: 'border-color 0.2s'
            }} className="feed-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: 0.5, fontSize: '0.65rem' }}>
                <span>{log.timestamp}</span>
                <span style={{ 
                  color: log.riskScore && log.riskScore > 70 ? 'var(--danger)' : 
                         log.riskScore && log.riskScore > 30 ? 'var(--warning)' : 'var(--primary)'
                }}>{log.level.toUpperCase()}</span>
              </div>
              <div style={{ wordBreak: 'break-all', opacity: 0.9 }}>
                <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>[{log.source}]</span>
                {log.message}
              </div>
              {log.analysis && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.8rem', 
                  background: 'rgba(0, 242, 255, 0.05)', 
                  borderLeft: '2px solid var(--primary)',
                  fontSize: '0.7rem',
                  lineHeight: '1.4'
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>AI_INSIGHT:</span>
                  {log.analysis}
                  {log.riskScore && (
                    <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                      THREAT_LEVEL: <span style={{ color: log.riskScore > 70 ? 'var(--danger)' : 'var(--warning)' }}>{log.riskScore}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
