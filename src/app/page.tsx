'use client';

import React, { useState } from 'react';
import LogUploader from "@/components/LogUploader";
import LogFeed from "@/components/LogFeed";
import ForensicGraph from "@/components/ForensicGraph";
import MitigationPanel from "@/components/MitigationPanel";
import PentestModule from "@/components/PentestModule";
import AttackSurfaceMap from "@/components/AttackSurfaceMap";
import AdvancedTools from "@/components/AdvancedTools";
import ThreatMap from "@/components/ThreatMap";
import Copilot from "@/components/Copilot";
import NotificationManager from "@/components/NotificationManager";
import NetworkBreachModule from "@/components/NetworkBreachModule";
import IntelligenceHub from "@/components/IntelligenceHub";
import ForensicArtifacts from "@/components/ForensicArtifacts";

export default function Home() {
  const [activeTab, setActiveTab] = useState('forensics');

  return (
    <main style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#020408' }}>
      <NotificationManager />

      {/* NAVIGATION SIDEBAR */}
      <nav style={{ 
        width: '280px', 
        borderRight: '1px solid var(--border)', 
        background: '#0a0c10',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        zIndex: 100
      }}>
        <div style={{ padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.2rem', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '0.2rem' }}>VANGUARD</h1>
          <p style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>Security Operations Suite</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {['forensics', 'offensive', 'deception', 'audit'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                textAlign: 'left',
                padding: '0.8rem 1rem',
                borderRadius: '6px',
                background: activeTab === tab ? 'rgba(0, 242, 255, 0.05)' : 'transparent',
                border: 'none',
                color: activeTab === tab ? 'var(--primary)' : 'var(--foreground)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                borderLeft: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
            <span className="status-dot online"></span>
            <span style={{ opacity: 0.6 }}>SYSTEM READY</span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <header style={{ 
          height: '70px', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 2rem',
          background: '#0a0c10'
        }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            SESSION_ID: <span style={{ color: 'var(--primary)' }}>{typeof window !== 'undefined' ? window.crypto.randomUUID().substring(0, 8) : '...'}</span>
          </div>
          <button onClick={() => window.print()} className="btn" style={{ fontSize: '0.7rem' }}>EXPORT_INTEL</button>
        </header>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'radial-gradient(circle at 50% 50%, #0d1117 0%, #020408 100%)' }}>
          
          {activeTab === 'forensics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* TOP ROW: GLOBAL INTELLIGENCE */}
              <IntelligenceHub />

              {/* SECOND ROW: PRIMARY VISUALS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ margin: 0, height: '350px' }}>
                  <h2>TEMPORAL MATRIX</h2>
                  <ForensicGraph />
                </div>
                <ThreatMap />
              </div>

              {/* THIRD ROW: DEEP-DIVE WORKSPACE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '1.5rem', minHeight: '500px' }}>
                <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <h2>INTELLIGENCE FEED</h2>
                  <LogFeed />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <ForensicArtifacts />
                  <MitigationPanel />
                </div>

                <div className="card" style={{ margin: 0 }}>
                  <h2>INGEST BUFFER</h2>
                  <LogUploader />
                  <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(0, 242, 255, 0.02)' }}>
                    <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>STUDENT_NOTE</h3>
                    <p style={{ fontSize: '0.65rem', opacity: 0.6, lineHeight: '1.4' }}>
                      Artifact extraction is performing real-time Shannon Entropy checks and IoC matching on the ingest buffer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offensive' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <PentestModule />
                <NetworkBreachModule />
              </div>
              <div className="card" style={{ margin: 0 }}>
                <h2>SURFACE VECTOR ANALYSIS</h2>
                <AttackSurfaceMap />
              </div>
            </div>
          )}

          {activeTab === 'deception' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <AdvancedTools />
              <div className="card">
                <h2>HONEYPOT STATUS</h2>
                <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Monitoring active canary endpoints...</p>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              <Copilot />
              <div className="card">
                <h2>SECURITY POSTURE</h2>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--primary)' }}>A+</div>
                  <p style={{ opacity: 0.6, fontSize: '0.7rem' }}>Current Infrastructure Integrity</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
