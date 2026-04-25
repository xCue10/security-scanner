'use client';

import React from 'react';
import { useLogs } from '@/context/LogContext';

export default function ForensicGraph() {
  const { logs } = useLogs();
  
  if (logs.length === 0) {
    return (
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', opacity: 0.5 }}>
        <p>Awaiting data for visualization...</p>
      </div>
    );
  }

  // Filter logs with risk scores for the graph
  const riskLogs = logs.filter(l => l.riskScore !== undefined);
  
  const width = 800;
  const height = 150;
  const padding = 20;

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3>Threat Timeline</h3>
      <div style={{ overflowX: 'auto' }}>
        <svg width={width} height={height} style={{ background: '#010409', borderRadius: '4px' }}>
          {/* Timeline axis */}
          <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="var(--border)" strokeWidth="2" />
          
          {riskLogs.map((log, i) => {
            const x = padding + (i * (width - 2 * padding) / Math.max(riskLogs.length - 1, 1));
            const risk = log.riskScore || 0;
            const y = height / 2 - (risk / 100 * (height / 2 - padding));
            const color = risk > 70 ? 'var(--danger)' : risk > 30 ? 'var(--warning)' : 'var(--secondary)';
            
            return (
              <g key={log.id}>
                <line x1={x} y1={height/2} x2={x} y2={y} stroke={color} strokeWidth="1" strokeDasharray="2,2" />
                <circle 
                  cx={x} 
                  cy={y} 
                  r="4" 
                  fill={color} 
                  style={{ cursor: 'pointer' }}
                >
                  <title>{`${log.source}: ${log.riskScore}% Risk\n${log.analysis}`}</title>
                </circle>
              </g>
            );
          })}

          {riskLogs.length === 0 && (
            <text x={width/2} y={height/2 + 20} fill="var(--foreground)" textAnchor="middle" style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              No AI analysis data yet. Run analysis to see the timeline.
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
