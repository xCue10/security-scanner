'use client';

import { useEffect, useRef } from 'react';
import { useLogs } from '@/context/LogContext';

export default function NotificationManager() {
  const { logs } = useLogs();
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission on mount
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const criticalLogs = logs.filter(log => 
      log.riskScore && log.riskScore >= 80 && !notifiedIds.current.has(log.id)
    );

    criticalLogs.forEach(log => {
      if (Notification.permission === 'granted') {
        new Notification('VANGUARD CRITICAL ALERT', {
          body: `High Risk (${log.riskScore}%): ${log.message.substring(0, 50)}...`,
          icon: '/favicon.ico'
        });
        notifiedIds.current.add(log.id);
      }
    });
  }, [logs]);

  return null;
}
