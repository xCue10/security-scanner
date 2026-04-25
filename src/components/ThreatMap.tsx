'use client';

import React from 'react';
import { useLogs } from '@/context/LogContext';

export default function ThreatMap() {
  const { logs } = useLogs();
  
  // Simulated coordinates for visual impact
  const points = logs.slice(0, 15).map((log, i) => ({
    id: log.id,
    x: 50 + (Math.sin(i * 133.5) * 150) + 150,
    y: 50 + (Math.cos(i * 97.2) * 70) + 70,
    risk: log.riskScore || 20
  }));

  return (
    <div className="card" style={{ height: '300px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      <h2 style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
        <span style={{ color: 'var(--danger)' }}>◈</span> GLOBAL THREAT MAP
      </h2>
      
      <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
        {/* Stylized Map Outline (Simplified) */}
        <path d="M50,80 Q70,50 100,60 T150,80 T200,70 T250,90 T300,60 T350,100 L350,150 Q300,180 250,160 T150,170 T50,140 Z" 
              fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
        
        {/* Attack Pings */}
        {points.map((p, i) => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r="2" fill={p.risk > 70 ? 'var(--danger)' : 'var(--primary)'}>
              <animate attributeName="r" from="2" to="8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="1.5" fill={p.risk > 70 ? 'var(--danger)' : 'var(--primary)'} />
            
            {/* Arcs to center (simulated home base) */}
            <path d={`M${p.x},${p.y} Q${(p.x + 200)/2},${Math.min(p.y, 100) - 20} 200,100`} 
                  stroke={p.risk > 70 ? 'var(--danger)' : 'var(--primary)'} 
                  strokeWidth="0.2" 
                  fill="none" 
                  opacity="0.3" 
                  strokeDasharray="2,2">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
            </path>
          </g>
        ))}
      </svg>
      
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '0.6rem', color: 'var(--danger)', letterSpacing: '1px' }}>
        LIVE ATTACK TELEMETRY: ACTIVE
      </div>
    </div>
  );
}
