'use client';

import React, { useState } from 'react';
import { useLogs, LogEntry } from '@/context/LogContext';
import JSZip from 'jszip';

export default function LogUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const { addLogs, setIsProcessing } = useLogs();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFiles(files);
  };

  const parseLogContent = (text: string, sourceName: string): LogEntry[] => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.map((line, index) => ({
      id: `${sourceName}-${Date.now()}-${index}`,
      timestamp: new Date().toISOString(),
      source: sourceName,
      message: line,
      level: line.toLowerCase().includes('error') ? 'error' : 
             line.toLowerCase().includes('warning') ? 'warning' : 'info',
      raw: line
    }));
  };

  const processFiles = async (files: FileList) => {
    setIsProcessing(true);
    const allNewEntries: LogEntry[] = [];
    for (const file of Array.from(files)) {
      if (file.name.endsWith('.zip')) {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const [filename, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir && (filename.endsWith('.log') || filename.endsWith('.txt') || filename.endsWith('.csv'))) {
              const content = await zipEntry.async('string');
              allNewEntries.push(...parseLogContent(content, `${file.name}/${filename}`));
            }
          }
        } catch (error) { console.error(error); }
      } else {
        const text = await file.text();
        allNewEntries.push(...parseLogContent(text, file.name));
      }
    }
    addLogs(allNewEntries);
    setIsProcessing(false);
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `1px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: '8px',
        padding: '2.5rem 1rem',
        textAlign: 'center',
        background: isDragging ? 'rgba(0, 242, 255, 0.05)' : 'rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
      <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: isDragging ? 'var(--primary)' : 'var(--foreground)', opacity: 0.5 }}>⇮</div>
        <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', color: isDragging ? 'var(--primary)' : 'inherit' }}>
          {isDragging ? 'RELEASE TO INGEST' : 'SECURE LOG DROP'}
        </p>
        <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.5rem' }}>SUPPORTED: .ZIP, .LOG, .CSV, .TXT</p>
      </label>
    </div>
  );
}
