'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Settings, Shield, User, Bell, Sliders, 
  Trash2, Save, Check, AlertTriangle, Moon, Sun, ArrowLeft, RotateCcw 
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [pseudonymUsername, setPseudonymUsername] = useState('');
  const [publicProfile, setPublicProfile] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [communityNotifs, setCommunityNotifs] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const currentUser = StorageEngine.getUser();
    setUser(currentUser);
    setDisplayName(currentUser.display_name || '');
    setHeadline(currentUser.headline || '');
    setBio(currentUser.bio || '');
    setPseudonymUsername(currentUser.pseudonym_username || 'shadow_user');

    const currentTheme = (localStorage.getItem('linkedout_theme') as 'light' | 'dark') || 'light';
    setTheme(currentTheme);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    StorageEngine.updateUser({
      display_name: displayName,
      headline,
      bio,
      pseudonym_username: pseudonymUsername
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('linkedout_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleResetCache = () => {
    if (confirm('Are you sure you want to restore default mock datasets? This resets your local test data.')) {
      localStorage.clear();
      window.location.href = '/feed';
    }
  };

  const handleResetOnboarding = () => {
    StorageEngine.resetOnboarding();
    window.location.href = '/feed';
  };

  if (!user) return null;

  return (
    <div className="settings-page">
      <div className="app-container settings-container">
        <Link href="/feed" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </Link>

        <div className="settings-header">
          <div className="header-badge">
            <Settings size={16} />
            <span>Preferences & Security</span>
          </div>
          <h1>Account & Privacy Settings</h1>
          <p>Manage your professional visibility, pseudonym identity, and data controls.</p>
        </div>

        {savedSuccess && (
          <div className="card save-toast animate-fade-in">
            <Check size={18} className="text-success" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="settings-form">
          {/* Section 1: Professional Identity */}
          <div className="card settings-card">
            <div className="card-section-header">
              <User size={18} className="text-primary" />
              <h3>Public Professional Identity</h3>
            </div>
            <p className="card-section-desc">
              Your public profile details visible to peers, recruiters, and community members.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="dispName">Display Name</label>
              <input
                id="dispName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="headline">Professional Headline</label>
              <input
                id="headline"
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Distributed Systems Engineer"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">About & Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Section 2: Protected Pseudonym Mode */}
          <div className="card settings-card">
            <div className="card-section-header">
              <Shield size={18} className="text-purple" />
              <h3>Protected Pseudonymous Identity</h3>
            </div>
            <p className="card-section-desc">
              Your pseudonym allows honest participation in workplace culture debates and company reviews without leaking your real identity.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="pseudoName">Pseudonym Handle</label>
              <div className="input-prefix-box">
                <span className="prefix">@</span>
                <input
                  id="pseudoName"
                  type="text"
                  required
                  value={pseudonymUsername}
                  onChange={(e) => setPseudonymUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="input prefixed"
                />
              </div>
            </div>

            {/* Demographics Privacy Guarantee Note */}
            <div className="privacy-guarantee-box">
              <div className="guarantee-header">
                <Shield size={16} className="text-purple" />
                <strong>Demographic Privacy Policy</strong>
              </div>
              <p>
                Age Range ({user.age_range || 'Not specified'}) and Gender ({user.gender || 'Not specified'}) are strictly private attributes. They are permanently excluded from public endpoints, profile pages, and credibility scoring.
              </p>
            </div>
          </div>

          {/* Section 3: Interface & Notifications */}
          <div className="card settings-card">
            <div className="card-section-header">
              <Sliders size={18} className="text-primary" />
              <h3>Preferences & Display</h3>
            </div>

            <div className="setting-toggle-row">
              <div>
                <strong>Theme Mode</strong>
                <p>Toggle between clean light surfaces and low-light dark theme.</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary btn-sm"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
              </button>
            </div>

            <div className="setting-toggle-row">
              <div>
                <strong>Public Discovery</strong>
                <p>Allow your profile to appear in global member searches and recommended connections.</p>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="setting-toggle-row">
              <div>
                <strong>Community Notification Alerts</strong>
                <p>Receive notifications when someone replies to your technical RFCs.</p>
              </div>
              <input
                type="checkbox"
                checked={communityNotifs}
                onChange={(e) => setCommunityNotifs(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="settings-action-bar">
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="card danger-card">
          <div className="danger-header">
            <AlertTriangle size={18} className="text-error" />
            <h4>Developer Data Controls</h4>
          </div>
          <p>Reset mock data and re-seed all initial stories, companies, and discussions.</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <button onClick={handleResetOnboarding} className="btn btn-secondary btn-sm">
              <RotateCcw size={14} />
              <span>Reset Onboarding (Trigger Modal)</span>
            </button>
            <button onClick={handleResetCache} className="btn btn-outline btn-sm text-error">
              <Trash2 size={14} />
              <span>Restore Factory Mock Data</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-page {
          padding: 2.5rem 0 5rem;
        }

        .settings-container {
          max-width: 680px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--brand-primary);
          margin-bottom: 1.5rem;
        }

        .settings-header {
          margin-bottom: 2rem;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .settings-header h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
        }

        .settings-header p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .save-toast {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          padding: 0.75rem 1rem;
          color: var(--success);
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-card {
          padding: 1.75rem;
          background: var(--surface-card);
        }

        .card-section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .card-section-header h3 {
          font-size: 1.15rem;
        }

        .card-section-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }

        .input-prefix-box {
          display: flex;
          align-items: center;
        }

        .prefix {
          padding: 0.65rem 0.85rem;
          background: var(--surface-hover);
          border: 1.5px solid var(--border-subtle);
          border-right: none;
          border-radius: var(--radius-md) 0 0 var(--radius-md);
          color: var(--text-muted);
          font-weight: 600;
        }

        .input.prefixed {
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }

        .privacy-guarantee-box {
          background: rgba(126, 34, 206, 0.08);
          border: 1px solid rgba(192, 132, 252, 0.3);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          margin-top: 1.25rem;
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .guarantee-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.35rem;
          color: #7E22CE;
        }

        [data-theme="dark"] .guarantee-header {
          color: #C084FC;
        }

        .setting-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-subtle);
          gap: 1rem;
        }

        .setting-toggle-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .setting-toggle-row strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .setting-toggle-row p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .toggle-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--brand-primary);
        }

        .settings-action-bar {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .danger-card {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--surface-card);
          border-color: rgba(220, 38, 38, 0.3);
        }

        .danger-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .danger-header h4 {
          font-size: 0.95rem;
          color: var(--error);
        }

        .danger-card p {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .text-purple { color: #9333EA; }
        .text-error { color: var(--error); }
      `}</style>
    </div>
  );
}
