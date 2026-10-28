'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Users, Shield, Sparkles, Building2 } from 'lucide-react';
import { UserProfile, Community } from '@/types';

interface FeedSidebarLeftProps {
  user: UserProfile | null;
  communities: Community[];
}

export default function FeedSidebarLeft({ user, communities }: FeedSidebarLeftProps) {
  if (!user) return null;

  const joinedCommunities = communities.filter(c => c.is_joined);

  return (
    <aside className="sidebar-left">
      {/* User Mini Profile Card */}
      <div className="card user-summary-card">
        <div className="summary-banner" />
        <div className="summary-avatar-wrapper">
          <img src={user.avatar_url} alt={user.display_name} className="summary-avatar" />
        </div>

        <div className="summary-body">
          <Link href={`/profile/${user.username}`} className="summary-name">
            {user.display_name}
          </Link>
          <p className="summary-headline">{user.headline}</p>

          <div className="summary-stats-grid">
            <div className="summary-stat-item">
              <span className="stat-count">{user.followers_count}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="summary-stat-item">
              <span className="stat-count">{user.following_count}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="summary-stat-item">
              <span className="stat-count">{joinedCommunities.length}</span>
              <span className="stat-label">Communities</span>
            </div>
          </div>
        </div>

        <div className="summary-footer">
          <div className="pseudonym-status-box">
            <Shield size={14} className="text-purple" />
            <div className="pseudo-text">
              <span className="pseudo-label">Pseudonym Active</span>
              <span className="pseudo-handle">@{user.pseudonym_username || 'shadow_user'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Nav Card */}
      <div className="card quick-links-card">
        <div className="quick-links-title">My Hub</div>
        <Link href={`/profile/${user.username}`} className="quick-nav-link">
          <Users size={16} />
          <span>My Profile & Projects</span>
        </Link>
        <Link href="/communities" className="quick-nav-link">
          <Users size={16} />
          <span>Joined Communities ({joinedCommunities.length})</span>
        </Link>
        <Link href="/share-experience" className="quick-nav-link">
          <Building2 size={16} />
          <span>Review a Company</span>
        </Link>
      </div>

      <style jsx>{`
        .sidebar-left {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .user-summary-card {
          overflow: hidden;
          background: var(--surface-card);
        }

        .summary-banner {
          height: 64px;
          background: var(--story-gradient);
        }

        .summary-avatar-wrapper {
          display: flex;
          justify-content: center;
          margin-top: -32px;
        }

        .summary-avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          border: 3px solid var(--surface-card);
          object-fit: cover;
        }

        .summary-body {
          padding: 0.75rem 1.25rem 1rem;
          text-align: center;
        }

        .summary-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
          display: block;
        }

        .summary-name:hover {
          color: var(--brand-primary);
        }

        .summary-headline {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          line-height: 1.4;
        }

        .summary-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .summary-stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-count {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .summary-footer {
          padding: 0.75rem 1.25rem;
          background: var(--surface-hover);
          border-top: 1px solid var(--border-subtle);
        }

        .pseudonym-status-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .text-purple {
          color: #9333EA;
        }

        .pseudo-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .pseudo-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .pseudo-handle {
          font-size: 0.75rem;
          color: #7E22CE;
          font-weight: 600;
        }

        [data-theme="dark"] .pseudo-handle {
          color: #C084FC;
        }

        .quick-links-card {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .quick-links-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
        }

        .quick-nav-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .quick-nav-link:hover {
          background: var(--surface-hover);
          color: var(--brand-primary);
        }
      `}</style>
    </aside>
  );
}
