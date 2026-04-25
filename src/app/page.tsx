'use client';

import React from 'react';
import LogUploader from "@/components/LogUploader";
import LogFeed from "@/components/LogFeed";
import ForensicGraph from "@/components/ForensicGraph";
import MitigationPanel from "@/components/MitigationPanel";
import PentestModule from "@/components/PentestModule";
import AttackSurfaceMap from "@/components/AttackSurfaceMap";
import AdvancedTools from "@/components/AdvancedTools";
import ThreatMap from "@/components/ThreatMap";
import Copilot from "@/components/Copilot";

export default function Home() {
  return (
    <main className="container">
      {/* HEADER SECTION */}
      <header style={{ 
        marginBottom: '3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'var(--glass-bg)',
        padding: '1.5rem 2rem',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Vanguard Security Suite</h1>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span><span className="status-dot online"></span> System: Operational</span>
            <span style={{ color: 'var(--primary)' }}>Scan Engine: Active</span>
          </div>
        </div>
        <button onClick={() => window.print()} className="btn">
          Generate Intelligence Report
        </button>
      </header>

      {/* PRIMARY VISUALIZATION GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card" style={{ margin: 0 }}>
          <h2><span style={{ color: 'var(--primary)' }}>◈</span> Threat Matrix</h2>
          <ForensicGraph />
        </div>
        <ThreatMap />
        <div className="card" style={{ margin: 0 }}>
          <h2><span style={{ color: 'var(--secondary)' }}>◈</span> Surface Vector</h2>
          <AttackSurfaceMap />
        </div>
      </div>

      {/* CORE OPERATIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr 350px', gap: '2rem' }}>
        
        {/* LEFT COLUMN: Offensive & Ingestion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ margin: 0 }}>
            <h2><span style={{ color: 'var(--accent)' }}>▼</span> Ingestion</h2>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1.5rem' }}>Drop logs into the secure buffer for parsing.</p>
            <LogUploader />
          </div>
          
          <PentestModule />

          <Copilot />
        </div>

        {/* CENTER COLUMN: Analysis Feed */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
          <h2><span style={{ color: 'var(--primary)' }}>▼</span> Live Forensic Stream</h2>
          <LogFeed />
        </div>

        {/* RIGHT COLUMN: Deception & Mitigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AdvancedTools />
          <MitigationPanel />
          
          <div className="card" style={{ margin: 0 }}>
            <h2><span style={{ color: 'var(--warning)' }}>▼</span> System Diagnostics</h2>
            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>AI CORES:</span>
                <span style={{ color: 'var(--accent)' }}>STABLE (1.5-FLASH)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>LOCAL DB:</span>
                <span style={{ color: 'var(--accent)' }}>SYNCED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>GEO-LOCK:</span>
                <span style={{ color: 'var(--primary)' }}>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
