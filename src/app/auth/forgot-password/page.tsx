'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <Link href="/auth/sign-in" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </Link>

        <div className="auth-card-header">
          <h2>Reset your password</h2>
          <p>Enter the email associated with your LinkedOut account to receive recovery instructions.</p>
        </div>

        {sent ? (
          <div className="sent-message card">
            <CheckCircle2 size={36} className="sent-icon" />
            <h3>Check your inbox</h3>
            <p>We sent a secure password reset link to <strong>{email}</strong>.</p>
            <Link href="/auth/sign-in" className="btn btn-primary btn-sm mt-3">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Your Email Address</label>
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

            <button type="submit" className="btn btn-primary auth-submit-btn">
              Send Password Reset Link
            </button>
          </form>
        )}
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

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .back-link:hover {
          color: var(--brand-primary);
        }

        .auth-card-header {
          margin-bottom: 1.5rem;
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

        .auth-submit-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.5rem;
        }

        .sent-message {
          text-align: center;
          padding: 2rem 1rem;
          background: var(--surface-hover);
        }

        .sent-icon {
          color: var(--success);
          margin: 0 auto 0.75rem;
        }

        .sent-message h3 {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }

        .sent-message p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
