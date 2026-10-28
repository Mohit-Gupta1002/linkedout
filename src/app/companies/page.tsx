'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Search, Star, Shield, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Company } from '@/types';
import { StorageEngine } from '@/lib/storage';

const INDUSTRIES = [
  'All',
  'Cloud Infrastructure & Developer Tools',
  'Fintech & Digital Payments',
  'Artificial Intelligence & Applied ML'
];

export default function CompaniesDirectoryPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  useEffect(() => {
    setCompanies(StorageEngine.getCompanies());
  }, []);

  const filtered = companies.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
    return matchesQuery && matchesIndustry;
  });

  return (
    <div className="companies-page">
      <div className="app-container">
        {/* Header Banner */}
        <div className="companies-hero">
          <div className="hero-badge">
            <Building2 size={16} />
            <span>Workplace Intelligence</span>
          </div>
          <h1>Know Where You Work Before You Sign</h1>
          <p>
            Candid, verified insights from current and former employees. Transparent ratings across psychological safety, management style, compensation, and work-life balance.
          </p>

          <div className="companies-cta-row">
            <Link href="/share-experience" className="btn btn-story">
              <Shield size={16} />
              <span>Share Anonymous Experience</span>
            </Link>
          </div>

          {/* Search Box */}
          <div className="company-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, technology, or city..."
              className="input search-input"
            />
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="industry-filter-row">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`filter-pill ${selectedIndustry === ind ? 'active' : ''}`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Companies Grid */}
        <div className="companies-grid">
          {filtered.map((company) => (
            <Link key={company.id} href={`/companies/${company.slug}`} className="card company-card">
              <div className="company-card-header">
                <img src={company.logo_url} alt="" className="company-card-logo" />
                <div className="company-score-pill">
                  <Star size={14} fill="currentColor" />
                  <span>{company.overall_rating.toFixed(1)}</span>
                </div>
              </div>

              <h3 className="company-card-name">{company.name}</h3>
              <span className="company-card-industry">{company.industry}</span>
              <span className="company-card-location">{company.location}</span>

              <p className="company-card-desc">{company.description}</p>

              {/* Category Mini Ratings */}
              <div className="company-scores-mini">
                <div className="score-mini-col">
                  <span className="score-mini-label">Work-Life</span>
                  <span className="score-mini-num">{company.scores.work_life}</span>
                </div>
                <div className="score-mini-col">
                  <span className="score-mini-label">Safety</span>
                  <span className="score-mini-num">{company.scores.psychological_safety}</span>
                </div>
                <div className="score-mini-col">
                  <span className="score-mini-label">Comp</span>
                  <span className="score-mini-num">{company.scores.compensation}</span>
                </div>
                <div className="score-mini-col">
                  <span className="score-mini-label">Growth</span>
                  <span className="score-mini-num">{company.scores.career_growth}</span>
                </div>
              </div>

              <div className="company-card-footer">
                <span className="reviews-count-text">
                  Based on <strong>{company.reviews_count}</strong> employee submissions
                </span>
                <span className="view-profile-cta">
                  <span>View Breakdown</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .companies-page {
          padding: 2.5rem 0 5rem;
        }

        .companies-hero {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 2.5rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(126, 34, 206, 0.1);
          color: #7E22CE;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        [data-theme="dark"] .hero-badge {
          color: #C084FC;
          background: rgba(192, 132, 252, 0.15);
        }

        .companies-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .companies-hero p {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .companies-cta-row {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .company-search-box {
          position: relative;
          max-width: 480px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 2.75rem;
          border-radius: var(--radius-full);
        }

        .industry-filter-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .filter-pill {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .filter-pill:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .filter-pill.active {
          background: var(--brand-primary);
          color: #FFF;
          border-color: var(--brand-primary);
        }

        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.75rem;
        }

        .company-card {
          padding: 1.5rem;
          background: var(--surface-card);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .company-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }

        .company-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .company-card-logo {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .company-score-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #FEF3C7;
          color: #92400E;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 800;
        }

        .company-card-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .company-card-industry {
          font-size: 0.8125rem;
          color: var(--brand-primary);
          font-weight: 600;
        }

        .company-card-location {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
          display: block;
        }

        .company-card-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .company-scores-mini {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          background: var(--surface-hover);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          text-align: center;
        }

        .score-mini-col {
          display: flex;
          flex-direction: column;
        }

        .score-mini-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .score-mini-num {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .company-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-subtle);
        }

        .reviews-count-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .view-profile-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--brand-primary);
        }
      `}</style>
    </div>
  );
}
