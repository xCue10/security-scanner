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
import IntegrityLab from "@/components/IntegrityLab";
import ShadowRecon from "@/components/ShadowRecon";

export default function Home() {
  const [activeTab, setActiveTab] = useState('forensics');

  return (
    <main style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#020408' }}>
      <NotificationManager />

      {/* FIXED SIDEBAR NAVIGATION */}
      <nav style={{ 
        width: '240px', 
        borderRight: '1px solid var(--border)', 
        background: '#0a0c10',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        zIndex: 100
      }}>
        <div style={{ padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '0.2rem' }}>VANGUARD</h1>
          <p style={{ fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase' }}>SOC_OPERATIONS</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {['forensics', 'offensive', 'deception', 'audit'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                textAlign: 'left',
                padding: '0.7rem 1rem',
                borderRadius: '4px',
                background: activeTab === tab ? 'rgba(0, 242, 255, 0.05)' : 'transparent',
                border: 'none',
                color: activeTab === tab ? 'var(--primary)' : 'var(--foreground)',
                fontSize: '0.75rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem' }}>
            <span className="status-dot online"></span>
            <span style={{ opacity: 0.6 }}>ENGINE_STABLE</span>
          </div>
        </div>
      </nav>

      {/* MAIN VIEWPORT */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP STATUS BAR */}
        <header style={{ 
          height: '60px', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 2rem',
          background: '#0a0c10'
        }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '1px' }}>
            OPERATOR_SESSION: <span style={{ color: 'var(--primary)' }}>{typeof window !== 'undefined' ? window.crypto.randomUUID().substring(0, 8).toUpperCase() : '...'}</span>
          </div>
          <button onClick={() => window.print()} className="btn" style={{ fontSize: '0.6rem', height: '32px' }}>GENERATE_INTEL_REPORT</button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', background: 'radial-gradient(circle at 50% 50%, #0d1117 0%, #020408 100%)' }}>
          
          {activeTab === 'forensics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
              
              {/* ROW 1: GLOBAL INTELLIGENCE & KILLSWITCH */}
              <IntelligenceHub />

              {/* ROW 2: PRIMARY FOCAL POINT (The Map) */}
              <div style={{ height: '350px' }}>
                <ThreatMap />
              </div>

              {/* ROW 3: THREE-COLUMN ANALYSIS WORKSPACE */}
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: '1.5rem' }}>
                
                {/* COLUMN 1: INTAKE TOOLS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '1rem' }}>◈ PHASE_01: INTAKE</h3>
                    <div className="card" style={{ margin: 0, padding: '1rem', borderStyle: 'dashed' }}>
                      <LogUploader />
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '1rem' }}>◈ PHASE_02: INTEGRITY</h3>
                    <IntegrityLab />
                  </div>
                </div>

                {/* COLUMN 2: CORE MONITORING */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>◈ PHASE_03: TEMPORAL_MATRIX</h3>
                  <div className="card" style={{ margin: 0, minHeight: '300px' }}>
                    <ForensicGraph />
                  </div>
                  <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>◈ PHASE_04: INTELLIGENCE_FEED</h3>
                  <div className="card" style={{ margin: 0, flex: 1 }}>
                    <LogFeed />
                  </div>
                </div>

                {/* COLUMN 3: RESULTS & MITIGATION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>◈ PHASE_05: ARTIFACT_EXTRACTION</h3>
                  <ForensicArtifacts />
                  <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>◈ PHASE_06: MITIGATION_PLAN</h3>
                  <MitigationPanel />
                </div>

              </div>
            </div>
          )}

          {activeTab === 'offensive' && (
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <PentestModule />
                <ShadowRecon />
                <NetworkBreachModule />
              </div>
              <div className="card" style={{ margin: 0 }}>
                <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>SURFACE VECTOR ANALYSIS</h3>
                <AttackSurfaceMap />
              </div>
            </div>
          )}

          {activeTab === 'deception' && (
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <AdvancedTools />
              <div className="card">
                <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>HONEYPOT STATUS</h3>
                <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Monitoring active canary endpoints...</p>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              <Copilot />
              <div className="card">
                <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>SECURITY POSTURE</h3>
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
