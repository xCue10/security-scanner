'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="btn"
      style={{ 
        width: '100%', 
        marginTop: '1rem', 
        fontSize: '0.6rem', 
        borderColor: 'var(--border)',
        opacity: 0.8
      }}
    >
      {theme === 'dark' ? '◈ DAYLIGHT_AUDIT' : '◈ NIGHT_OPS'}
    </button>
  );
}
