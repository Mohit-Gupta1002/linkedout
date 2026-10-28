'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Hash, ArrowRight, MessageSquare, Compass, Check } from 'lucide-react';
import { Community, Discussion } from '@/types';
import { StorageEngine } from '@/lib/storage';

export default function MyCommunitiesPage() {
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    const comms = StorageEngine.getCommunities();
    const joined = comms.filter(c => c.is_joined);
    setJoinedCommunities(joined);

    const allDiscussions = StorageEngine.getDiscussions();
    const relevant = allDiscussions.filter(d => joined.some(c => c.id === d.community_id));
    setDiscussions(relevant);
  }, []);

  const handleLeaveCommunity = (id: string) => {
    const updated = StorageEngine.toggleJoinCommunity(id);
    if (updated) {
      setJoinedCommunities(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="my-communities-page">
      <div className="app-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-badge">
            <Users size={16} />
            <span>My Workspaces</span>
          </div>
          <h1>My Communities</h1>
          <p>The specialized engineering, design, and domain spaces you participate in.</p>
        </div>

        {joinedCommunities.length > 0 ? (
          <div className="my-comm-grid">
            {joinedCommunities.map((comm) => (
              <div key={comm.id} className="card my-comm-card">
                <div className="comm-card-header-bar" style={{ background: comm.banner_color }} />
                <div className="my-comm-body">
                  <div className="comm-top-row">
                    <div className="comm-icon-box">
                      <Users size={22} color="#FFF" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLeaveCommunity(comm.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Check size={14} />
                      <span>Joined</span>
                    </button>
                  </div>

                  <Link href={`/communities/${comm.slug}`} className="comm-name-title">
                    {comm.name}
                  </Link>
                  <span className="comm-domain-sub">{comm.domain}</span>
                  <p className="comm-desc-snippet">{comm.description}</p>

                  <div className="channels-section">
                    <span className="channels-title">Quick Channel Access:</span>
                    <div className="channels-chips">
                      {comm.channels.map(ch => (
                        <Link 
                          key={ch.id} 
                          href={`/communities/${comm.slug}`} 
                          className="channel-chip-btn"
                        >
                          <Hash size={13} />
                          <span>{ch.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="comm-card-footer">
                    <span className="member-count">{comm.members_count.toLocaleString()} members</span>
                    <Link href={`/communities/${comm.slug}`} className="enter-link">
                      <span>Enter Space</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card empty-communities-card">
            <Users size={48} className="empty-icon text-primary" />
            <h2>You haven&apos;t joined any communities yet</h2>
            <p>
              Join spaces like Software Engineering, AI & Machine Learning, or Design & UX to discuss technical RFCs and salary transparency.
            </p>
            <Link href="/communities" className="btn btn-primary mt-3">
              <Compass size={16} />
              <span>Explore Domain Communities</span>
            </Link>
          </div>
        )}

        {/* Recent Discussions from My Communities */}
        {discussions.length > 0 && (
          <div className="recent-activity-section">
            <h2>Recent Discussions in Your Spaces</h2>
            <div className="discussions-list">
              {discussions.map(disc => (
                <article key={disc.id} className="card disc-card">
                  <div className="disc-header">
                    <span className="disc-channel">#{disc.channel_name}</span>
                    <span className="disc-time">
                      {new Date(disc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/discussions/${disc.id}`} className="disc-title">
                    <h3>{disc.title}</h3>
                  </Link>
                  <p className="disc-excerpt">{disc.content.slice(0, 160)}...</p>
                  <div className="disc-footer">
                    <span className="disc-replies">
                      <MessageSquare size={14} />
                      <span>{disc.replies_count} replies</span>
                    </span>
                    <Link href={`/discussions/${disc.id}`} className="read-more-link">
                      View Thread &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .my-communities-page {
          padding: 2.5rem 0 5rem;
        }

        .page-header {
          text-align: center;
          max-width: 620px;
          margin: 0 auto 2.5rem;
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

        .page-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
        }

        .page-header p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .my-comm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }

        .my-comm-card {
          background: var(--surface-card);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .comm-card-header-bar {
          height: 64px;
        }

        .my-comm-body {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .comm-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -32px;
          margin-bottom: 0.75rem;
        }

        .comm-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--brand-deep-navy);
          border: 3px solid var(--surface-card);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .comm-name-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
        }

        .comm-name-title:hover {
          color: var(--brand-primary);
        }

        .comm-domain-sub {
          font-size: 0.75rem;
          color: var(--brand-primary);
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .comm-desc-snippet {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 1rem;
          flex: 1;
        }

        .channels-section {
          margin-bottom: 1.25rem;
        }

        .channels-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.4rem;
        }

        .channels-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .channel-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.55rem;
          background: var(--surface-hover);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .channel-chip-btn:hover {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
        }

        .comm-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .member-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .enter-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--brand-primary);
        }

        .empty-communities-card {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 540px;
          margin: 0 auto 3rem;
          background: var(--surface-card);
        }

        .empty-icon {
          margin: 0 auto 1rem;
        }

        .empty-communities-card h2 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }

        .empty-communities-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Recent Activity Section */
        .recent-activity-section h2 {
          font-size: 1.35rem;
          margin-bottom: 1.25rem;
        }

        .discussions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .disc-card {
          padding: 1.25rem;
          background: var(--surface-card);
        }

        .disc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .disc-channel {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--brand-primary);
        }

        .disc-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .disc-title h3 {
          font-size: 1.1rem;
          margin-bottom: 0.35rem;
          color: var(--text-primary);
        }

        .disc-title:hover h3 {
          color: var(--brand-primary);
        }

        .disc-excerpt {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.85rem;
        }

        .disc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-subtle);
        }

        .disc-replies {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .read-more-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand-primary);
        }
      `}</style>
    </div>
  );
}
