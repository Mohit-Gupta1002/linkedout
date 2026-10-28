'use client';

import React, { useState } from 'react';
import { 
  Image as ImageIcon, Award, Rocket, Shield, 
  Send, X, Sparkles, Globe, Lock, Plus, Users
} from 'lucide-react';
import { Post, UserProfile, PostType, Community } from '@/types';
import { StorageEngine } from '@/lib/storage';

interface PostComposerProps {
  currentUser: UserProfile;
  communities: Community[];
  onPostCreated: (post: Post) => void;
}

const SAMPLE_POST_IMAGES = [
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80'
];

export default function PostComposer({ currentUser, communities, onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('text');
  const [isPseudonymous, setIsPseudonymous] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [achievementBadge, setAchievementBadge] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddImage = (url: string) => {
    if (url && !mediaUrls.includes(url)) {
      setMediaUrls([...mediaUrls, url]);
      setNewImageUrl('');
      setPostType('image');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(updated);
    if (updated.length === 0 && postType === 'image') {
      setPostType('text');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const targetCommunity = communities.find(c => c.id === selectedCommunityId);

    const newPost = StorageEngine.addPost({
      author_id: currentUser.id,
      author_name: isPseudonymous ? (currentUser.pseudonym_username || 'Protected Engineer') : currentUser.display_name,
      author_username: isPseudonymous ? (currentUser.pseudonym_username || 'pseudonymous_user') : currentUser.username,
      author_avatar: isPseudonymous ? (currentUser.pseudonym_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80') : currentUser.avatar_url,
      author_headline: isPseudonymous ? 'Protected Pseudonymous Contributor' : currentUser.headline,
      author_domain: currentUser.domain,
      is_pseudonymous: isPseudonymous,
      pseudonym_name: isPseudonymous ? (currentUser.pseudonym_username || 'Protected Identity') : undefined,
      content,
      post_type: postType,
      media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
      project_title: projectTitle || undefined,
      project_link: projectLink || undefined,
      achievement_badge: achievementBadge || undefined,
      tags: tags.length > 0 ? tags : undefined,
      community_id: targetCommunity?.id,
      community_name: targetCommunity?.name
    });

    // Reset Form
    setContent('');
    setMediaUrls([]);
    setProjectTitle('');
    setProjectLink('');
    setAchievementBadge('');
    setTagsInput('');
    setIsExpanded(false);
    setIsSubmitting(false);

    onPostCreated(newPost);
  };

  return (
    <div className="card composer-card">
      <form onSubmit={handleSubmit}>
        <div className="composer-top">
          <img 
            src={isPseudonymous ? (currentUser.pseudonym_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80') : currentUser.avatar_url} 
            alt="" 
            className="composer-avatar"
          />

          <div className="composer-input-area">
            {/* Identity Selector */}
            <div className="identity-mode-pill-bar">
              <button
                type="button"
                onClick={() => setIsPseudonymous(false)}
                className={`identity-toggle-btn ${!isPseudonymous ? 'active' : ''}`}
              >
                <Globe size={13} />
                <span>As {currentUser.display_name.split(' ')[0]}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPseudonymous(true)}
                className={`identity-toggle-btn pseudo ${isPseudonymous ? 'active' : ''}`}
              >
                <Shield size={13} />
                <span>Pseudonym Mode</span>
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={
                isPseudonymous
                  ? "Share an honest workplace observation, architecture challenge, or salary insight safely..."
                  : "Share a project milestone, technical insight, or learning experience..."
              }
              className="composer-textarea"
              rows={isExpanded ? 3 : 2}
            />
          </div>
        </div>

        {/* Media Previews */}
        {mediaUrls.length > 0 && (
          <div className="composer-media-grid">
            {mediaUrls.map((url, i) => (
              <div key={i} className="composer-media-item">
                <img src={url} alt="" />
                <button type="button" onClick={() => handleRemoveImage(i)} className="remove-media-btn">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Expanded Fields */}
        {isExpanded && (
          <div className="composer-expanded-fields animate-fade-in">
            {/* Add Image URL bar */}
            {showImageInput && (
              <div className="inline-media-adder">
                <div className="input-group-row">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="input sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleAddImage(newImageUrl)} 
                    className="btn btn-secondary btn-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="quick-sample-photos">
                  <span>Quick demo photos:</span>
                  {SAMPLE_POST_IMAGES.map((img, i) => (
                    <button key={i} type="button" onClick={() => handleAddImage(img)} className="sample-photo-btn">
                      Image {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project Showcase Inputs */}
            {postType === 'project' && (
              <div className="form-row-2 composer-extra-row">
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project name (e.g. Distributed KV Cache)"
                  className="input sm"
                />
                <input
                  type="text"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="GitHub or Demo URL"
                  className="input sm"
                />
              </div>
            )}

            {/* Achievement Badge Input */}
            {postType === 'achievement' && (
              <div className="composer-extra-row">
                <input
                  type="text"
                  value={achievementBadge}
                  onChange={(e) => setAchievementBadge(e.target.value)}
                  placeholder="Milestone title (e.g. Shipped to 1M users, Passed AWS Specialty)"
                  className="input sm"
                />
              </div>
            )}

            {/* Community and Tags Row */}
            <div className="form-row-2 composer-extra-row">
              <select 
                value={selectedCommunityId} 
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                className="select sm"
              >
                <option value="">Post to Public Feed</option>
                {communities.map(c => (
                  <option key={c.id} value={c.id}>Post to {c.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tags (e.g. AI, NextJS, Architecture)"
                className="input sm"
              />
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="composer-footer">
          <div className="composer-tools">
            <button
              type="button"
              onClick={() => { setShowImageInput(!showImageInput); setIsExpanded(true); }}
              className={`tool-btn ${showImageInput || mediaUrls.length > 0 ? 'active' : ''}`}
              title="Add photos"
            >
              <ImageIcon size={18} />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPostType(postType === 'project' ? 'text' : 'project');
                setIsExpanded(true);
              }}
              className={`tool-btn ${postType === 'project' ? 'active' : ''}`}
              title="Showcase project"
            >
              <Rocket size={18} />
              <span>Project</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPostType(postType === 'achievement' ? 'text' : 'achievement');
                setIsExpanded(true);
              }}
              className={`tool-btn ${postType === 'achievement' ? 'active' : ''}`}
              title="Share achievement"
            >
              <Award size={18} />
              <span>Milestone</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && mediaUrls.length === 0)}
            className="btn btn-primary btn-sm composer-submit"
          >
            <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
            <Send size={15} />
          </button>
        </div>
      </form>

      <style jsx>{`
        .composer-card {
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          background: var(--surface-card);
        }

        .composer-top {
          display: flex;
          gap: 0.85rem;
        }

        .composer-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          object-fit: cover;
          flex-shrink: 0;
        }

        .composer-input-area {
          flex: 1;
        }

        .identity-mode-pill-bar {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .identity-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .identity-toggle-btn.active {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          border-color: var(--brand-primary);
        }

        .identity-toggle-btn.pseudo.active {
          background: #F3E8FF;
          color: #7E22CE;
          border-color: #D8B4FE;
        }

        [data-theme="dark"] .identity-toggle-btn.pseudo.active {
          background: rgba(126, 34, 206, 0.2);
          color: #C084FC;
          border-color: rgba(192, 132, 252, 0.3);
        }

        .composer-textarea {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.95rem;
          line-height: 1.5;
          resize: none;
        }

        .composer-textarea:focus {
          outline: none;
        }

        .composer-media-grid {
          display: flex;
          gap: 0.65rem;
          margin: 0.85rem 0;
          overflow-x: auto;
        }

        .composer-media-item {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }

        .composer-media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-media-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFF;
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .composer-expanded-fields {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .inline-media-adder {
          background: var(--surface-hover);
          padding: 0.65rem;
          border-radius: var(--radius-md);
        }

        .input-group-row {
          display: flex;
          gap: 0.5rem;
        }

        .quick-sample-photos {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .sample-photo-btn {
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--brand-primary);
        }

        .composer-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .composer-tools {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tool-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .tool-btn:hover {
          background: var(--surface-hover);
          color: var(--brand-primary);
        }

        .tool-btn.active {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
        }

        .composer-submit {
          padding: 0.45rem 1.15rem;
        }
      `}</style>
    </div>
  );
}
