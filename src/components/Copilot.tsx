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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
      <h2><span style={{ color: 'var(--primary)' }}>◈</span> AI COPILOT</h2>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '0.5rem', fontSize: '0.75rem' }}>
        {chat.length === 0 && <p style={{ opacity: 0.4 }}>Ask me about the current logs...</p>}
        {chat.map((c, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>USER: {c.q}</div>
            <div style={{ marginTop: '0.2rem', opacity: 0.9 }}>AI: {c.a}</div>
          </div>
        ))}
        {loading && <div className="status-dot online"></div>}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Who is the attacker?"
          onKeyDown={(e) => e.key === 'Enter' && askCopilot()}
          style={{ fontSize: '0.75rem' }}
        />
        <button onClick={askCopilot} className="btn" style={{ padding: '0.4rem' }}>ASK</button>
      </div>
    </div>
  );
}
