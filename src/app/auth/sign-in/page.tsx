'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { StorageEngine } from '@/lib/storage';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Sign-in successful with local session or Supabase
      setLoading(false);
      router.push('/feed');
    }, 600);
  };

  const handleGuestDemo = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/feed');
    }, 300);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-card-header">
          <div className="auth-logo-badge">LO</div>
          <h2>Welcome back to LinkedOut</h2>
          <p>Your work, your network, and your authentic professional story.</p>
        </div>

        {error && <div className="badge badge-red auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Work or Personal Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                id="email"
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <label htmlFor="password">Password</label>
              <Link href="/auth/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                id="password"
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input with-icon"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">
          <span>or quickly preview</span>
        </div>

        <button onClick={handleGuestDemo} className="btn btn-secondary auth-demo-btn">
          <Sparkles size={16} />
          <span>Continue as Demo Professional</span>
        </button>

        <div className="auth-card-footer">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="auth-footer-link">
            Create account &rarr;
          </Link>
        </div>
      </div>

      <style jsx>{`
        .auth-page-container {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 2.25rem;
          background: var(--surface-card);
          box-shadow: var(--shadow-lg);
        }

        .auth-card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-logo-badge {
          display: inline-block;
          background: var(--brand-primary);
          color: #FFF;
          font-weight: 800;
          font-size: 1.1rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.85rem;
        }

        .auth-card-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.35rem;
        }

        .auth-card-header p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .auth-alert {
          margin-bottom: 1rem;
          padding: 0.5rem 0.75rem;
          display: block;
          text-align: center;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input.with-icon {
          padding-left: 2.5rem;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: var(--brand-primary);
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.75rem;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-subtle);
        }

        .auth-divider span {
          padding: 0 0.75rem;
        }

        .auth-demo-btn {
          width: 100%;
          padding: 0.65rem;
        }

        .auth-card-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .auth-footer-link {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .auth-footer-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
