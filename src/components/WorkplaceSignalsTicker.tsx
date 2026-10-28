'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { CompanySubmission, Company } from '@/types';

interface TickerSignal {
  id: string;
  companyName: string;
  companySlug: string;
  snippet: string;
  statusBadge: string;
  badgeType: 'verified' | 'unverified' | 'reported';
}

export default function WorkplaceSignalsTicker() {
  const [signals, setSignals] = useState<TickerSignal[]>([]);

  useEffect(() => {
    const submissions = StorageEngine.getCompanySubmissions();
    const companies = StorageEngine.getCompanies();

    const formatted: TickerSignal[] = [];

    submissions.forEach((sub) => {
      const comp = companies.find(c => c.id === sub.company_id || c.name.toLowerCase() === sub.company_name.toLowerCase());
      const slug = comp ? comp.slug : 'razorcloud-systems';

      // Determine evidence status based on sample size
      const reviewCount = comp ? comp.reviews_count : 1;
      let statusBadge = 'Unverified submission';
      let badgeType: 'verified' | 'unverified' | 'reported' = 'unverified';

      if (reviewCount >= 50) {
        statusBadge = `Multiple submissions (${reviewCount}+)`;
        badgeType = 'verified';
      } else if (reviewCount >= 10) {
        statusBadge = `Reported (${reviewCount} submissions)`;
        badgeType = 'reported';
      }

      if (sub.pros) {
        formatted.push({
          id: `${sub.id}_pro`,
          companyName: sub.company_name,
          companySlug: slug,
          snippet: sub.pros.length > 85 ? sub.pros.slice(0, 85) + '...' : sub.pros,
          statusBadge,
          badgeType
        });
      }

      if (sub.cons) {
        formatted.push({
          id: `${sub.id}_con`,
          companyName: sub.company_name,
          companySlug: slug,
          snippet: sub.cons.length > 85 ? sub.cons.slice(0, 85) + '...' : sub.cons,
          statusBadge: 'Reported concern',
          badgeType: 'unverified'
        });
      }
    });

    // If no submissions exist, fallback to clean informative placeholder
    if (formatted.length === 0) {
      formatted.push({
        id: 'placeholder',
        companyName: 'LinkedOut Intelligence',
        companySlug: 'razorcloud-systems',
        snippet: 'Anonymous workplace insights and salary transparency signals appear here as employee submissions are verified.',
        statusBadge: 'System notice',
        badgeType: 'reported'
      });
    }

    setSignals(formatted);
  }, []);

  if (signals.length === 0) return null;

  return (
    <aside 
      className="workplace-signals-ticker-bar" 
      aria-label="Anonymous Workplace Signals Ticker"
      role="region"
    >
      {/* Pinned Title Badge */}
      <div className="ticker-label-pill">
        <Shield size={13} className="ticker-shield-icon" />
        <span className="ticker-label-text">ANONYMOUS WORKPLACE SIGNALS</span>
      </div>

      {/* Continuously Scrolling Content Track */}
      <div className="ticker-viewport">
        <div className="ticker-track">
          {/* First loop set */}
          {signals.map((item, idx) => (
            <div key={`set1_${item.id}_${idx}`} className="ticker-item">
              <span className={`signal-badge ${item.badgeType}`}>
                {item.statusBadge}
              </span>
              <Link href={`/companies/${item.companySlug}`} className="signal-company-link">
                <strong>{item.companyName}</strong>
              </Link>
              <span className="signal-snippet">&ldquo;{item.snippet}&rdquo;</span>
              <span className="ticker-separator">&bull;</span>
            </div>
          ))}

          {/* Duplicate loop set for seamless infinite marquee */}
          {signals.map((item, idx) => (
            <div key={`set2_${item.id}_${idx}`} className="ticker-item" aria-hidden="true">
              <span className={`signal-badge ${item.badgeType}`}>
                {item.statusBadge}
              </span>
              <Link href={`/companies/${item.companySlug}`} className="signal-company-link" tabIndex={-1}>
                <strong>{item.companyName}</strong>
              </Link>
              <span className="signal-snippet">&ldquo;{item.snippet}&rdquo;</span>
              <span className="ticker-separator">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer Tag on Right */}
      <div className="ticker-disclaimer-pill" title="Anonymous submissions reflect individual employee experiences and may be unverified">
        <Info size={12} />
        <span>Unverified claims distinguished</span>
      </div>

      <style jsx>{`
        .workplace-signals-ticker-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 38px;
          background: #0B192C;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          z-index: 850;
          overflow: hidden;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.25);
          user-select: none;
        }

        .ticker-label-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #102A43;
          color: #93C5FD;
          height: 100%;
          padding: 0 1rem;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          flex-shrink: 0;
          z-index: 2;
        }

        .ticker-shield-icon {
          color: #60A5FA;
        }

        .ticker-viewport {
          flex: 1;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
        }

        .ticker-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          animation: tickerContinuousScroll 48s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes tickerContinuousScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
            overflow-x: auto;
          }
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.85rem;
          font-size: 0.75rem;
          color: #E2E8F0;
        }

        .signal-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .signal-badge.verified {
          background: rgba(16, 185, 129, 0.2);
          color: #6EE7B7;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .signal-badge.reported {
          background: rgba(59, 130, 246, 0.2);
          color: #93C5FD;
          border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .signal-badge.unverified {
          background: rgba(245, 158, 11, 0.2);
          color: #FCD34D;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .signal-company-link {
          color: #FFFFFF;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .signal-company-link:hover {
          color: #60A5FA;
          text-decoration: underline;
        }

        .signal-snippet {
          color: #CBD5E1;
        }

        .ticker-separator {
          color: rgba(255, 255, 255, 0.3);
          margin-left: 0.65rem;
        }

        .ticker-disclaimer-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0 0.85rem;
          height: 100%;
          background: #0B192C;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 0.6875rem;
          color: #94A3B8;
          flex-shrink: 0;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .ticker-disclaimer-pill {
            display: none;
          }
          .ticker-label-text {
            display: none;
          }
          .ticker-label-pill {
            padding: 0 0.6rem;
          }
        }
      `}</style>
    </aside>
  );
}
