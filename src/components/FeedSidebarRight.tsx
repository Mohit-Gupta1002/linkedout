'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Building2, Star, Shield, ArrowRight, Check } from 'lucide-react';
import { Community, Company } from '@/types';
import { StorageEngine } from '@/lib/storage';

interface FeedSidebarRightProps {
  communities: Community[];
  companies: Company[];
  onCommunityToggled: (updatedComm: Community) => void;
}

export default function FeedSidebarRight({
  communities,
  companies,
  onCommunityToggled
}: FeedSidebarRightProps) {
  const handleToggleJoin = (commId: string) => {
    const updated = StorageEngine.toggleJoinCommunity(commId);
    if (updated) onCommunityToggled(updated);
  };

  return (
    <aside className="sidebar-right">
      {/* Communities Recommendation Card */}
      <div className="card widget-card">
        <div className="widget-header">
          <div className="widget-title-group">
            <Users size={16} className="text-primary" />
            <h4 className="widget-title">Domain Communities</h4>
          </div>
          <Link href="/communities" className="widget-view-all">
            View all
          </Link>
        </div>

        <div className="community-list">
          {communities.slice(0, 3).map((comm) => (
            <div key={comm.id} className="comm-row-item">
              <div className="comm-info">
                <Link href={`/communities/${comm.slug}`} className="comm-name">
                  {comm.name}
                </Link>
                <span className="comm-members">
                  {comm.members_count.toLocaleString()} members
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleJoin(comm.id)}
                className={`btn btn-sm ${comm.is_joined ? 'btn-secondary' : 'btn-outline'}`}
              >
                {comm.is_joined ? (
                  <>
                    <Check size={12} />
                    <span>Joined</span>
                  </>
                ) : (
                  <span>Join</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Anonymous Workplace Intelligence Spotlight */}
      <div className="card widget-card">
        <div className="widget-header">
          <div className="widget-title-group">
            <Building2 size={16} className="text-purple" />
            <h4 className="widget-title">Anonymous Workplace Intelligence</h4>
          </div>
          <Link href="/companies" className="widget-view-all">
            All Signals
          </Link>
        </div>

        <p className="widget-caption">
          Anonymous company ratings and culture signals calculated from candid employee submissions.
        </p>

        <div className="company-spotlight-list">
          {companies.slice(0, 2).map((comp) => (
            <Link key={comp.id} href={`/companies/${comp.slug}`} className="comp-row-card">
              <img src={comp.logo_url} alt="" className="comp-logo" />
              <div className="comp-meta">
                <div className="comp-name-row">
                  <span className="comp-name">{comp.name}</span>
                  <div className="comp-rating-pill">
                    <Star size={11} fill="currentColor" />
                    <span>{comp.overall_rating}</span>
                  </div>
                </div>
                <span className="comp-industry">{comp.industry}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="widget-cta-box">
          <Shield size={16} className="text-purple" />
          <div className="cta-texts">
            <span className="cta-bold">Your voice is protected</span>
            <span className="cta-sub">Submit an anonymous review with our zero-leak pseudonym token system.</span>
          </div>
          <Link href="/share-experience" className="btn btn-secondary btn-sm full-width mt-2">
            Share Experience
          </Link>
        </div>
      </div>

      <style jsx>{`
        .sidebar-right {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .widget-card {
          padding: 1.25rem;
          background: var(--surface-card);
        }

        .widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .widget-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .widget-title {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .widget-view-all {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand-primary);
        }

        .widget-view-all:hover {
          text-decoration: underline;
        }

        .widget-caption {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
          line-height: 1.4;
        }

        .community-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comm-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .comm-info {
          display: flex;
          flex-direction: column;
        }

        .comm-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .comm-name:hover {
          color: var(--brand-primary);
        }

        .comm-members {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .company-spotlight-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1rem;
        }

        .comp-row-card {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          background: var(--surface-hover);
          transition: background var(--transition-fast);
        }

        .comp-row-card:hover {
          background: var(--surface-active);
        }

        .comp-logo {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .comp-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .comp-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .comp-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .comp-rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #D97706;
        }

        .comp-industry {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .widget-cta-box {
          background: #FAF5FF;
          border: 1px solid #E9D5FF;
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        [data-theme="dark"] .widget-cta-box {
          background: rgba(126, 34, 206, 0.08);
          border-color: rgba(192, 132, 252, 0.2);
        }

        .cta-texts {
          display: flex;
          flex-direction: column;
        }

        .cta-bold {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #7E22CE;
        }

        [data-theme="dark"] .cta-bold {
          color: #C084FC;
        }

        .cta-sub {
          font-size: 0.7rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .full-width {
          width: 100%;
        }

        .text-purple {
          color: #9333EA;
        }
      `}</style>
    </aside>
  );
}
