'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { StorageEngine } from '@/lib/storage';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="callback-container">Completing verification...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Process Supabase token or local callback
    const nextUrl = searchParams.get('next') || '/feed';
    const timer = setTimeout(() => {
      router.push(nextUrl);
    }, 800);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="callback-container">
      <div className="card callback-card">
        <Sparkles size={36} className="callback-spinner text-primary" />
        <h2>Verifying your credentials...</h2>
        <p>Connecting you to your LinkedOut professional dashboard.</p>
      </div>

      <style jsx>{`
        .callback-container {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .callback-card {
          padding: 2.5rem 2rem;
          text-align: center;
          max-width: 420px;
          background: var(--surface-card);
        }

        .callback-spinner {
          margin: 0 auto 1.25rem;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .callback-card h2 {
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
        }

        .callback-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
