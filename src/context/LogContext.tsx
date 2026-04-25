'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  raw: string;
  analysis?: string;
  riskScore?: number;
}

interface LogContextType {
  logs: LogEntry[];
  addLogs: (newLogs: LogEntry[]) => void;
  updateLogs: (updates: Partial<LogEntry>[]) => void;
  clearLogs: () => void;
  isProcessing: boolean;
  setIsProcessing: (status: boolean) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addLogs = (newLogs: LogEntry[]) => {
    setLogs(prev => [...newLogs, ...prev].slice(0, 1000)); // Keep last 1000 for performance
  };

  const updateLogs = (updates: Partial<LogEntry>[]) => {
    setLogs(prev => prev.map(log => {
      const update = updates.find(u => u.id === log.id);
      return update ? { ...log, ...update } : log;
    }));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs, addLogs, updateLogs, clearLogs, isProcessing, setIsProcessing }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
