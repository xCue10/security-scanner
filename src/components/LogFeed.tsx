'use client';

import React, { useState } from 'react';
import { useLogs } from '@/context/LogContext';

export default function LogFeed() {
  const { logs, isProcessing, setIsProcessing, updateLogs } = useLogs();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (logs.length === 0) return;
    
    setAnalyzing(true);
    try {
      // Analyze the first 50 logs for now to stay within limits
      const logsToAnalyze = logs.slice(0, 50);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logsToAnalyze })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      if (data.analyses) {
        updateLogs(data.analyses);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze logs. Make sure GEMINI_API_KEY is set.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (isProcessing) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Processing logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
        <p>No logs ingested yet. Upload a file to see data.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{logs.length} entries</span>
        <button 
          onClick={handleAnalyze} 
          disabled={analyzing}
          className="btn btn-primary"
          style={{ fontSize: '0.8rem' }}
        >
          {analyzing ? 'Analyzing with AI...' : 'Run AI Forensic Analysis'}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {logs.map((log) => (
            <div key={log.id} style={{
              fontSize: '0.8rem',
              padding: '0.5rem',
              borderLeft: `3px solid ${
                log.riskScore && log.riskScore > 70 ? 'var(--danger)' :
                log.riskScore && log.riskScore > 30 ? 'var(--warning)' :
                log.level === 'error' ? 'var(--danger)' : 
                log.level === 'warning' ? 'var(--warning)' : 'var(--border)'
              }`,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0 4px 4px 0',
              position: 'relative'
            }}>
              {log.riskScore && (
                <div style={{ 
                  position: 'absolute', 
                  top: '0.5rem', 
                  right: '0.5rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: log.riskScore > 70 ? 'var(--danger)' : 'var(--warning)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  RISK: {log.riskScore}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', opacity: 0.7 }}>
                <span>{log.timestamp}</span>
                <span style={{ 
                  color: log.level === 'error' ? 'var(--danger)' : 
                         log.level === 'warning' ? 'var(--warning)' : 'var(--primary)',
                  marginRight: log.riskScore ? '3.5rem' : '0'
                }}>{log.level.toUpperCase()}</span>
              </div>
              <div style={{ wordBreak: 'break-all' }}>
                <strong>{log.source}:</strong> {log.message}
              </div>
              {log.analysis && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.5rem', 
                  background: 'rgba(88, 166, 255, 0.1)', 
                  border: '1px solid var(--primary)',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.2rem' }}>AI ANALYSIS:</div>
                  {log.analysis}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
