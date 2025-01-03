'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'HOSPITAL') {
      router.push('/');
    }
  }, [session, status, router]);

  if (session && session.user.role === 'HOSPITAL') {
    return children;
  }

  return null;
}
