'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="btn"
      style={{ 
        width: '100%', 
        marginTop: '0.5rem', 
        fontSize: '0.6rem', 
        borderColor: 'var(--danger)',
        color: 'var(--danger)',
        opacity: 0.8
      }}
    >
      ◈ TERMINATE_SESSION
    </button>
  );
}
