'use client';

import React, { useState } from 'react';
import { useLogs, LogEntry } from '@/context/LogContext';

import JSZip from 'jszip';

export default function LogUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const { addLogs, setIsProcessing } = useLogs();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
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
        } catch (error) {
          console.error(`Error processing zip file ${file.name}:`, error);
        }
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
        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: '6px',
        padding: '2rem',
        textAlign: 'center',
        background: isDragging ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
    >
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        id="fileInput"
      />
      <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
        <p style={{ marginBottom: '0.5rem' }}>Drag & drop files here</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>or click to browse</p>
      </label>
    </div>
  );
}
