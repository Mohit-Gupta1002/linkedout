'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, Sparkles, User, 
  ArrowRight, ArrowLeft, Lock, Calendar, Globe, MapPin, 
  Briefcase, Check
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { UserProfile, ProfessionalStatus, ProfessionalDomain, ExperienceLevel } from '@/types';

interface OnboardingModalProps {
  onComplete?: () => void;
}

const DOMAIN_OPTIONS: ProfessionalDomain[] = [
  'Software Engineering', 'AI & Machine Learning', 'Data Science', 'Product Management',
  'Design & UX', 'Finance & Fintech', 'Marketing', 'Business Development',
  'Human Resources', 'Consulting', 'Entrepreneurship', 'Legal', 'Operations', 'Other'
];

const STATUS_OPTIONS: ProfessionalStatus[] = [
  'Working professional', 'Student', 'Intern', 'Freelancer', 'Founder', 'Job seeker', 'Career break', 'Other'
];

const INTEREST_CHIPS = [
  'AI & Machine Learning', 'Distributed Systems', 'Software Engineering',
  'Product Strategy', 'Workplace Culture', 'Fintech', 'Design Systems',
  'Career Growth', 'Startups', 'System Architecture'
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnderageBlocked, setIsUnderageBlocked] = useState(false);

  // Step 1: Basic Profile Details
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [directAge, setDirectAge] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Bengaluru');
  const [gender, setGender] = useState('Prefer not to say');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  // Step 2: Professional Details
  const [domain, setDomain] = useState<ProfessionalDomain>('Software Engineering');
  const [status, setStatus] = useState<ProfessionalStatus>('Working professional');
  const [experience, setExperience] = useState<ExperienceLevel>('0–2 years');
  const [headline, setHeadline] = useState('');

  // Step 3: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Software Engineering', 'AI & Machine Learning', 'Workplace Culture'
  ]);

  // Step 4: Protected Pseudonym Setup
  const [pseudonymUsername, setPseudonymUsername] = useState('');

  useEffect(() => {
    // Check if user has already completed onboarding
    const isCompleted = StorageEngine.isOnboardingComplete();
    if (!isCompleted) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      // Pre-fill default suggestions if available
      const existingUser = StorageEngine.getUser();
      if (existingUser) {
        setDisplayName(existingUser.display_name || '');
        setUsername(existingUser.username || '');
        setCountry(existingUser.country || 'India');
        setCity(existingUser.city || 'Bengaluru');
        if (existingUser.avatar_url) setAvatarUrl(existingUser.avatar_url);
        if (existingUser.pseudonym_username) setPseudonymUsername(existingUser.pseudonym_username);
      }
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const calculateAge = (dateStr: string): number => {
    const dob = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleValidateStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!displayName.trim()) {
      setErrorMsg('Display name is required.');
      return;
    }
    if (!username.trim()) {
      setErrorMsg('Username is required.');
      return;
    }

    // Determine age
    let computedAge: number | null = null;
    if (birthDate) {
      computedAge = calculateAge(birthDate);
    } else if (directAge.trim()) {
      computedAge = parseInt(directAge.trim(), 10);
    } else {
      setErrorMsg('Age or Date of Birth is required to verify 18+ eligibility.');
      return;
    }

    // Client-side quick check
    if (isNaN(computedAge) || computedAge < 18) {
      setIsUnderageBlocked(true);
      setErrorMsg('LinkedOut is currently available only to people aged 18 and above.');
      return;
    }

    // Server-side robust verification
    setLoading(true);
    try {
      const res = await fetch('/api/auth/validate-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          username: username.trim().toLowerCase(),
          birthDate: birthDate || undefined,
          age: computedAge
        })
      });

      const data = await res.json();

      if (!res.ok || !data.eligible) {
        if (res.status === 403 || data.error?.includes('18')) {
          setIsUnderageBlocked(true);
        }
        setErrorMsg(data.error || data.message || 'Verification failed.');
        setLoading(false);
        return;
      }

      // Automatically generate pseudonym recommendation if empty
      if (!pseudonymUsername) {
        setPseudonymUsername(`shadow_${username.trim().toLowerCase()}`);
      }

      setLoading(false);
      setStep(2);
    } catch (err) {
      console.error('Age validation error:', err);
      // Fallback client validation if offline
      if (computedAge >= 18) {
        setLoading(false);
        setStep(2);
      } else {
        setIsUnderageBlocked(true);
        setErrorMsg('LinkedOut is currently available only to people aged 18 and above.');
        setLoading(false);
      }
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    const profilePayload: Partial<UserProfile> = {
      display_name: displayName.trim(),
      username: username.trim().toLowerCase(),
      country,
      city: city.trim() || undefined,
      avatar_url: avatarUrl,
      domain,
      status,
      experience,
      headline: headline.trim() || `${status} in ${domain}`,
      interests: selectedInterests,
      pseudonym_username: pseudonymUsername.trim().toLowerCase() || `shadow_${username.trim().toLowerCase()}`,
      gender: gender !== 'Prefer not to say' ? gender : undefined,
      is_age_gender_private: true,
      onboarding_completed: true
    };

    try {
      // Server-side complete record
      await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profilePayload })
      });
    } catch (e) {
      console.warn('Server recording completed with offline fallback:', e);
    }

    // Save in storage engine
    StorageEngine.completeOnboarding(profilePayload);
    setLoading(false);
    setIsOpen(false);
    document.body.style.overflow = '';
    if (onComplete) onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="onboarding-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="onboarding-card">
        
        {/* Underage Lockout View */}
        {isUnderageBlocked ? (
          <div className="underage-lockout-container">
            <div className="underage-icon-box">
              <AlertTriangle size={36} className="text-warning" />
            </div>
            <h2 id="modal-title" className="underage-title">Age Requirement Notice</h2>
            <div className="underage-message-card">
              <p>
                <strong>LinkedOut is currently available only to people aged 18 and above.</strong>
              </p>
              <p className="underage-subtext">
                To protect member safety and ensure compliance with professional workplace intelligence standards, our community is reserved exclusively for adult participants.
              </p>
            </div>
            <div className="underage-notice-box">
              <Lock size={15} className="mr-1 inline-block" />
              <span>Registration locked. Access to LinkedOut is restricted until you reach legal adulthood.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header / Brand */}
            <div className="modal-header">
              <div className="brand-badge-pill">
                <span className="brand-dot" />
                <span>LinkedOut Verification & Onboarding</span>
              </div>
              <div className="step-indicator-row">
                {[1, 2, 3, 4].map(s => (
                  <div 
                    key={s} 
                    className={`step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`}
                    title={`Step ${s}`}
                  />
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="modal-error-banner" role="alert">
                <AlertTriangle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Basic Details & Age */}
            {step === 1 && (
              <form onSubmit={handleValidateStep1} className="modal-form">
                <div className="form-intro">
                  <h2 id="modal-title" className="form-title">First, let&apos;s get to know you</h2>
                  <p className="form-subtitle">
                    A few details will help us verify your eligibility and personalize your professional feed.
                  </p>
                </div>

                <div className="form-fields-grid">
                  <div className="form-group">
                    <label className="field-label" htmlFor="dispName">
                      Display Name <span className="req">*</span>
                    </label>
                    <input
                      id="dispName"
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="modal-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label" htmlFor="uName">
                      Username <span className="req">*</span>
                    </label>
                    <div className="input-prefix-box">
                      <span className="input-prefix">@</span>
                      <input
                        id="uName"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        placeholder="aarav_sharma"
                        className="modal-input with-prefix"
                      />
                    </div>
                  </div>

                  {/* 18+ Age & DOB */}
                  <div className="form-group span-2 age-group-highlight">
                    <div className="age-group-header">
                      <label className="field-label" htmlFor="dobInput">
                        Date of Birth or Age <span className="req">*</span>
                      </label>
                      <span className="age-restriction-pill">
                        <Lock size={12} />
                        <span>18+ Platform</span>
                      </span>
                    </div>

                    <div className="dob-age-row">
                      <div className="dob-field-col">
                        <input
                          id="dobInput"
                          type="date"
                          value={birthDate}
                          onChange={(e) => {
                            setBirthDate(e.target.value);
                            setDirectAge('');
                          }}
                          className="modal-input"
                          max={new Date().toISOString().split('T')[0]}
                        />
                        <span className="field-hint">Select date of birth</span>
                      </div>

                      <span className="or-divider">OR</span>

                      <div className="age-field-col">
                        <input
                          type="number"
                          min="18"
                          max="120"
                          value={directAge}
                          onChange={(e) => {
                            setDirectAge(e.target.value);
                            setBirthDate('');
                          }}
                          placeholder="Age (18+)"
                          className="modal-input"
                        />
                        <span className="field-hint">Enter age in years</span>
                      </div>
                    </div>

                    <p className="privacy-field-note">
                      🔒 <strong>Strict Privacy:</strong> Your age and date of birth are private by default and never displayed on your public profile or shared with companies.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="field-label" htmlFor="countrySelect">
                      Country <span className="req">*</span>
                    </label>
                    <input
                      id="countrySelect"
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="modal-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label" htmlFor="cityInput">
                      City <span className="opt">(Optional)</span>
                    </label>
                    <input
                      id="cityInput"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru, Mumbai, Delhi"
                      className="modal-input"
                    />
                  </div>

                  <div className="form-group span-2">
                    <label className="field-label" htmlFor="genderSelect">
                      Gender <span className="opt">(Optional — never displayed publicly)</span>
                    </label>
                    <select
                      id="genderSelect"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="modal-input modal-select"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Woman">Woman</option>
                      <option value="Man">Man</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Self-describe">Self-describe</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions-footer">
                  <div className="privacy-badge-notice">
                    <Shield size={14} className="text-brand" />
                    <span>Private demographic protection active</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !displayName.trim() || !username.trim() || (!birthDate && !directAge)}
                    className="btn btn-primary modal-next-btn"
                  >
                    <span>{loading ? 'Verifying 18+ Eligibility...' : 'Verify & Continue'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Professional World */}
            {step === 2 && (
              <div className="modal-form">
                <div className="form-intro">
                  <h2 className="form-title">What&apos;s your professional world?</h2>
                  <p className="form-subtitle">
                    Connect with engineers, designers, founders, and peers in your technical domain.
                  </p>
                </div>

                <div className="form-fields-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Current Status</label>
                    <div className="chips-picker-grid">
                      {STATUS_OPTIONS.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`chip-choice ${status === st ? 'selected' : ''}`}
                        >
                          {status === st && <Check size={13} className="mr-1" />}
                          <span>{st}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group span-2">
                    <label className="field-label">Primary Professional Domain</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as ProfessionalDomain)}
                      className="modal-input modal-select"
                    >
                      {DOMAIN_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group span-2">
                    <label className="field-label">Headline / Focus</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Distributed Systems Engineer | Building High-Scale Tools"
                      className="modal-input"
                    />
                  </div>
                </div>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary modal-back-btn"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-primary modal-next-btn"
                  >
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Interests & Topics */}
            {step === 3 && (
              <div className="modal-form">
                <div className="form-intro">
                  <h2 className="form-title">Find your technical people</h2>
                  <p className="form-subtitle">
                    Select topics you care about to tune your feed and community recommendations.
                  </p>
                </div>

                <div className="interests-selection-box">
                  {INTEREST_CHIPS.map((chip) => {
                    const isSelected = selectedInterests.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleInterest(chip)}
                        className={`interest-tag-btn ${isSelected ? 'selected' : ''}`}
                      >
                        {isSelected && <Check size={14} />}
                        <span>{chip}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary modal-back-btn"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn btn-primary modal-next-btn"
                  >
                    <span>Continue to Privacy Setup</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Identity & Protected Pseudonym */}
            {step === 4 && (
              <div className="modal-form">
                <div className="form-intro">
                  <h2 className="form-title">Your Identity. Your Choice.</h2>
                  <p className="form-subtitle">
                    LinkedOut gives you two participation modes: your public professional profile and a protected pseudonym.
                  </p>
                </div>

                <div className="dual-mode-explainer-card">
                  <div className="explainer-mode">
                    <div className="mode-badge public">Public Professional</div>
                    <p className="mode-desc">
                      Share verified code repositories, technical RFCs, and career milestones under @{username || 'you'}.
                    </p>
                  </div>
                  <div className="explainer-divider" />
                  <div className="explainer-mode">
                    <div className="mode-badge pseudo">Protected Pseudonym</div>
                    <p className="mode-desc">
                      Contribute anonymously to salary transparency and workplace intelligence without risking your career.
                    </p>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label className="field-label" htmlFor="pseudoInput">
                    Choose Your Protected Pseudonym Handle
                  </label>
                  <div className="input-prefix-box">
                    <span className="input-prefix">@</span>
                    <input
                      id="pseudoInput"
                      type="text"
                      value={pseudonymUsername}
                      onChange={(e) => setPseudonymUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      placeholder="e.g. shadow_architect"
                      className="modal-input with-prefix"
                    />
                  </div>
                  <span className="field-hint">
                    This handle is cryptographically isolated from your public profile and demographics.
                  </span>
                </div>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-secondary modal-back-btn"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    disabled={loading}
                    className="btn btn-story modal-next-btn"
                  >
                    <Sparkles size={16} />
                    <span>{loading ? 'Finalizing Profile...' : 'Complete Onboarding & Enter LinkedOut'}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      <style jsx>{`
        .onboarding-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          background: rgba(10, 26, 44, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
          animation: overlayFadeIn 220ms ease-out;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .onboarding-card {
          width: 100%;
          max-width: 620px;
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(10, 102, 194, 0.15);
          overflow: hidden;
          animation: cardSlideUp 260ms cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--text-primary);
        }

        [data-theme="dark"] .onboarding-card {
          background: #111C2D;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          padding: 1.25rem 1.75rem;
          background: var(--surface-hover);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--brand-primary);
        }

        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--brand-primary);
        }

        .step-indicator-row {
          display: flex;
          gap: 0.4rem;
        }

        .step-dot {
          width: 22px;
          height: 6px;
          border-radius: var(--radius-full);
          background: var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .step-dot.active {
          background: var(--brand-primary);
          width: 32px;
        }

        .step-dot.done {
          background: #10B981;
        }

        .modal-error-banner {
          background: #FEE2E2;
          color: #991B1B;
          padding: 0.75rem 1.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid #FCA5A5;
        }

        [data-theme="dark"] .modal-error-banner {
          background: rgba(239, 68, 68, 0.2);
          color: #FCA5A5;
          border-bottom-color: rgba(239, 68, 68, 0.3);
        }

        .modal-form {
          padding: 1.75rem;
        }

        .form-intro {
          margin-bottom: 1.25rem;
        }

        .form-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .form-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .form-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group.span-2 {
          grid-column: span 2;
        }

        .field-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .req {
          color: var(--brand-primary);
        }

        .opt {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        .modal-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-subtle);
          background: var(--surface-card);
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .modal-input:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px var(--brand-primary-light);
        }

        .input-prefix-box {
          display: flex;
          align-items: center;
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .modal-input.with-prefix {
          padding-left: 2rem;
        }

        .modal-select {
          cursor: pointer;
        }

        /* Age Group Special Box */
        .age-group-highlight {
          background: var(--surface-hover);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .age-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .age-restriction-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .dob-age-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .dob-field-col {
          flex: 1.4;
        }

        .age-field-col {
          flex: 1;
        }

        .or-divider {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .field-hint {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .privacy-field-note {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
          line-height: 1.4;
        }

        /* Underage Lockout */
        .underage-lockout-container {
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .underage-icon-box {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background: #FEF3C7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        [data-theme="dark"] .underage-icon-box {
          background: rgba(245, 158, 11, 0.2);
        }

        .underage-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .underage-message-card {
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          max-width: 480px;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }

        .underage-subtext {
          margin-top: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.8125rem;
        }

        .underage-notice-box {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #DC2626;
          background: #FEE2E2;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-md);
        }

        [data-theme="dark"] .underage-notice-box {
          background: rgba(220, 38, 38, 0.2);
          color: #F87171;
        }

        /* Step 2 & 3 Chips */
        .chips-picker-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .chip-choice {
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          font-size: 0.8125rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
        }

        .chip-choice:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .chip-choice.selected {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          border-color: var(--brand-primary);
          font-weight: 600;
        }

        .interests-selection-box {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          padding: 1rem 0;
        }

        .interest-tag-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.95rem;
          border-radius: var(--radius-full);
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .interest-tag-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .interest-tag-btn.selected {
          background: var(--brand-primary);
          color: #FFFFFF;
          border-color: var(--brand-primary);
        }

        /* Step 4 Dual Mode */
        .dual-mode-explainer-card {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          align-items: center;
        }

        .explainer-mode {
          text-align: left;
        }

        .mode-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.45rem;
        }

        .mode-badge.public {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
        }

        .mode-badge.pseudo {
          background: #F3E8FF;
          color: #7E22CE;
        }

        [data-theme="dark"] .mode-badge.pseudo {
          background: rgba(126, 34, 206, 0.25);
          color: #D8B4FE;
        }

        .mode-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .explainer-divider {
          width: 1px;
          height: 100%;
          background: var(--border-subtle);
        }

        /* Footer */
        .modal-actions-footer {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .privacy-badge-notice {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .modal-back-btn {
          padding: 0.65rem 1.15rem;
        }

        .modal-next-btn {
          padding: 0.65rem 1.4rem;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .form-fields-grid {
            grid-template-columns: 1fr;
          }
          .form-group.span-2 {
            grid-column: span 1;
          }
          .dob-age-row {
            flex-direction: column;
            align-items: stretch;
          }
          .dual-mode-explainer-card {
            grid-template-columns: 1fr;
          }
          .explainer-divider {
            display: none;
          }
          .modal-actions-footer {
            flex-direction: column-reverse;
            gap: 0.75rem;
            align-items: stretch;
          }
          .modal-next-btn, .modal-back-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
