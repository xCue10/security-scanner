'use client';

import LogUploader from "@/components/LogUploader";
import LogFeed from "@/components/LogFeed";
import ForensicGraph from "@/components/ForensicGraph";
import MitigationPanel from "@/components/MitigationPanel";
import PentestModule from "@/components/PentestModule";

export default function Home() {
  return (
    <main className="container">
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>AI Security Forensics Dashboard</h1>
          <p style={{ opacity: 0.8 }}>Local Log Analysis & Threat Intelligence</p>
        </div>
        <button onClick={() => window.print()} className="btn">
          Export Forensic Report
        </button>
      </header>

      <ForensicGraph />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <section>
          <div className="card">
            <h2>Ingestion</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Upload your security logs (ZIP, LOG, TXT, CSV) to begin analysis.
            </p>
            <LogUploader />
          </div>

          <PentestModule />

          <MitigationPanel />
          
          <div className="card">
            <h2>System Status</h2>
            <div style={{ fontSize: '0.8rem' }}>
              <p>● AI Engine: <span style={{ color: 'var(--secondary)' }}>Ready</span></p>
              <p>● Local Storage: <span style={{ color: 'var(--secondary)' }}>Connected</span></p>
              <p>● Ingestion: <span style={{ color: 'var(--foreground)' }}>Idle</span></p>
            </div>
          </div>
        </section>

        <section>
          <div className="card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <h2>Forensic Feed</h2>
            <LogFeed />
          </div>
        </section>
      </div>
    </main>
  );
}
