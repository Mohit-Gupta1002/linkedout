'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Briefcase, MapPin, Globe, ExternalLink, Calendar, 
  Users, Check, Edit3, Sparkles, Image as ImageIcon, Rocket 
} from 'lucide-react';
import { UserProfile, Post } from '@/types';
import { StorageEngine } from '@/lib/storage';
import PostCard from '@/components/PostCard';

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const params = useParams();
  const usernameParam = params?.username as string;

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'about'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const user = StorageEngine.getUser();
    setCurrentUser(user);

    // If viewing own username or param matches
    if (usernameParam === user.username) {
      setProfileUser(user);
    } else {
      // Find or build user representation from initial authors
      setProfileUser({
        id: `usr_${usernameParam}`,
        username: usernameParam,
        display_name: usernameParam === 'priya_ai' ? 'Dr. Priya Venkatesh' : 
                      usernameParam === 'ananya_ux' ? 'Ananya Roy' : 
                      usernameParam === 'rohit_k' ? 'Rohit Kulkarni' : 
                      usernameParam.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        avatar_url: usernameParam === 'priya_ai' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' :
                    usernameParam === 'ananya_ux' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' :
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        headline: 'Staff Specialist & Engineer | Systems Design Advocate',
        bio: 'Passionate about engineering excellence, distributed cloud architecture, and building accessible products.',
        status: 'Working professional',
        domain: 'Software Engineering',
        experience: '6–10 years',
        company: 'Distributed Systems Labs',
        location: 'Bengaluru, India',
        country: 'India',
        city: 'Bengaluru',
        skills: ['TypeScript', 'Kubernetes', 'Go', 'Architecture', 'Distributed Systems'],
        interests: ['Software Engineering', 'AI', 'Startups', 'Career Growth'],
        content_preferences: ['Professional insights', 'Projects and achievements'],
        portfolio_url: 'https://github.com',
        followers_count: 1420,
        following_count: 480,
        created_at: new Date().toISOString(),
        onboarding_completed: true
      });
    }

    const allPosts = StorageEngine.getPosts();
    setPosts(allPosts.filter(p => !p.is_pseudonymous && p.author_username === usernameParam));
    setIsFollowing(StorageEngine.isFollowingUser(`usr_${usernameParam}`));
  }, [usernameParam]);

  if (!profileUser) {
    return (
      <div className="app-container not-found-box">
        <h2>Profile not found</h2>
        <Link href="/feed" className="btn btn-secondary mt-3">
          &larr; Return to Feed
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === profileUser.username;

  const handleToggleFollow = () => {
    const nextStatus = StorageEngine.toggleFollowUser(profileUser.id);
    setIsFollowing(nextStatus);
    setProfileUser(prev => prev ? {
      ...prev,
      followers_count: nextStatus ? prev.followers_count + 1 : Math.max(0, prev.followers_count - 1)
    } : null);
  };

  const mediaPosts = posts.filter(p => p.media_urls && p.media_urls.length > 0);

  return (
    <div className="profile-page-wrapper">
      <div className="app-container profile-container">
        {/* Profile Card Header */}
        <div className="card profile-hero-card">
          <div className="profile-banner-bg" />

          <div className="profile-hero-content">
            <div className="avatar-and-actions">
              <div className="profile-avatar-wrapper">
                <img src={profileUser.avatar_url} alt={profileUser.display_name} className="profile-main-avatar" />
              </div>

              <div className="hero-action-buttons">
                {isOwnProfile ? (
                  <Link href="/auth/onboarding" className="btn btn-secondary btn-sm">
                    <Edit3 size={15} />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <button 
                    onClick={handleToggleFollow}
                    className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {isFollowing ? (
                      <>
                        <Check size={15} />
                        <span>Following</span>
                      </>
                    ) : (
                      <span>+ Follow</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-identity-section">
              <div className="profile-name-row">
                <h1>{profileUser.display_name}</h1>
                <span className="profile-username-tag">@{profileUser.username}</span>
              </div>

              <p className="profile-headline">{profileUser.headline}</p>

              <div className="profile-metadata-row">
                <div className="meta-item">
                  <Briefcase size={14} className="meta-icon" />
                  <span>{profileUser.company || profileUser.domain}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={14} className="meta-icon" />
                  <span>{profileUser.location || profileUser.country}</span>
                </div>
                {profileUser.portfolio_url && (
                  <a href={profileUser.portfolio_url} target="_blank" rel="noreferrer" className="meta-item link">
                    <Globe size={14} className="meta-icon" />
                    <span>Portfolio</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {profileUser.bio && (
                <p className="profile-bio-text">{profileUser.bio}</p>
              )}

              {/* Follower Counts */}
              <div className="profile-counts-row">
                <span className="count-unit">
                  <strong>{profileUser.followers_count.toLocaleString()}</strong> followers
                </span>
                <span className="count-dot">&bull;</span>
                <span className="count-unit">
                  <strong>{profileUser.following_count.toLocaleString()}</strong> following
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="profile-tabs-bar">
          <button
            onClick={() => setActiveTab('posts')}
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          >
            Posts & RFCs ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          >
            <ImageIcon size={16} />
            <span>Visual Media ({mediaPosts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          >
            Skills & Credibility
          </button>
        </div>

        {/* Tab 1: Posts Stream */}
        {activeTab === 'posts' && (
          <div className="tab-pane animate-fade-in">
            {posts.length > 0 ? (
              posts.map(p => (
                <PostCard
                  key={p.id}
                  post={p}
                  currentUser={currentUser}
                  onPostUpdated={(up) => setPosts(prev => prev.map(item => item.id === up.id ? up : item))}
                />
              ))
            ) : (
              <div className="card empty-profile-tab">
                <Sparkles size={32} className="empty-tab-icon" />
                <h3>No public posts published yet</h3>
                <p>When {profileUser.display_name} posts updates or milestones, they will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Visual Media Grid */}
        {activeTab === 'media' && (
          <div className="tab-pane animate-fade-in">
            {mediaPosts.length > 0 ? (
              <div className="profile-media-gallery">
                {mediaPosts.map(p => (
                  <div key={p.id} className="card gallery-card">
                    {p.media_urls?.[0] && (
                      <img src={p.media_urls[0]} alt="" className="gallery-img" />
                    )}
                    <div className="gallery-caption">
                      <p>{p.content.slice(0, 70)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card empty-profile-tab">
                <ImageIcon size={32} className="empty-tab-icon" />
                <h3>No visual media shared yet</h3>
                <p>Photos and architecture diagrams shared by {profileUser.display_name} will be displayed here.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: About & Credibility */}
        {activeTab === 'about' && (
          <div className="tab-pane animate-fade-in">
            <div className="card about-credibility-card">
              <h3>Technical Skills & Core Proficiencies</h3>
              <div className="skills-badge-list">
                {profileUser.skills.map(skill => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="divider-line" />

              <h3>Professional Interests</h3>
              <div className="skills-badge-list">
                {profileUser.interests.map(interest => (
                  <span key={interest} className="interest-pill">
                    #{interest}
                  </span>
                ))}
              </div>

              <div className="divider-line" />

              <div className="experience-detail-row">
                <div className="exp-box">
                  <span className="exp-label">Primary Domain</span>
                  <span className="exp-val">{profileUser.domain}</span>
                </div>
                <div className="exp-box">
                  <span className="exp-label">Experience Bracket</span>
                  <span className="exp-val">{profileUser.experience}</span>
                </div>
                <div className="exp-box">
                  <span className="exp-label">Status</span>
                  <span className="exp-val">{profileUser.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page-wrapper {
          padding-bottom: 5rem;
        }

        .profile-container {
          max-width: 820px;
        }

        .profile-hero-card {
          overflow: hidden;
          background: var(--surface-card);
          margin-bottom: 1.5rem;
        }

        .profile-banner-bg {
          height: 140px;
          background: var(--story-gradient);
        }

        .profile-hero-content {
          padding: 0 2rem 2rem;
        }

        .avatar-and-actions {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: -50px;
          margin-bottom: 1.25rem;
        }

        .profile-avatar-wrapper {
          padding: 3px;
          background: var(--surface-card);
          border-radius: var(--radius-full);
          display: inline-flex;
        }

        .profile-main-avatar {
          width: 100px;
          height: 100px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 3px solid var(--surface-card);
        }

        .hero-action-buttons {
          margin-bottom: 0.5rem;
        }

        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .profile-name-row h1 {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .profile-username-tag {
          font-size: 0.9375rem;
          color: var(--text-muted);
        }

        .profile-headline {
          font-size: 1.05rem;
          color: var(--text-secondary);
          margin-top: 0.35rem;
          line-height: 1.4;
        }

        .profile-metadata-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.75rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .meta-item.link {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .meta-item.link:hover {
          text-decoration: underline;
        }

        .meta-icon {
          color: var(--text-muted);
        }

        .profile-bio-text {
          font-size: 0.9375rem;
          color: var(--text-primary);
          line-height: 1.6;
          margin-top: 1rem;
        }

        .profile-counts-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .profile-counts-row strong {
          color: var(--text-primary);
        }

        .count-dot {
          color: var(--text-muted);
        }

        /* Tabs Bar */
        .profile-tabs-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.25rem;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--brand-primary);
        }

        .tab-btn.active {
          color: var(--brand-primary);
          border-bottom-color: var(--brand-primary);
          background: var(--surface-card);
        }

        .tab-pane {
          display: flex;
          flex-direction: column;
        }

        .empty-profile-tab {
          padding: 3rem 1.5rem;
          text-align: center;
          background: var(--surface-card);
        }

        .empty-tab-icon {
          color: var(--brand-primary);
          margin: 0 auto 0.75rem;
        }

        .empty-profile-tab h3 {
          font-size: 1.15rem;
          margin-bottom: 0.25rem;
        }

        .empty-profile-tab p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        /* Gallery */
        .profile-media-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .gallery-card {
          overflow: hidden;
          background: var(--surface-card);
        }

        .gallery-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .gallery-caption {
          padding: 0.75rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        /* About Tab */
        .about-credibility-card {
          padding: 2rem;
          background: var(--surface-card);
        }

        .about-credibility-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .skills-badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-pill {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .interest-pill {
          background: var(--surface-hover);
          color: var(--text-primary);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid var(--border-subtle);
        }

        .divider-line {
          height: 1px;
          background: var(--border-subtle);
          margin: 1.75rem 0;
        }

        .experience-detail-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .exp-box {
          display: flex;
          flex-direction: column;
        }

        .exp-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .exp-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 0.2rem;
        }
      `}</style>
    </div>
  );
}
