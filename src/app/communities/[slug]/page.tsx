'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Users, Hash, MessageSquare, Plus, ArrowLeft, 
  Check, Shield, ThumbsUp, Send, X, ExternalLink
} from 'lucide-react';
import { Community, Discussion, Channel, UserProfile } from '@/types';
import { StorageEngine } from '@/lib/storage';

export default function CommunityDetailPage() {
  return (
    <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading community...</div>}>
      <CommunityDetailContent />
    </Suspense>
  );
}

function CommunityDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  // New Discussion Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [postPseudonymously, setPostPseudonymously] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = StorageEngine.getUser();
    setCurrentUser(user);

    const comm = StorageEngine.getCommunityBySlug(slug);
    if (comm) {
      setCommunity(comm);
      if (comm.channels.length > 0) {
        setActiveChannelId(comm.channels[0].id);
      }
      setDiscussions(StorageEngine.getDiscussions(comm.id));
    }
  }, [slug]);

  if (!community) {
    return (
      <div className="app-container not-found-box">
        <h2>Community space not found</h2>
        <Link href="/communities" className="btn btn-secondary mt-3">
          &larr; Back to Communities
        </Link>
      </div>
    );
  }

  const activeChannel = community.channels.find(c => c.id === activeChannelId) || community.channels[0];

  const handleToggleJoin = () => {
    const updated = StorageEngine.toggleJoinCommunity(community.id);
    if (updated) setCommunity(updated);
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    const tags = newTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    const created = StorageEngine.addDiscussion({
      community_id: community.id,
      community_slug: community.slug,
      channel_id: activeChannel.id,
      channel_name: activeChannel.name,
      title: newTitle.trim(),
      content: newContent.trim(),
      tags,
      is_pseudonymous: postPseudonymously
    });

    setDiscussions(prev => [created, ...prev]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setIsComposerOpen(false);
    setIsSubmitting(false);
  };

  const handleLikeDiscussion = (discId: string) => {
    const updated = StorageEngine.toggleLikeDiscussion(discId);
    if (updated) {
      setDiscussions(prev => prev.map(d => d.id === updated.id ? updated : d));
    }
  };

  // Filter discussions by active channel (or show all if channel has none)
  const channelDiscussions = discussions.filter(d => 
    !d.channel_id || d.channel_id === activeChannelId
  );

  return (
    <div className="community-page-wrapper">
      {/* Community Banner & Header */}
      <div className="community-banner" style={{ background: community.banner_color }}>
        <div className="app-container banner-inner">
          <Link href="/communities" className="back-to-comm-link">
            <ArrowLeft size={16} />
            <span>All Communities</span>
          </Link>
        </div>
      </div>

      <div className="app-container">
        <div className="community-header-card card">
          <div className="header-card-left">
            <div className="comm-icon-large">
              <Users size={32} color="#FFF" />
            </div>
            <div>
              <div className="comm-title-row">
                <h1>{community.name}</h1>
                <span className="domain-pill">{community.domain}</span>
              </div>
              <p className="comm-headline">{community.description}</p>
              <span className="member-count-badge">
                <strong>{community.members_count.toLocaleString()}</strong> active professionals
              </span>
            </div>
          </div>

          <div className="header-card-right">
            <button
              onClick={handleToggleJoin}
              className={`btn ${community.is_joined ? 'btn-secondary' : 'btn-primary'}`}
            >
              {community.is_joined ? (
                <>
                  <Check size={16} />
                  <span>Joined Community</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Join Community</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Discord-style Channels Layout */}
        <div className="community-workspace-layout">
          {/* Left Channel Sidebar */}
          <aside className="channel-sidebar card">
            <div className="channel-sidebar-title">
              <span>Topic Channels</span>
            </div>

            <nav className="channels-nav-list">
              {community.channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`channel-btn ${activeChannelId === ch.id ? 'active' : ''}`}
                >
                  <Hash size={16} className="channel-hash-icon" />
                  <span className="channel-btn-name">{ch.name}</span>
                </button>
              ))}
            </nav>

            <div className="channel-security-notice">
              <Shield size={14} className="text-purple" />
              <span>Pseudonym posting enabled across all channels.</span>
            </div>
          </aside>

          {/* Right Main Channel Content */}
          <main className="channel-main-content">
            {/* Channel Top Header */}
            <div className="card channel-header-card">
              <div>
                <div className="channel-current-name">
                  <Hash size={20} className="channel-hash-icon" />
                  <h2>{activeChannel.name}</h2>
                </div>
                <p className="channel-desc">{activeChannel.description}</p>
              </div>

              <button 
                onClick={() => setIsComposerOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} />
                <span>New Discussion</span>
              </button>
            </div>

            {/* Discussions Stream */}
            <div className="discussions-stream">
              {channelDiscussions.length > 0 ? (
                channelDiscussions.map((disc) => (
                  <article key={disc.id} className="card discussion-item-card">
                    <div className="disc-author-row">
                      <img src={disc.author_avatar} alt="" className="disc-author-avatar" />
                      <div className="disc-author-meta">
                        <span className="disc-author-name">{disc.author_name}</span>
                        {disc.is_pseudonymous ? (
                          <span className="badge badge-pseudo">
                            <Shield size={10} />
                            <span>Pseudonym</span>
                          </span>
                        ) : (
                          <span className="disc-author-user">@{disc.author_username}</span>
                        )}
                      </div>
                    </div>

                    <Link href={`/discussions/${disc.id}`} className="disc-title-link">
                      <h3>{disc.title}</h3>
                    </Link>

                    <p className="disc-excerpt">{disc.content.slice(0, 220)}...</p>

                    {disc.tags && disc.tags.length > 0 && (
                      <div className="disc-tags-row">
                        {disc.tags.map(t => (
                          <span key={t} className="disc-tag">#{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="disc-footer-row">
                      <div className="disc-stats-group">
                        <button 
                          onClick={() => handleLikeDiscussion(disc.id)}
                          className={`disc-action-btn ${disc.is_liked ? 'liked' : ''}`}
                        >
                          <ThumbsUp size={15} />
                          <span>{disc.likes_count}</span>
                        </button>

                        <Link href={`/discussions/${disc.id}`} className="disc-action-btn">
                          <MessageSquare size={15} />
                          <span>{disc.replies_count} replies</span>
                        </Link>
                      </div>

                      <Link href={`/discussions/${disc.id}`} className="disc-read-thread-link">
                        <span>Read Thread &rarr;</span>
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="card empty-channel-card">
                  <MessageSquare size={32} className="empty-ch-icon" />
                  <h3>No discussions in #{activeChannel.name} yet</h3>
                  <p>Kickstart the conversation with an architectural question or RFC design debate.</p>
                  <button onClick={() => setIsComposerOpen(true)} className="btn btn-primary btn-sm mt-3">
                    Start First Discussion
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* New Discussion Composer Modal */}
      {isComposerOpen && (
        <div className="modal-overlay" onClick={() => setIsComposerOpen(false)}>
          <div className="modal-content disc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Start Discussion in #{activeChannel.name}</h3>
              <button onClick={() => setIsComposerOpen(false)} className="btn-icon sm btn-ghost">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion}>
              <div className="form-group">
                <label className="form-label" htmlFor="discTitle">Discussion Title *</label>
                <input
                  id="discTitle"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How do you handle distributed transactions across microservices?"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="discBody">Content & Context *</label>
                <textarea
                  id="discBody"
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, tradeoffs considered, or RFC sections..."
                  className="textarea"
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="discTags">Tags (Comma separated)</label>
                <input
                  id="discTags"
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Architecture, Database, RFC"
                  className="input"
                />
              </div>

              <div className="pseudonym-checkbox-box">
                <label className="pseudo-toggle-label">
                  <input
                    type="checkbox"
                    checked={postPseudonymously}
                    onChange={(e) => setPostPseudonymously(e.target.checked)}
                  />
                  <div>
                    <strong>Post as Protected Pseudonym (@{currentUser?.pseudonym_username || 'verified_dev'})</strong>
                    <p>Your real name and public profile will NOT be associated with this discussion thread.</p>
                  </div>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsComposerOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Posting...' : 'Publish Discussion'}
                  <Send size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .community-page-wrapper {
          padding-bottom: 5rem;
        }

        .community-banner {
          height: 120px;
          display: flex;
          align-items: center;
        }

        .back-to-comm-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #FFF;
          font-size: 0.875rem;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.35);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          backdrop-filter: blur(4px);
        }

        .community-header-card {
          margin-top: -40px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .header-card-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .comm-icon-large {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: var(--brand-deep-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .comm-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .comm-title-row h1 {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .domain-pill {
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .comm-headline {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .member-count-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
          display: inline-block;
        }

        /* Discord Workspace Layout */
        .community-workspace-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 820px) {
          .community-workspace-layout {
            grid-template-columns: 1fr;
          }
        }

        .channel-sidebar {
          padding: 1rem;
          background: var(--surface-card);
        }

        .channel-sidebar-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          padding: 0 0.5rem;
        }

        .channels-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .channel-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .channel-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }

        .channel-btn.active {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          font-weight: 700;
        }

        .channel-hash-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .channel-btn.active .channel-hash-icon {
          color: var(--brand-primary);
        }

        .channel-security-notice {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .text-purple {
          color: #9333EA;
        }

        /* Main Channel Content */
        .channel-main-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .channel-header-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface-card);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .channel-current-name {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .channel-current-name h2 {
          font-size: 1.25rem;
        }

        .channel-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .discussions-stream {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .discussion-item-card {
          padding: 1.25rem;
          background: var(--surface-card);
        }

        .disc-author-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
        }

        .disc-author-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .disc-author-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .disc-author-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .disc-author-user {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .disc-title-link {
          display: block;
          margin-bottom: 0.5rem;
        }

        .disc-title-link h3 {
          font-size: 1.15rem;
          line-height: 1.35;
          color: var(--text-primary);
          transition: color var(--transition-fast);
        }

        .disc-title-link:hover h3 {
          color: var(--brand-primary);
        }

        .disc-excerpt {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .disc-tags-row {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 0.85rem;
        }

        .disc-tag {
          font-size: 0.75rem;
          color: var(--brand-primary);
          font-weight: 500;
        }

        .disc-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .disc-stats-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .disc-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }

        .disc-action-btn:hover {
          color: var(--brand-primary);
        }

        .disc-action-btn.liked {
          color: var(--brand-primary);
          font-weight: 700;
        }

        .disc-read-thread-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand-primary);
        }

        .empty-channel-card {
          padding: 3rem 1.5rem;
          text-align: center;
          background: var(--surface-card);
        }

        .empty-ch-icon {
          color: var(--brand-primary);
          margin: 0 auto 0.75rem;
        }

        /* Modal Styles */
        .disc-modal {
          padding: 1.75rem;
          max-width: 580px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .pseudonym-checkbox-box {
          background: rgba(126, 34, 206, 0.08);
          border: 1px solid rgba(192, 132, 252, 0.3);
          padding: 0.85rem;
          border-radius: var(--radius-md);
          margin: 1.25rem 0;
        }

        .pseudo-toggle-label {
          display: flex;
          gap: 0.75rem;
          cursor: pointer;
        }

        .pseudo-toggle-label strong {
          display: block;
          font-size: 0.8125rem;
          color: #7E22CE;
          margin-bottom: 0.15rem;
        }

        [data-theme="dark"] .pseudo-toggle-label strong {
          color: #C084FC;
        }

        .pseudo-toggle-label p {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
