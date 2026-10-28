'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Check, Plus, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import { Community, ProfessionalDomain } from '@/types';
import { StorageEngine } from '@/lib/storage';

const DOMAIN_FILTERS: ('All' | ProfessionalDomain)[] = [
  'All',
  'Software Engineering',
  'AI & Machine Learning',
  'Design & UX',
  'Human Resources',
  'Entrepreneurship'
];

export default function CommunitiesDirectoryPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  useEffect(() => {
    setCommunities(StorageEngine.getCommunities());
  }, []);

  const handleToggleJoin = (id: string) => {
    const updated = StorageEngine.toggleJoinCommunity(id);
    if (updated) {
      setCommunities(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  };

  const filtered = communities.filter(comm => {
    const matchesQuery = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || comm.domain === selectedDomain;
    return matchesQuery && matchesDomain;
  });

  return (
    <div className="communities-page">
      <div className="app-container">
        {/* Header Hero */}
        <div className="communities-hero">
          <div className="hero-badge">
            <Users size={16} />
            <span>Domain Communities</span>
          </div>
          <h1>Connect With Your Craft</h1>
          <p>
            Discord-inspired technical spaces organized by domains. Debate RFCs, share salary benchmarks, and discover specialized career opportunities.
          </p>

          {/* Search Bar */}
          <div className="comm-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities by domain or topic..."
              className="input search-input"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="domain-filters-bar">
          {DOMAIN_FILTERS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`domain-filter-pill ${selectedDomain === d ? 'active' : ''}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Community Grid */}
        <div className="communities-grid">
          {filtered.map((comm) => (
            <div key={comm.id} className="card community-card">
              <div className="comm-banner" style={{ background: comm.banner_color }} />
              <div className="comm-card-body">
                <div className="comm-header-row">
                  <div className="comm-icon-box">
                    <Users size={22} color="#FFF" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleJoin(comm.id)}
                    className={`btn btn-sm ${comm.is_joined ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {comm.is_joined ? (
                      <>
                        <Check size={14} />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Join</span>
                      </>
                    )}
                  </button>
                </div>

                <Link href={`/communities/${comm.slug}`} className="comm-title">
                  {comm.name}
                </Link>
                <div className="comm-domain-badge">{comm.domain}</div>

                <p className="comm-description">{comm.description}</p>

                {/* Channel Preview Pills */}
                <div className="channels-preview-row">
                  <span className="channels-label">Channels:</span>
                  {comm.channels.slice(0, 3).map((ch) => (
                    <span key={ch.id} className="ch-pill">
                      #{ch.name}
                    </span>
                  ))}
                  {comm.channels.length > 3 && (
                    <span className="ch-pill more">+{comm.channels.length - 3}</span>
                  )}
                </div>

                <div className="comm-card-footer">
                  <span className="members-count-text">
                    <strong>{comm.members_count.toLocaleString()}</strong> members
                  </span>
                  <Link href={`/communities/${comm.slug}`} className="enter-comm-link">
                    <span>Enter Space</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .communities-page {
          padding: 2.5rem 0 5rem;
        }

        .communities-hero {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 2.5rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .communities-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .communities-hero p {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .comm-search-bar {
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

        .domain-filters-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .domain-filter-pill {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .domain-filter-pill:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .domain-filter-pill.active {
          background: var(--brand-primary);
          color: #FFF;
          border-color: var(--brand-primary);
        }

        .communities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
        }

        .community-card {
          background: var(--surface-card);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .community-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }

        .comm-banner {
          height: 80px;
          width: 100%;
        }

        .comm-card-body {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .comm-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -36px;
          margin-bottom: 0.75rem;
        }

        .comm-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--brand-deep-navy);
          border: 3px solid var(--surface-card);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .comm-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          display: block;
        }

        .comm-title:hover {
          color: var(--brand-primary);
        }

        .comm-domain-badge {
          font-size: 0.75rem;
          color: var(--brand-primary);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .comm-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .channels-preview-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .channels-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .ch-pill {
          font-size: 0.7rem;
          font-weight: 600;
          background: var(--surface-hover);
          color: var(--text-secondary);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .ch-pill.more {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
        }

        .comm-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-subtle);
        }

        .members-count-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .enter-comm-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--brand-primary);
        }

        .enter-comm-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
