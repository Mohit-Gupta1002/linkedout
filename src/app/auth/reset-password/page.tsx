'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 600);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-card-header">
          <div className="auth-logo-badge">LO</div>
          <h2>Create New Password</h2>
          <p>Please enter and confirm your new secure password.</p>
        </div>

        {error && <div className="badge badge-red auth-alert">{error}</div>}

        {success ? (
          <div className="success-box text-center">
            <CheckCircle2 size={44} className="text-success success-icon" />
            <h3>Password Updated!</h3>
            <p>Your password has been reset successfully. You can now sign in with your new credentials.</p>
            <Link href="/auth/sign-in" className="btn btn-primary auth-submit-btn mt-3">
              Proceed to Sign In &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="input with-icon"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary auth-submit-btn">
              {loading ? 'Updating Password...' : 'Save New Password'}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div className="auth-card-footer">
          <Link href="/auth/sign-in" className="auth-footer-link">
            &larr; Back to Sign In
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

        .auth-submit-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.75rem;
        }

        .success-box {
          padding: 1.5rem 0;
        }

        .success-icon {
          margin: 0 auto 0.75rem;
        }

        .success-box h3 {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }

        .success-box p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .text-center {
          text-align: center;
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
