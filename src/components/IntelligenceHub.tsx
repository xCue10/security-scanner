'use client';

import React, { useState } from 'react';
import { generateFirewallRule, FirewallType } from '@/lib/killswitch';

export default function IntelligenceHub() {
  const [ipToBlock, setIpToBlock] = useState('');
  const [ruleType, setRuleType] = useState<FirewallType>('Linux');
  const [generatedRule, setGeneratedRule] = useState('');
  const [isKillswitchOpen, setIsKillswitchOpen] = useState(false);

  const handleGenerate = () => {
    if (!ipToBlock) return;
    setGeneratedRule(generateFirewallRule(ipToBlock, ruleType));
  };

  const tickers = [
    "CVE-2024-1234: Critical RCE found in OpenSSL",
    "CVE-2024-5678: SQL Injection in Popular CMS",
    "New Zero-Day exploit discovered in Router Firmware",
    "Emergency Patch released for Linux Kernel"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Ticker Section */}
      <div className="card" style={{ padding: '0.5rem 1rem', overflow: 'hidden', margin: 0 }}>
        <div style={{ display: 'flex', gap: '2rem', animation: 'ticker 20s linear infinite', whiteSpace: 'nowrap' }}>
          {tickers.map((t, i) => (
            <span key={i} style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 'bold' }}>
              [INTEL] {t}
            </span>
          ))}
        </div>
      </div>

      {/* Collapsible Killswitch */}
      <div className="card" style={{ margin: 0 }}>
        <div 
          onClick={() => setIsKillswitchOpen(!isKillswitchOpen)} 
          className="card-header"
          style={{ cursor: 'pointer' }}
        >
          <h2 style={{ fontSize: '0.65rem' }}>
            <span style={{ color: 'var(--danger)' }}>⚡</span> FIREWALL_BLOCK
          </h2>
          <span style={{ fontSize: '0.6rem', opacity: 0.5, flexShrink: 0 }}>
            {isKillswitchOpen ? '[ COLLAPSE ]' : '[ EXPAND ]'}
          </span>
        </div>

        {isKillswitchOpen && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input 
              type="text" 
              placeholder="Malicious IP (e.g. 192.168.1.1)" 
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
                  style={{ flex: 1, fontSize: '0.6rem', border: ruleType === type ? '1px solid var(--primary)' : '1px solid var(--border)' }}
                >
                  {type}
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%', fontSize: '0.7rem' }}>GENERATE RULE</button>
            
            {generatedRule && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.8rem', 
                background: 'var(--code-bg)', 
                borderRadius: '4px', 
                borderLeft: '2px solid var(--danger)',
                fontSize: '0.7rem'
              }}>
                <code>{generatedRule}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(generatedRule)}
                  style={{ display: 'block', marginTop: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.6rem' }}
                >
                  COPY_TO_CLIPBOARD
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
