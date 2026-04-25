'use client';

import React, { useState } from 'react';
import { useLogs } from '@/context/LogContext';

export default function Copilot() {
  const { logs } = useLogs();
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<{q: string, a: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const askCopilot = async () => {
    if (!question || logs.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, logs })
      });
      const data = await res.json();
      setChat(prev => [...prev, { q: question, a: data.answer }]);
      setQuestion('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ height: '500px' }}>
      <div className="card-header">
        <h2>AI_SECURITY_COPILOT</h2>
      </div>
      
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '0.5rem', fontSize: '0.7rem' }}>
          {chat.length === 0 && <p style={{ opacity: 0.3, textAlign: 'center', marginTop: '2rem' }}>AWAITING_INPUT // QUERY_LOGS</p>}
          {chat.map((c, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.65rem' }}>&gt; USER: {c.q}</div>
              <div style={{ marginTop: '0.3rem', opacity: 0.9, lineHeight: '1.4' }}>{c.a}</div>
            </div>
          ))}
          {loading && <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>CONSULTING_VANGUARD_AI...</div>}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="System query..."
            onKeyDown={(e) => e.key === 'Enter' && askCopilot()}
          />
          <button onClick={askCopilot} className="btn" style={{ padding: '0.5rem' }}>QUERY</button>
        </div>
      </div>
    </div>
  );
}
