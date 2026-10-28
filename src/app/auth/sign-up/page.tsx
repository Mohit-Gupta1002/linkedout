'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { StorageEngine } from '@/lib/storage';

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save initial user state
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_') || 'developer';
    StorageEngine.updateUser({
      display_name: displayName,
      username,
      email,
      onboarding_completed: false
    });

    setTimeout(() => {
      setLoading(false);
      // Route to Onboarding Step 1
      router.push('/auth/onboarding');
    }, 400);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-card-header">
          <div className="auth-logo-badge">LO</div>
          <h2>Join LinkedOut</h2>
          <p>Your professional life deserves a better feed.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="displayName">Your Full or Preferred Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                id="displayName"
                type="text" 
                required 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Meera Raman"
                className="input with-icon"
              />
            </div>
          </div>

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
                placeholder="meera@example.com"
                className="input with-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password (at least 6 characters)</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                id="password"
                type="password" 
                required 
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="input with-icon"
              />
            </div>
          </div>

          <div className="privacy-reassurance">
            <ShieldCheck size={16} className="shield-icon" />
            <span>We never sell data or scrape contacts. Your sensitive workplace reviews are protected by separate pseudonyms.</span>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
            {loading ? 'Creating Account...' : 'Continue to Profile Setup'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-card-footer">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="auth-footer-link">
            Sign In &rarr;
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
          max-width: 460px;
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

        .privacy-reassurance {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: var(--surface-hover);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 1.25rem 0;
          line-height: 1.4;
        }

        .shield-icon {
          color: var(--brand-primary);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.75rem;
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
