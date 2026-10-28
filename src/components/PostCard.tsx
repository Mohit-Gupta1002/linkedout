'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, MessageSquare, Bookmark, Share2, MoreHorizontal, 
  Shield, Rocket, Award, ExternalLink, Send, Trash2, Check
} from 'lucide-react';
import { Post, UserProfile, Comment } from '@/types';
import { StorageEngine } from '@/lib/storage';

interface PostCardProps {
  post: Post;
  currentUser: UserProfile | null;
  onPostUpdated: (updatedPost: Post) => void;
  onPostDeleted?: (postId: string) => void;
}

export default function PostCard({
  post,
  currentUser,
  onPostUpdated,
  onPostDeleted
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: `comm_${post.id}_1`,
      post_id: post.id,
      author_id: 'usr_rohit',
      author_name: 'Rohit Kulkarni',
      author_username: 'rohit_k',
      author_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      author_headline: 'Lead SRE @ RazorCloud',
      content: 'Great breakdown. We observed similar latency improvements on ARM chips.',
      likes_count: 5,
      is_liked: false,
      created_at: new Date(Date.now() - 3600 * 1000).toISOString()
    }
  ]);
  const [shareCopied, setShareCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(() => 
    StorageEngine.isFollowingUser(post.author_id)
  );

  const isMyPost = currentUser && currentUser.id === post.author_id;

  const handleLike = () => {
    const updated = StorageEngine.toggleLikePost(post.id);
    if (updated) onPostUpdated(updated);
  };

  const handleBookmark = () => {
    const updated = StorageEngine.toggleBookmarkPost(post.id);
    if (updated) onPostUpdated(updated);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `/feed?post=${post.id}`);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleToggleFollow = () => {
    const status = StorageEngine.toggleFollowUser(post.author_id);
    setIsFollowing(status);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      post_id: post.id,
      author_id: currentUser.id,
      author_name: currentUser.display_name,
      author_username: currentUser.username,
      author_avatar: currentUser.avatar_url,
      author_headline: currentUser.headline,
      content: commentText.trim(),
      likes_count: 0,
      is_liked: false,
      created_at: new Date().toISOString()
    };

    setComments([...comments, newComment]);
    setCommentText('');

    // Update parent post comment count
    const updatedPost: Post = {
      ...post,
      comments_count: post.comments_count + 1
    };
    onPostUpdated(updatedPost);
  };

  const handleDeletePost = () => {
    StorageEngine.deletePost(post.id);
    if (onPostDeleted) onPostDeleted(post.id);
  };

  const formatTimestamp = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <article className="card post-card" id={`post-${post.id}`}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-author-block">
          <Link href={post.is_pseudonymous ? '#' : `/profile/${post.author_username}`} className="avatar-link">
            <img src={post.author_avatar} alt={post.author_name} className="post-author-avatar" />
          </Link>

          <div className="author-details">
            <div className="author-name-row">
              <Link href={post.is_pseudonymous ? '#' : `/profile/${post.author_username}`} className="author-display-name">
                {post.author_name}
              </Link>

              {post.is_pseudonymous ? (
                <span className="badge badge-pseudo">
                  <Shield size={11} />
                  <span>Pseudonym</span>
                </span>
              ) : (
                <span className="author-username">@{post.author_username}</span>
              )}

              {!isMyPost && !post.is_pseudonymous && (
                <button 
                  onClick={handleToggleFollow}
                  className={`btn-follow-inline ${isFollowing ? 'following' : ''}`}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </button>
              )}
            </div>

            <div className="author-headline">{post.author_headline}</div>
            <div className="post-timestamp">{formatTimestamp(post.created_at)}</div>
          </div>
        </div>

        {/* Post Options Menu */}
        {isMyPost && (
          <button onClick={handleDeletePost} className="post-delete-btn" title="Delete post">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Community Reference Tag */}
      {post.community_name && (
        <div className="post-community-badge">
          <span>In community: </span>
          <Link href={`/communities/${post.community_id}`} className="comm-link">
            #{post.community_name}
          </Link>
        </div>
      )}

      {/* Achievement Milestone Banner */}
      {post.achievement_badge && (
        <div className="achievement-banner">
          <Award size={20} className="achievement-icon" />
          <div>
            <div className="achievement-title">Celebrated Milestone</div>
            <div className="achievement-name">{post.achievement_badge}</div>
          </div>
        </div>
      )}

      {/* Main Post Content */}
      <div className="post-body">
        <p className="post-content-text">{post.content}</p>

        {/* Project Showcase Box */}
        {post.project_title && (
          <div className="project-showcase-box">
            <div className="project-box-header">
              <Rocket size={18} className="project-icon" />
              <h4>{post.project_title}</h4>
            </div>
            {post.project_link && (
              <a 
                href={post.project_link} 
                target="_blank" 
                rel="noreferrer" 
                className="project-link-btn"
              >
                <span>View Repository / Live Demo</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {/* Media Grid */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className={`post-media-container grid-${Math.min(post.media_urls.length, 2)}`}>
            {post.media_urls.map((url, idx) => (
              <div key={idx} className="post-media-item">
                <img src={url} alt={`Post media ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags-list">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Action Bar */}
      <div className="post-actions-bar">
        <button 
          onClick={handleLike} 
          className={`action-btn like-btn ${post.is_liked ? 'liked' : ''}`}
          aria-label="Like post"
        >
          <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
          <span>{post.likes_count}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)} 
          className="action-btn comment-btn"
          aria-label="Comments"
        >
          <MessageSquare size={18} />
          <span>{comments.length}</span>
        </button>

        <button 
          onClick={handleBookmark} 
          className={`action-btn bookmark-btn ${post.is_bookmarked ? 'bookmarked' : ''}`}
          aria-label="Bookmark post"
        >
          <Bookmark size={18} fill={post.is_bookmarked ? 'currentColor' : 'none'} />
        </button>

        <button 
          onClick={handleShare} 
          className="action-btn share-btn"
          title="Share post"
          aria-label="Share post"
        >
          {shareCopied ? <Check size={18} color="var(--success)" /> : <Share2 size={18} />}
          {shareCopied && <span className="share-toast">Copied!</span>}
        </button>
      </div>

      {/* Comment Section (Expandable) */}
      {showComments && (
        <div className="comments-section animate-fade-in">
          {currentUser && (
            <form onSubmit={handleAddComment} className="comment-composer">
              <img src={currentUser.avatar_url} alt="" className="comment-my-avatar" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a constructive thought or question..."
                className="input sm"
              />
              <button 
                type="submit" 
                disabled={!commentText.trim()} 
                className="btn btn-primary btn-sm"
              >
                <Send size={14} />
              </button>
            </form>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <img src={comment.author_avatar} alt="" className="comment-avatar" />
                <div className="comment-content-box">
                  <div className="comment-author-row">
                    <span className="comment-author-name">{comment.author_name}</span>
                    <span className="comment-time">{formatTimestamp(comment.created_at)}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .post-card {
          padding: 1.5rem;
          margin-bottom: 1.25rem;
          background: var(--surface-card);
        }

        .post-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .post-author-block {
          display: flex;
          gap: 0.75rem;
        }

        .post-author-avatar {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .author-display-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .author-display-name:hover {
          color: var(--brand-primary);
        }

        .author-username {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .btn-follow-inline {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand-primary);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          background: var(--brand-primary-light);
          transition: all var(--transition-fast);
        }

        .btn-follow-inline:hover {
          background: var(--brand-primary);
          color: #FFF;
        }

        .btn-follow-inline.following {
          background: var(--surface-hover);
          color: var(--text-secondary);
        }

        .author-headline {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
          line-height: 1.3;
        }

        .post-timestamp {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .post-delete-btn {
          color: var(--text-muted);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
        }

        .post-delete-btn:hover {
          color: var(--error);
          background: var(--error-bg);
        }

        .post-community-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .comm-link {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .comm-link:hover {
          text-decoration: underline;
        }

        .achievement-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
        }

        .achievement-icon {
          color: #D97706;
        }

        .achievement-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #D97706;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .achievement-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .post-content-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-primary);
          white-space: pre-wrap;
          margin-bottom: 1rem;
        }

        .project-showcase-box {
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .project-box-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .project-icon {
          color: var(--brand-primary);
        }

        .project-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand-primary);
        }

        .project-link-btn:hover {
          text-decoration: underline;
        }

        .post-media-container {
          display: grid;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .post-media-container.grid-1 {
          grid-template-columns: 1fr;
        }

        .post-media-container.grid-2 {
          grid-template-columns: 1fr 1fr;
        }

        .post-media-item img {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .post-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .post-tag {
          font-size: 0.8125rem;
          color: var(--brand-primary);
          font-weight: 500;
        }

        .post-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          position: relative;
        }

        .action-btn:hover {
          background: var(--surface-hover);
          color: var(--brand-primary);
        }

        .like-btn.liked {
          color: #DC2626;
        }

        .bookmark-btn.bookmarked {
          color: var(--brand-primary);
        }

        .share-toast {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--text-primary);
          color: var(--surface-card);
          font-size: 0.7rem;
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-xs);
          white-space: nowrap;
        }

        /* Comments Section */
        .comments-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-subtle);
        }

        .comment-composer {
          display: flex;
          gap: 0.65rem;
          margin-bottom: 1rem;
        }

        .comment-my-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comment-item {
          display: flex;
          gap: 0.65rem;
        }

        .comment-avatar {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .comment-content-box {
          background: var(--surface-hover);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-md);
          flex: 1;
        }

        .comment-author-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.2rem;
        }

        .comment-author-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .comment-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .comment-text {
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.4;
        }
      `}</style>
    </article>
  );
}
