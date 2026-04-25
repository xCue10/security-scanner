'use client';

import React, { useState } from 'react';
import { generateFirewallRule, FirewallType } from '@/lib/killswitch';

export default function IntelligenceHub() {
  const [ipToBlock, setIpToBlock] = useState('');
  const [ruleType, setRuleType] = useState<FirewallType>('Linux');
  const [generatedRule, setGeneratedRule] = useState('');

  const handleGenerate = () => {
    if (!ipToBlock) return;
    setGeneratedRule(generateFirewallRule(ipToBlock, ruleType));
  };

  // Mocked live ticker for visual impact
  const tickers = [
    "CVE-2024-1234: Critical RCE found in OpenSSL",
    "CVE-2024-5678: SQL Injection in Popular CMS",
    "New Zero-Day exploit discovered in Router Firmware",
    "Emergency Patch released for Linux Kernel"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{ padding: '0.5rem 1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '2rem', animation: 'ticker 20s linear infinite', whiteSpace: 'nowrap' }}>
          {tickers.map((t, i) => (
            <span key={i} style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 'bold' }}>
              [INTEL] {t}
            </span>
          ))}
        </div>
        <style jsx>{`
          @keyframes ticker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>

      <div className="card">
        <h2>FIREWALL KILLSWITCH</h2>
        <p style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '1rem' }}>Generate instant blocking rules for malicious IPs.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <input 
            type="text" 
            placeholder="192.168.1.1" 
            value={ipToBlock}
            onChange={(e) => setIpToBlock(e.target.value)}
            style={{ fontSize: '0.75rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['Windows', 'Linux', 'Nginx'] as FirewallType[]).map(type => (
              <button 
                key={type}
                onClick={() => setRuleType(type)}
                className="btn"
                style={{ flex: 1, fontSize: '0.65rem', border: ruleType === type ? '1px solid var(--primary)' : '1px solid var(--border)' }}
              >
                {type}
              </button>
            ))}
          </div>
          <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%' }}>GENERATE RULE</button>
          
          {generatedRule && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.8rem', 
              background: '#010409', 
              borderRadius: '4px', 
              borderLeft: '2px solid var(--danger)',
              fontSize: '0.7rem'
            }}>
              <code>{generatedRule}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedRule)}
                style={{ display: 'block', marginTop: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.65rem' }}
              >
                COPY TO CLIPBOARD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
