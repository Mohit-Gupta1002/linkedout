'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Briefcase, Sparkles, SlidersHorizontal, Shield, 
  ArrowRight, ArrowLeft, Check, CheckCircle2, AlertCircle, Info 
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { UserProfile, ProfessionalStatus, ProfessionalDomain, ExperienceLevel } from '@/types';

const AGE_RANGES = [
  'Under 18', '18–20', '21–24', '25–29', '30–39', '40–49', '50+', 'Prefer not to say'
];

const GENDERS = [
  'Woman', 'Man', 'Non-binary', 'Self-describe', 'Prefer not to say'
];

const STATUS_OPTIONS: ProfessionalStatus[] = [
  'Student', 'Intern', 'Working professional', 'Freelancer', 'Founder', 'Job seeker', 'Career break', 'Other'
];

const DOMAIN_OPTIONS: ProfessionalDomain[] = [
  'Software Engineering', 'AI & Machine Learning', 'Data Science', 'Product Management',
  'Design & UX', 'Finance & Fintech', 'Marketing', 'Business Development',
  'Human Resources', 'Consulting', 'Entrepreneurship', 'Legal', 'Operations', 'Other'
];

const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'Student / no professional experience', 'Intern', '0–2 years', '3–5 years', '6–10 years', '10+ years'
];

const INTEREST_OPTIONS = [
  'AI', 'Software Engineering', 'Data Science', 'Product', 'Startups', 
  'Finance', 'Design', 'Career Growth', 'Interviews', 'Workplace Culture', 
  'Entrepreneurship', 'Internships', 'Networking', 'Professional Development'
];

const CONTENT_PREFERENCE_OPTIONS = [
  'Professional insights', 'Projects and achievements', 'Photos and Stories',
  'Startup and technology news', 'Career advice', 'Workplace discussions',
  'Company reviews', 'Job and internship updates', 'Community conversations', 'Industry events'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Bengaluru');
  const [ageRange, setAgeRange] = useState('21–24');
  const [gender, setGender] = useState('Prefer not to say');
  const [selfDescribeGender, setSelfDescribeGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Step 2: Professional
  const [status, setStatus] = useState<ProfessionalStatus>('Working professional');
  const [domain, setDomain] = useState<ProfessionalDomain>('Software Engineering');
  const [experience, setExperience] = useState<ExperienceLevel>('0–2 years');
  const [currentCompany, setCurrentCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skillsText, setSkillsText] = useState('TypeScript, Next.js, Distributed Systems');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Step 3: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Software Engineering', 'AI', 'Startups', 'Career Growth'
  ]);

  // Step 4: Content Preferences
  const [selectedContent, setSelectedContent] = useState<string[]>([
    'Professional insights', 'Projects and achievements', 'Photos and Stories', 'Startup and technology news'
  ]);

  // Step 5: Privacy
  const [pseudonymUsername, setPseudonymUsername] = useState('');
  const [publicProfile, setPublicProfile] = useState(true);

  useEffect(() => {
    const user = StorageEngine.getUser();
    if (user) {
      setDisplayName(user.display_name || '');
      setUsername(user.username || '');
      setCountry(user.country || 'India');
      setCity(user.city || 'Bengaluru');
      setAvatarUrl(user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
      setStatus(user.status || 'Working professional');
      setDomain(user.domain || 'Software Engineering');
      setExperience(user.experience || '0–2 years');
      setCurrentCompany(user.company || '');
      setJobTitle(user.headline || '');
      if (user.skills && user.skills.length) setSkillsText(user.skills.join(', '));
      if (user.interests && user.interests.length) setSelectedInterests(user.interests);
      if (user.content_preferences && user.content_preferences.length) setSelectedContent(user.content_preferences);
      setPseudonymUsername(user.pseudonym_username || `shadow_${user.username || 'creator'}`);
    }
  }, []);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const toggleContentPref = (pref: string) => {
    if (selectedContent.includes(pref)) {
      setSelectedContent(selectedContent.filter(p => p !== pref));
    } else {
      setSelectedContent([...selectedContent, pref]);
    }
  };

  const handleNext = () => {
    // Preserve progress at each step
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    StorageEngine.updateUser({
      display_name: displayName,
      username,
      country,
      city,
      age_range: ageRange,
      gender: gender === 'Self-describe' ? selfDescribeGender : gender,
      is_age_gender_private: true,
      avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      status,
      domain,
      experience,
      company: currentCompany,
      headline: jobTitle || `${status} in ${domain}`,
      skills: skillsArray,
      portfolio_url: portfolioUrl,
      interests: selectedInterests,
      content_preferences: selectedContent,
      pseudonym_username: pseudonymUsername
    });

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Step 5 completed
      setSaving(true);
      StorageEngine.completeOnboarding({
        onboarding_completed: true
      });
      setTimeout(() => {
        router.push('/feed');
      }, 500);
    }
  };

  return (
    <div className="onboarding-page-container">
      <div className="onboarding-wrapper card">
        {/* Progress Bar Header */}
        <div className="onboarding-progress-header">
          <div className="progress-info">
            <span className="step-label">Step {step} of 5</span>
            <span className="step-title">
              {step === 1 && 'Personal Details'}
              {step === 2 && 'Professional Profile'}
              {step === 3 && 'Your Interests'}
              {step === 4 && 'Content Preferences'}
              {step === 5 && 'Privacy & Identity'}
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="onboarding-step-content animate-fade-in">
            <div className="step-heading-group">
              <h2>Let&apos;s get to know you.</h2>
              <p>Set up your professional identity. Age and gender are strictly private by default.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dispName">Display Name *</label>
              <input 
                id="dispName"
                type="text" 
                required 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="usrName">Unique Username *</label>
              <div className="input-prefix-group">
                <span className="input-prefix">@</span>
                <input 
                  id="usrName"
                  type="text" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username"
                  className="input input-with-prefix"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="country">Country *</label>
                <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="select">
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">City (Optional)</label>
                <input 
                  id="city"
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Mumbai"
                  className="input"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="ageRange">
                  Age Range (Optional)
                  <span className="form-label-hint">Private</span>
                </label>
                <select id="ageRange" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="select">
                  {AGE_RANGES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Gender (Optional)
                  <span className="form-label-hint">Private</span>
                </label>
                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="select">
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {gender === 'Self-describe' && (
              <div className="form-group">
                <label className="form-label" htmlFor="selfGender">Self-describe</label>
                <input 
                  id="selfGender"
                  type="text" 
                  value={selfDescribeGender}
                  onChange={(e) => setSelfDescribeGender(e.target.value)}
                  placeholder="Your preferred description"
                  className="input"
                />
              </div>
            )}

            <div className="privacy-badge-note">
              <Shield size={16} className="text-primary" />
              <span>
                <strong>Privacy Guaranteed:</strong> Age and gender are never displayed on your public profile and never influence credibility scoring.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Professional Profile */}
        {step === 2 && (
          <div className="onboarding-step-content animate-fade-in">
            <div className="step-heading-group">
              <h2>Your Professional Journey</h2>
              <p>Help us curate relevant discussions, peers, and company insights.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Current Status *</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ProfessionalStatus)} className="select">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="domain">Primary Professional Domain *</label>
              <select id="domain" value={domain} onChange={(e) => setDomain(e.target.value as ProfessionalDomain)} className="select">
                {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experience">Years of Experience</label>
              <select id="experience" value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)} className="select">
                {EXPERIENCE_OPTIONS.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="company">Current Company / College (Optional)</label>
                <input 
                  id="company"
                  type="text" 
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  placeholder="e.g. Razorpay, IIT Delhi"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="jobTitle">Job Title or Headline (Optional)</label>
                <input 
                  id="jobTitle"
                  type="text" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Engineer"
                  className="input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skills">Key Skills (Comma separated)</label>
              <input 
                id="skills"
                type="text" 
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. TypeScript, React, Go, Docker"
                className="input"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Interests */}
        {step === 3 && (
          <div className="onboarding-step-content animate-fade-in">
            <div className="step-heading-group">
              <h2>Select up to 5 interests</h2>
              <p>We use these to recommend relevant channels, stories, and connections ({selectedInterests.length}/5 selected).</p>
            </div>

            <div className="interest-chips-grid">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`interest-chip ${isSelected ? 'selected' : ''}`}
                  >
                    {isSelected && <Check size={14} className="chip-check" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Content Preferences */}
        {step === 4 && (
          <div className="onboarding-step-content animate-fade-in">
            <div className="step-heading-group">
              <h2>What do you want to see?</h2>
              <p>Customize your feed blend. You can select multiple or customize later.</p>
            </div>

            <div className="content-pref-list">
              {CONTENT_PREFERENCE_OPTIONS.map((pref) => {
                const isSelected = selectedContent.includes(pref);
                return (
                  <div 
                    key={pref} 
                    onClick={() => toggleContentPref(pref)}
                    className={`content-pref-item ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="pref-checkbox">
                      {isSelected && <Check size={14} />}
                    </div>
                    <span>{pref}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Privacy & Pseudonymous Identity */}
        {step === 5 && (
          <div className="onboarding-step-content animate-fade-in">
            <div className="step-heading-group">
              <h2>Two Identity Modes. Total Control.</h2>
              <p>LinkedOut lets you participate proudly as yourself or candidly with a pseudonym.</p>
            </div>

            <div className="identity-explainer-cards">
              <div className="card explainer-card">
                <div className="explainer-header">
                  <User size={20} className="text-primary" />
                  <h4>1. Professional Identity</h4>
                </div>
                <p>Used for posts, career achievements, stories, and verified skills. Linked to <strong>@{username}</strong>.</p>
              </div>

              <div className="card explainer-card pseudo-card">
                <div className="explainer-header">
                  <Shield size={20} className="text-purple" />
                  <h4>2. Protected Pseudonym</h4>
                </div>
                <p>Used for sensitive salary discussions, candid workplace reviews, and company questions. Completely decoupled from your public profile.</p>
                <div className="pseudo-input-wrapper">
                  <label htmlFor="pseudonymHandle">Your Pseudonym Handle</label>
                  <input 
                    id="pseudonymHandle"
                    type="text" 
                    value={pseudonymUsername}
                    onChange={(e) => setPseudonymUsername(e.target.value)}
                    placeholder="e.g. shadow_engineer"
                    className="input sm"
                  />
                </div>
              </div>
            </div>

            <div className="public-visibility-toggle">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={publicProfile} 
                  onChange={(e) => setPublicProfile(e.target.checked)} 
                />
                <span>Allow my public professional profile to be discoverable in Global Search</span>
              </label>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="onboarding-footer-actions">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={() => setStep(step - 1)}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button 
            type="button" 
            onClick={handleNext}
            disabled={saving}
            className="btn btn-primary btn-lg"
          >
            {saving ? 'Finishing setup...' : step === 5 ? 'Enter LinkedOut Feed' : 'Continue'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-page-container {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
        }

        .onboarding-wrapper {
          width: 100%;
          max-width: 640px;
          padding: 2.5rem;
          background: var(--surface-card);
          box-shadow: var(--shadow-xl);
        }

        .onboarding-progress-header {
          margin-bottom: 2rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
          margin-bottom: 0.5rem;
        }

        .step-label {
          color: var(--brand-primary);
          font-weight: 700;
        }

        .step-title {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          background: var(--surface-hover);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--story-gradient);
          border-radius: var(--radius-full);
          transition: width 300ms ease;
        }

        .step-heading-group {
          margin-bottom: 1.75rem;
        }

        .step-heading-group h2 {
          font-size: 1.75rem;
          margin-bottom: 0.35rem;
        }

        .step-heading-group p {
          font-size: 0.9375rem;
          color: var(--text-secondary);
        }

        .input-prefix-group {
          display: flex;
          align-items: center;
        }

        .input-prefix {
          padding: 0.65rem 0.85rem;
          background: var(--surface-hover);
          border: 1.5px solid var(--border-subtle);
          border-right: none;
          border-radius: var(--radius-md) 0 0 var(--radius-md);
          color: var(--text-muted);
          font-weight: 600;
        }

        .input-with-prefix {
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 580px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .onboarding-wrapper {
            padding: 1.5rem;
          }
        }

        .privacy-badge-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--brand-primary-light);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          color: var(--text-primary);
          margin-top: 1.25rem;
        }

        /* Interests Chips */
        .interest-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }

        .interest-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-full);
          background: var(--surface-hover);
          border: 1.5px solid var(--border-subtle);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .interest-chip:hover {
          border-color: var(--brand-primary);
        }

        .interest-chip.selected {
          background: var(--brand-primary);
          color: #FFF;
          border-color: var(--brand-primary);
        }

        .chip-check {
          color: #FFF;
        }

        /* Content Preferences */
        .content-pref-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        @media (max-width: 580px) {
          .content-pref-list {
            grid-template-columns: 1fr;
          }
        }

        .content-pref-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: var(--surface-hover);
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .content-pref-item:hover {
          border-color: var(--brand-primary);
        }

        .content-pref-item.selected {
          background: var(--brand-primary-light);
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          font-weight: 600;
        }

        .pref-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid var(--border-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-card);
        }

        .content-pref-item.selected .pref-checkbox {
          background: var(--brand-primary);
          border-color: var(--brand-primary);
          color: #FFF;
        }

        /* Identity Explainer */
        .identity-explainer-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .explainer-card {
          padding: 1.25rem;
        }

        .explainer-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .explainer-card p {
          font-size: 0.875rem;
        }

        .pseudo-card {
          border-color: #D8B4FE;
          background: rgba(147, 51, 234, 0.03);
        }

        .pseudo-input-wrapper {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .pseudo-input-wrapper label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .text-purple {
          color: #9333EA;
        }

        .public-visibility-toggle {
          margin-top: 1rem;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .onboarding-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
