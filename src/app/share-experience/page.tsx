'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Shield, AlertTriangle, ArrowLeft, Send, CheckCircle2, 
  Building2, Star, Info, Lock 
} from 'lucide-react';
import { Company } from '@/types';
import { StorageEngine } from '@/lib/storage';

const ROLE_BANDS = [
  'Software Engineering', 'AI & Machine Learning', 'Product Management',
  'Design & UX', 'Data Science', 'Operations & DevOps', 'Marketing & Sales',
  'Finance & Accounting', 'Human Resources', 'Other'
];

const SENIORITY_BANDS = [
  'Intern / Apprentice', 'Entry / Associate (0-2 yrs)', 'Mid-level (2-5 yrs)', 
  'Senior / Staff (5-8 yrs)', 'Principal / Lead / Director (8+ yrs)'
];

const TENURE_BANDS = [
  'Less than 1 year', '1–2 years', '2–4 years', '4+ years'
];

export default function ShareExperiencePage() {
  return (
    <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading review form...</div>}>
      <ShareExperienceContent />
    </Suspense>
  );
}

function ShareExperienceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCompanyId = searchParams.get('company') || '';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState(preselectedCompanyId);
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [isCurrentEmployee, setIsCurrentEmployee] = useState(true);
  const [roleBand, setRoleBand] = useState('Software Engineering');
  const [seniorityBand, setSeniorityBand] = useState('Senior / Staff (5-8 yrs)');
  const [tenureBand, setTenureBand] = useState('1–2 years');
  const [locationBroad, setLocationBroad] = useState('Bengaluru, India');

  // Rating Scores (1 to 5)
  const [managementScore, setManagementScore] = useState(4);
  const [workLifeScore, setWorkLifeScore] = useState(4);
  const [compensationScore, setCompensationScore] = useState(4);
  const [growthScore, setGrowthScore] = useState(4);
  const [cultureScore, setCultureScore] = useState(4);
  const [psychologicalSafetyScore, setPsychologicalSafetyScore] = useState(4);

  // Written details
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [reasonsForLeaving, setReasonsForLeaving] = useState('');
  const [writtenStory, setWrittenStory] = useState('');

  // Confirmation
  const [understoodGuidelines, setUnderstoodGuidelines] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const list = StorageEngine.getCompanies();
    setCompanies(list);
    if (!companyId && list.length > 0) {
      setCompanyId(list[0].id);
    }
  }, [companyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!understoodGuidelines || !pros.trim() || !cons.trim()) return;

    setSubmitting(true);
    const targetComp = companies.find(c => c.id === companyId);
    const compName = targetComp ? targetComp.name : (customCompanyName || 'Tech Company');

    StorageEngine.addCompanySubmission({
      company_id: companyId || 'comp_custom',
      company_name: compName,
      is_current_employee: isCurrentEmployee,
      role_band: roleBand,
      seniority_band: seniorityBand,
      tenure_band: tenureBand,
      location_broad: locationBroad,
      ratings: {
        management: managementScore,
        work_life: workLifeScore,
        compensation: compensationScore,
        growth: growthScore,
        culture: cultureScore,
        psychological_safety: psychologicalSafetyScore
      },
      pros: pros.trim(),
      cons: cons.trim(),
      reasons_for_leaving: !isCurrentEmployee ? reasonsForLeaving.trim() : undefined,
      written_story: writtenStory.trim() || undefined
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="share-page-container">
        <div className="app-container">
          <div className="card success-card">
            <CheckCircle2 size={54} className="text-success success-icon" />
            <h2>Experience Submitted Securely</h2>
            <p>
              Thank you for contributing to workplace transparency. Your feedback has been sanitized and indexed under your isolated pseudonym token. Your public profile and email are never attached to this review.
            </p>
            <div className="success-buttons">
              <Link href={companyId ? `/companies/${companies.find(c => c.id === companyId)?.slug || ''}` : '/companies'} className="btn btn-primary">
                View Company Insights
              </Link>
              <Link href="/feed" className="btn btn-secondary">
                Return to Home Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="share-page-container">
      <div className="app-container share-form-container">
        <Link href="/companies" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Company Directory</span>
        </Link>

        {/* Header */}
        <div className="share-header">
          <div className="shield-badge">
            <Shield size={16} />
            <span>Zero-Leak Pseudonym Engine</span>
          </div>
          <h1>Share Anonymous Workplace Experience</h1>
          <p>
            Help prospective teammates understand genuine team culture, on-call expectations, and management styles.
          </p>
        </div>

        {/* Safety & Moderation Warnings Banner */}
        <div className="card warning-card">
          <AlertTriangle size={20} className="warning-icon" />
          <div>
            <h4>Community Guidelines & Legal Protections</h4>
            <ul className="guidelines-list">
              <li>Do NOT include names of individual managers, coworkers, or clients.</li>
              <li>Do NOT disclose confidential source code, trade secrets, or non-public financial metrics.</li>
              <li>Provide honest, constructive feedback based on your direct personal experience.</li>
              <li>Your submission is strictly decoupled from your public profile and user ID.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card share-form-card">
          {/* Step 1: Company & Employment Status */}
          <div className="form-section">
            <h3 className="section-title">1. Company & Role Information</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="companySelect">Select Company</label>
              <select 
                id="companySelect"
                value={companyId} 
                onChange={(e) => setCompanyId(e.target.value)} 
                className="select"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} &bull; {c.industry}</option>
                ))}
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="roleBand">Broad Role Band</label>
                <select 
                  id="roleBand"
                  value={roleBand} 
                  onChange={(e) => setRoleBand(e.target.value)} 
                  className="select"
                >
                  {ROLE_BANDS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="seniorityBand">Seniority Band</label>
                <select 
                  id="seniorityBand"
                  value={seniorityBand} 
                  onChange={(e) => setSeniorityBand(e.target.value)} 
                  className="select"
                >
                  {SENIORITY_BANDS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="tenureBand">Tenure at Company</label>
                <select 
                  id="tenureBand"
                  value={tenureBand} 
                  onChange={(e) => setTenureBand(e.target.value)} 
                  className="select"
                >
                  {TENURE_BANDS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="locationBroad">General Location (City / Remote)</label>
                <input
                  id="locationBroad"
                  type="text"
                  value={locationBroad}
                  onChange={(e) => setLocationBroad(e.target.value)}
                  placeholder="e.g. Bengaluru, Hyderabad, Remote India"
                  className="input"
                />
              </div>
            </div>

            <div className="employment-status-toggle">
              <label className="radio-label">
                <input
                  type="radio"
                  name="empStatus"
                  checked={isCurrentEmployee}
                  onChange={() => setIsCurrentEmployee(true)}
                />
                <span>I am currently working here</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="empStatus"
                  checked={!isCurrentEmployee}
                  onChange={() => setIsCurrentEmployee(false)}
                />
                <span>I am a former employee</span>
              </label>
            </div>
          </div>

          {/* Step 2: Ratings */}
          <div className="form-section">
            <h3 className="section-title">2. Category Ratings (1 to 5 Stars)</h3>

            <div className="ratings-sliders-grid">
              <div className="rating-slider-item">
                <div className="slider-header">
                  <span className="slider-label">Psychological Safety</span>
                  <span className="slider-val">{psychologicalSafetyScore} ★</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={psychologicalSafetyScore}
                  onChange={(e) => setPsychologicalSafetyScore(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="rating-slider-item">
                <div className="slider-header">
                  <span className="slider-label">Work-Life Balance</span>
                  <span className="slider-val">{workLifeScore} ★</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={workLifeScore}
                  onChange={(e) => setWorkLifeScore(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="rating-slider-item">
                <div className="slider-header">
                  <span className="slider-label">Compensation & Fairness</span>
                  <span className="slider-val">{compensationScore} ★</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={compensationScore}
                  onChange={(e) => setCompensationScore(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="rating-slider-item">
                <div className="slider-header">
                  <span className="slider-label">Management & Leadership</span>
                  <span className="slider-val">{managementScore} ★</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={managementScore}
                  onChange={(e) => setManagementScore(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="rating-slider-item">
                <div className="slider-header">
                  <span className="slider-label">Career Growth Opportunity</span>
                  <span className="slider-val">{growthScore} ★</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={growthScore}
                  onChange={(e) => setGrowthScore(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="rating-slider-item">
                <div className="slider-header">
                  <span className="slider-label">Culture & Values</span>
                  <span className="slider-val">{cultureScore} ★</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={cultureScore}
                  onChange={(e) => setCultureScore(Number(e.target.value))}
                  className="slider-input"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Written Details */}
          <div className="form-section">
            <h3 className="section-title">3. Written Feedback</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="prosText">The Pros (What did you appreciate most?) *</label>
              <textarea
                id="prosText"
                required
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="e.g. Great engineering ownership, supportive teammates, cutting-edge tech stack..."
                className="textarea"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="consText">The Cons (What should candidates know?) *</label>
              <textarea
                id="consText"
                required
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="e.g. On-call frequency can be stressful during holiday releases, promotion criteria lacks clarity..."
                className="textarea"
                rows={3}
              />
            </div>

            {!isCurrentEmployee && (
              <div className="form-group">
                <label className="form-label" htmlFor="leavingText">Primary Reason for Leaving</label>
                <input
                  id="leavingText"
                  type="text"
                  value={reasonsForLeaving}
                  onChange={(e) => setReasonsForLeaving(e.target.value)}
                  placeholder="e.g. Relocated to another city, sought better remote flexibility, higher equity elsewhere..."
                  className="input"
                />
              </div>
            )}
          </div>

          {/* Safety Checkbox */}
          <div className="compliance-box">
            <label className="compliance-label">
              <input
                type="checkbox"
                required
                checked={understoodGuidelines}
                onChange={(e) => setUnderstoodGuidelines(e.target.checked)}
              />
              <span>
                I confirm this review is based on my genuine workplace experience, contains no confidential proprietary assets or private individuals&apos; names, and complies with LinkedOut&apos;s privacy protections.
              </span>
            </label>
          </div>

          <div className="form-submit-row">
            <Link href="/companies" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !understoodGuidelines || !pros.trim() || !cons.trim()}
              className="btn btn-story btn-lg"
            >
              {submitting ? 'Encrypting & Submitting...' : 'Submit Anonymous Review'}
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .share-page-container {
          padding: 2.5rem 0 5rem;
        }

        .share-form-container {
          max-width: 720px;
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

        .share-header {
          margin-bottom: 1.75rem;
        }

        .shield-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(126, 34, 206, 0.1);
          color: #7E22CE;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        [data-theme="dark"] .shield-badge {
          color: #C084FC;
          background: rgba(192, 132, 252, 0.15);
        }

        .share-header h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .share-header p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .warning-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          margin-bottom: 1.75rem;
        }

        [data-theme="dark"] .warning-card {
          background: rgba(217, 119, 6, 0.1);
          border-color: rgba(253, 230, 138, 0.2);
        }

        .warning-icon {
          color: #D97706;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .warning-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #92400E;
          margin-bottom: 0.4rem;
        }

        [data-theme="dark"] .warning-card h4 {
          color: #FBBF24;
        }

        .guidelines-list {
          font-size: 0.8125rem;
          color: #78350F;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        [data-theme="dark"] .guidelines-list {
          color: #FDE68A;
        }

        .share-form-card {
          padding: 2.25rem;
          background: var(--surface-card);
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .share-form-card {
            padding: 1.5rem;
          }
        }

        .employment-status-toggle {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.75rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-primary);
          cursor: pointer;
        }

        .ratings-sliders-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 600px) {
          .ratings-sliders-grid {
            grid-template-columns: 1fr;
          }
        }

        .rating-slider-item {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .slider-val {
          color: #D97706;
          font-weight: 700;
        }

        .slider-input {
          width: 100%;
          accent-color: var(--brand-primary);
        }

        .compliance-box {
          background: var(--surface-hover);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
        }

        .compliance-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
          cursor: pointer;
        }

        .compliance-label input {
          margin-top: 3px;
        }

        .form-submit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .success-card {
          text-align: center;
          padding: 3.5rem 2rem;
          max-width: 580px;
          margin: 0 auto;
          background: var(--surface-card);
        }

        .success-icon {
          margin: 0 auto 1.25rem;
        }

        .success-card h2 {
          font-size: 1.75rem;
          margin-bottom: 0.75rem;
        }

        .success-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .success-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
