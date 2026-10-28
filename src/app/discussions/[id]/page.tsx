'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, MessageSquare, ThumbsUp, Shield, Send, 
  Share2, Bookmark, Check, CornerDownRight 
} from 'lucide-react';
import { Discussion, DiscussionReply, UserProfile } from '@/types';
import { StorageEngine } from '@/lib/storage';

export default function DiscussionDetailPage() {
  return (
    <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading discussion...</div>}>
      <DiscussionDetailContent />
    </Suspense>
  );
}

function DiscussionDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyPseudonymously, setReplyPseudonymously] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = StorageEngine.getUser();
    setCurrentUser(user);

    const disc = StorageEngine.getDiscussionById(id);
    if (disc) {
      setDiscussion(disc);
      setReplies(StorageEngine.getDiscussionReplies(disc.id));
    }
  }, [id]);

  if (!discussion) {
    return (
      <div className="app-container not-found-box">
        <h2>Discussion not found</h2>
        <Link href="/communities" className="btn btn-secondary mt-3">
          &larr; Return to Communities
        </Link>
      </div>
    );
  }

  const handleLike = () => {
    const updated = StorageEngine.toggleLikeDiscussion(discussion.id);
    if (updated) setDiscussion(updated);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = StorageEngine.addDiscussionReply(
      discussion.id,
      replyText.trim(),
      replyPseudonymously
    );

    setReplies(prev => [...prev, newReply]);
    setDiscussion(prev => prev ? { ...prev, replies_count: prev.replies_count + 1 } : null);
    setReplyText('');
  };

  return (
    <div className="discussion-page">
      <div className="app-container thread-container">
        {/* Navigation Breadcrumb */}
        <div className="thread-breadcrumb">
          <Link href={`/communities/${discussion.community_slug}`} className="back-link">
            <ArrowLeft size={16} />
            <span>Back to #{discussion.channel_name}</span>
          </Link>
        </div>

        {/* Main Discussion Post Card */}
        <article className="card thread-main-card">
          <div className="thread-author-header">
            <img src={discussion.author_avatar} alt="" className="thread-avatar" />
            <div>
              <div className="thread-author-row">
                <span className="author-name">{discussion.author_name}</span>
                {discussion.is_pseudonymous ? (
                  <span className="badge badge-pseudo">
                    <Shield size={11} />
                    <span>Pseudonym</span>
                  </span>
                ) : (
                  <span className="author-handle">@{discussion.author_username}</span>
                )}
              </div>
              <span className="thread-time">
                Posted in #{discussion.channel_name} &bull; {new Date(discussion.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <h1 className="thread-title">{discussion.title}</h1>

          <div className="thread-body-text">
            {discussion.content}
          </div>

          {discussion.tags && discussion.tags.length > 0 && (
            <div className="thread-tags-row">
              {discussion.tags.map(tag => (
                <span key={tag} className="thread-tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="thread-action-row">
            <button 
              onClick={handleLike} 
              className={`thread-btn like ${discussion.is_liked ? 'liked' : ''}`}
            >
              <ThumbsUp size={16} />
              <span>{discussion.likes_count} Helpful</span>
            </button>

            <button onClick={handleShare} className="thread-btn">
              {copied ? <Check size={16} color="var(--success)" /> : <Share2 size={16} />}
              <span>{copied ? 'Link Copied!' : 'Share Thread'}</span>
            </button>
          </div>
        </article>

        {/* Replies Section */}
        <section className="replies-section">
          <div className="replies-header">
            <h3>Discussion Thread ({replies.length})</h3>
          </div>

          {/* New Reply Composer */}
          {currentUser && (
            <div className="card reply-composer-card">
              <form onSubmit={handleAddReply}>
                <div className="reply-composer-top">
                  <img 
                    src={replyPseudonymously ? (currentUser.pseudonym_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80') : currentUser.avatar_url} 
                    alt="" 
                    className="reply-composer-avatar" 
                  />
                  <div className="reply-input-wrapper">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        replyPseudonymously 
                          ? "Reply candidly with protected pseudonym..." 
                          : "Contribute thoughtful technical feedback or answer..."
                      }
                      className="textarea sm"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="reply-composer-bottom">
                  <label className="pseudo-reply-toggle">
                    <input
                      type="checkbox"
                      checked={replyPseudonymously}
                      onChange={(e) => setReplyPseudonymously(e.target.checked)}
                    />
                    <Shield size={14} className="text-purple" />
                    <span>Reply as @{currentUser.pseudonym_username || 'verified_dev'} (Pseudonym)</span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={!replyText.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Reply</span>
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Replies Stream */}
          <div className="replies-stream">
            {replies.map((reply) => (
              <div key={reply.id} className="card reply-card">
                <div className="reply-author-row">
                  <img src={reply.author_avatar} alt="" className="reply-avatar" />
                  <div className="reply-author-info">
                    <div className="reply-name-row">
                      <span className="reply-author-name">{reply.author_name}</span>
                      {reply.is_pseudonymous ? (
                        <span className="badge badge-pseudo">
                          <Shield size={10} />
                          <span>Pseudonym</span>
                        </span>
                      ) : (
                        <span className="reply-author-handle">@{reply.author_username}</span>
                      )}
                    </div>
                    <span className="reply-time">
                      {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="reply-content-body">
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .discussion-page {
          padding: 2rem 0 5rem;
        }

        .thread-container {
          max-width: 780px;
        }

        .thread-breadcrumb {
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

        .back-link:hover {
          text-decoration: underline;
        }

        .thread-main-card {
          padding: 2rem;
          background: var(--surface-card);
          margin-bottom: 2rem;
        }

        .thread-author-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .thread-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .thread-author-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .author-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .author-handle {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .thread-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
          margin-top: 0.15rem;
        }

        .thread-title {
          font-size: 1.75rem;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 1.25rem;
          color: var(--text-primary);
        }

        .thread-body-text {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-primary);
          white-space: pre-wrap;
          margin-bottom: 1.5rem;
        }

        .thread-tags-row {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .thread-tag {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--brand-primary);
        }

        .thread-action-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .thread-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--surface-hover);
          transition: all var(--transition-fast);
        }

        .thread-btn:hover {
          background: var(--surface-active);
          color: var(--brand-primary);
        }

        .thread-btn.like.liked {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
        }

        /* Replies Section */
        .replies-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .replies-header h3 {
          font-size: 1.25rem;
        }

        .reply-composer-card {
          padding: 1.25rem;
          background: var(--surface-card);
        }

        .reply-composer-top {
          display: flex;
          gap: 0.75rem;
        }

        .reply-composer-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          object-fit: cover;
          flex-shrink: 0;
        }

        .reply-input-wrapper {
          flex: 1;
        }

        .reply-composer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pseudo-reply-toggle {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .text-purple {
          color: #9333EA;
        }

        .replies-stream {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reply-card {
          padding: 1.25rem;
          background: var(--surface-card);
        }

        .reply-author-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
        }

        .reply-avatar {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .reply-name-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .reply-author-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .reply-author-handle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .reply-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .reply-content-body {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-primary);
          white-space: pre-wrap;
        }

        .not-found-box {
          text-align: center;
          padding: 4rem 1rem;
        }
      `}</style>
    </div>
  );
}
