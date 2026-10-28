'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Building2, Star, Shield, ArrowLeft, ExternalLink, 
  CheckCircle2, AlertTriangle, MessageSquare, Plus, Info 
} from 'lucide-react';
import { Company, CompanySubmission } from '@/types';
import { StorageEngine } from '@/lib/storage';
import CompanyAISummary from '@/components/CompanyAISummary';

export default function CompanyDetailPage() {
  return (
    <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading company profile...</div>}>
      <CompanyDetailContent />
    </Suspense>
  );
}

function CompanyDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [submissions, setSubmissions] = useState<CompanySubmission[]>([]);

  useEffect(() => {
    const comp = StorageEngine.getCompanyBySlug(slug);
    if (comp) {
      setCompany(comp);
      setSubmissions(StorageEngine.getCompanySubmissions(comp.id));
    }
  }, [slug]);

  if (!company) {
    return (
      <div className="app-container not-found-box">
        <h2>Company profile not found</h2>
        <Link href="/companies" className="btn btn-secondary mt-3">
          &larr; Back to Companies
        </Link>
      </div>
    );
  }

  const categoryScores = [
    { label: 'Psychological Safety', score: company.scores.psychological_safety },
    { label: 'Work-Life Balance', score: company.scores.work_life },
    { label: 'Compensation & Benefits', score: company.scores.compensation },
    { label: 'Management & Leadership', score: company.scores.management },
    { label: 'Career Growth', score: company.scores.career_growth },
    { label: 'Culture & Values', score: company.scores.culture },
    { label: 'Continuous Learning', score: company.scores.learning },
    { label: 'Workload & On-call', score: company.scores.workload },
  ];

  return (
    <div className="company-profile-page">
      <div className="app-container">
        {/* Breadcrumb */}
        <div className="profile-breadcrumb">
          <Link href="/companies" className="back-link">
            <ArrowLeft size={16} />
            <span>All Companies</span>
          </Link>
        </div>

        {/* Company Header Card */}
        <div className="card company-main-header">
          <div className="header-left">
            <img src={company.logo_url} alt="" className="company-big-logo" />
            <div>
              <div className="name-rating-row">
                <h1>{company.name}</h1>
                <div className="overall-rating-badge">
                  <Star size={16} fill="currentColor" />
                  <span>{company.overall_rating.toFixed(1)} / 5.0</span>
                </div>
              </div>
              <span className="industry-text">{company.industry} &bull; {company.location}</span>
              <p className="desc-text">{company.description}</p>
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="website-link">
                  <span>Official Website</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          <div className="header-right">
            <Link href={`/share-experience?company=${company.id}`} className="btn btn-story">
              <Shield size={16} />
              <span>Submit Experience</span>
            </Link>
          </div>
        </div>

        {/* AI Workplace Intelligence Synthesis */}
        <CompanyAISummary company={company} submissions={submissions} />

        {/* Evidence & Methodology Note */}
        <div className="evidence-disclaimer card">
          <Info size={18} className="disclaimer-icon" />
          <p>
            <strong>Evidence-Based Workplace Intelligence:</strong> Ratings are computed exclusively from {company.reviews_count} eligible employee submissions collected over the past 12 months. Sample sizes and date ranges are disclosed to prevent single-incident bias.
          </p>
        </div>

        {/* Category Breakdown Grid */}
        <section className="ratings-breakdown-section">
          <h2>Workplace Category Intelligence</h2>
          <div className="category-bars-grid">
            {categoryScores.map((cat) => (
              <div key={cat.label} className="card cat-score-card">
                <div className="cat-header">
                  <span className="cat-label">{cat.label}</span>
                  <span className="cat-num">{cat.score.toFixed(1)}</span>
                </div>
                <div className="cat-progress-track">
                  <div 
                    className="cat-progress-bar"
                    style={{ 
                      width: `${(cat.score / 5) * 100}%`,
                      background: cat.score >= 4.0 ? 'var(--success)' : cat.score >= 3.0 ? 'var(--warning)' : 'var(--error)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two-Column Themes: Pros & Reasons For Leaving */}
        <div className="themes-grid">
          <div className="card themes-card positive">
            <div className="themes-header">
              <CheckCircle2 size={18} className="text-success" />
              <h3>Consistent Positive Themes</h3>
            </div>
            <ul className="themes-list">
              {company.positive_themes.map((theme, i) => (
                <li key={i}>{theme}</li>
              ))}
            </ul>
          </div>

          <div className="card themes-card challenges">
            <div className="themes-header">
              <AlertTriangle size={18} className="text-warning" />
              <h3>Reported Reasons for Leaving</h3>
            </div>
            <ul className="themes-list">
              {company.common_reasons_for_leaving.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Employee Submissions Feed */}
        <section className="submissions-section">
          <div className="submissions-header-row">
            <h2>Detailed Employee Submissions ({submissions.length})</h2>
            <Link href={`/share-experience?company=${company.id}`} className="btn btn-secondary btn-sm">
              <Plus size={14} />
              <span>Add Your Voice</span>
            </Link>
          </div>

          <div className="submissions-list">
            {submissions.map((sub) => (
              <article key={sub.id} className="card submission-card">
                <div className="sub-header">
                  <div className="sub-author-badge">
                    <Shield size={14} className="text-purple" />
                    <span>Protected Contributor ({sub.is_current_employee ? 'Current Employee' : 'Former Employee'})</span>
                  </div>
                  <span className="sub-date">{sub.sample_date_range || 'Recent'}</span>
                </div>

                <div className="sub-meta-pills">
                  <span className="meta-pill">Role: {sub.role_band}</span>
                  <span className="meta-pill">Seniority: {sub.seniority_band}</span>
                  <span className="meta-pill">Tenure: {sub.tenure_band}</span>
                  {sub.location_broad && <span className="meta-pill">Location: {sub.location_broad}</span>}
                </div>

                <div className="sub-pros-cons-grid">
                  <div className="pro-box">
                    <strong>Pros:</strong>
                    <p>{sub.pros}</p>
                  </div>
                  <div className="con-box">
                    <strong>Cons:</strong>
                    <p>{sub.cons}</p>
                  </div>
                </div>

                {sub.reasons_for_leaving && (
                  <div className="leaving-box">
                    <strong>Reason for departure:</strong>
                    <p>{sub.reasons_for_leaving}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .company-profile-page {
          padding: 2rem 0 5rem;
        }

        .profile-breadcrumb {
          margin-bottom: 1.25rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--brand-primary);
        }

        .company-main-header {
          padding: 2rem;
          background: var(--surface-card);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .company-big-logo {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-lg);
          object-fit: cover;
          flex-shrink: 0;
        }

        .name-rating-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .name-rating-row h1 {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .overall-rating-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #FEF3C7;
          color: #92400E;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 800;
        }

        .industry-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          display: block;
          margin-top: 0.25rem;
        }

        .desc-text {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
          max-width: 600px;
          line-height: 1.5;
        }

        .website-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand-primary);
          margin-top: 0.5rem;
        }

        .evidence-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: var(--brand-primary-light);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .disclaimer-icon {
          color: var(--brand-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Ratings Breakdown */
        .ratings-breakdown-section {
          margin-bottom: 2.5rem;
        }

        .ratings-breakdown-section h2 {
          font-size: 1.35rem;
          margin-bottom: 1.25rem;
        }

        .category-bars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }

        .cat-score-card {
          padding: 1rem 1.25rem;
          background: var(--surface-card);
        }

        .cat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .cat-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .cat-num {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .cat-progress-track {
          width: 100%;
          height: 6px;
          background: var(--surface-hover);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .cat-progress-bar {
          height: 100%;
          border-radius: var(--radius-full);
        }

        /* Themes */
        .themes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        @media (max-width: 768px) {
          .themes-grid {
            grid-template-columns: 1fr;
          }
        }

        .themes-card {
          padding: 1.5rem;
          background: var(--surface-card);
        }

        .themes-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .themes-header h3 {
          font-size: 1.1rem;
        }

        .themes-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .themes-list li {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          position: relative;
          padding-left: 1.25rem;
        }

        .themes-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--brand-primary);
          font-size: 1.2rem;
          line-height: 1;
        }

        /* Submissions */
        .submissions-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .submissions-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .submission-card {
          padding: 1.5rem;
          background: var(--surface-card);
        }

        .sub-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .sub-author-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(126, 34, 206, 0.08);
          color: #7E22CE;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        [data-theme="dark"] .sub-author-badge {
          color: #C084FC;
          background: rgba(192, 132, 252, 0.15);
        }

        .sub-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .sub-meta-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .meta-pill {
          font-size: 0.75rem;
          background: var(--surface-hover);
          color: var(--text-secondary);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .sub-pros-cons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        @media (max-width: 680px) {
          .sub-pros-cons-grid {
            grid-template-columns: 1fr;
          }
        }

        .pro-box, .con-box, .leaving-box {
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .pro-box strong {
          color: var(--success);
          display: block;
          margin-bottom: 0.25rem;
        }

        .con-box strong {
          color: var(--error);
          display: block;
          margin-bottom: 0.25rem;
        }

        .leaving-box {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--border-subtle);
        }

        .leaving-box strong {
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.25rem;
        }

        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
      `}</style>
    </div>
  );
}
