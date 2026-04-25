'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('ACCESS_DENIED: INVALID_CREDENTIALS');
    }
  };

  return (
    <main style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#020408',
      fontFamily: 'var(--font-mono)'
    }}>
      <div className="card" style={{ width: '400px', textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '4px' }}>VANGUARD</h1>
        <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '2rem', textTransform: 'uppercase' }}>Secure Access Portal</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            placeholder="ENTER_ENCRYPTION_KEY"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ textAlign: 'center', letterSpacing: '2px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>AUTHORIZE</button>
        </form>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.7rem', marginTop: '1rem', letterSpacing: '1px' }}>{error}</p>
        )}
      </div>
    </main>
  );
}
