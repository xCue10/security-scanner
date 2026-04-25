'use client';

import React from 'react';
import { useLogs } from '@/context/LogContext';

export default function AttackSurfaceMap() {
  const { logs } = useLogs();
  
  if (logs.length === 0) return null;

  // Extract unique IPs and Endpoints from logs
  const nodes: { id: string, type: 'ip' | 'endpoint' }[] = [];
  const links: { source: string, target: string }[] = [];

  logs.slice(0, 20).forEach(log => {
    // Fake extraction for visualization
    const ip = `IP-${log.source.substring(0, 3)}`;
    const endpoint = `/api/${log.message.split(' ')[0].substring(0, 5)}`;
    
    if (!nodes.find(n => n.id === ip)) nodes.push({ id: ip, type: 'ip' });
    if (!nodes.find(n => n.id === endpoint)) nodes.push({ id: endpoint, type: 'endpoint' });
    
    links.push({ source: ip, target: endpoint });
  });

  const width = 400;
  const height = 300;

  return (
    <div className="card">
      <h3>Attack Surface Map</h3>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {links.map((link, i) => {
          const sIndex = nodes.findIndex(n => n.id === link.source);
          const tIndex = nodes.findIndex(n => n.id === link.target);
          const x1 = 50 + (sIndex * 50) % (width - 100);
          const y1 = 50 + (sIndex * 30) % (height - 100);
          const x2 = 50 + (tIndex * 50) % (width - 100);
          const y2 = 50 + (tIndex * 30) % (height - 100);
          
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
          );
        })}
        
        {nodes.map((node, i) => {
          const x = 50 + (i * 50) % (width - 100);
          const y = 50 + (i * 30) % (height - 100);
          return (
            <g key={node.id}>
              <circle cx={x} cy={y} r={node.type === 'ip' ? 6 : 4} fill={node.type === 'ip' ? 'var(--danger)' : 'var(--secondary)'} />
              <text x={x + 10} y={y + 5} fill="var(--foreground)" fontSize="8" style={{ pointerEvents: 'none' }}>{node.id}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: '0.7rem', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <span><span style={{ color: 'var(--danger)' }}>●</span> Attacker IP</span>
        <span><span style={{ color: 'var(--secondary)' }}>●</span> Endpoint Target</span>
      </div>
    </div>
  );
}
