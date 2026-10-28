'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, Search, Users, Building2, Rocket, 
  Star, ArrowRight, Check, Sparkles, Shield 
} from 'lucide-react';
import { Community, Company, Post, UserProfile } from '@/types';
import { StorageEngine } from '@/lib/storage';

type ExploreTab = 'all' | 'people' | 'communities' | 'companies' | 'projects';

const FEATURED_PROFESSIONALS = [
  {
    id: 'usr_priya',
    username: 'priya_ai',
    display_name: 'Dr. Priya Venkatesh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    headline: 'Principal AI Scientist @ DeepMatrix | PhD IIT Madras',
    domain: 'AI & Machine Learning',
    followers: 3240
  },
  {
    id: 'usr_ananya',
    username: 'ananya_ux',
    display_name: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    headline: 'Staff Product Designer @ FinScale | Design Systems',
    domain: 'Design & UX',
    followers: 1890
  },
  {
    id: 'usr_rohit',
    username: 'rohit_k',
    display_name: 'Rohit Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    headline: 'Lead Site Reliability Engineer @ RazorCloud | Kubernetes',
    domain: 'Software Engineering',
    followers: 2450
  }
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExploreTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    setCommunities(StorageEngine.getCommunities());
    setCompanies(StorageEngine.getCompanies());
    setPosts(StorageEngine.getPosts());
    setFollowedIds(StorageEngine.getFollowedUserIds());
  }, []);

  const handleToggleFollow = (id: string) => {
    const isNowFollowing = StorageEngine.toggleFollowUser(id);
    setFollowedIds(prev => isNowFollowing ? [...prev, id] : prev.filter(x => x !== id));
  };

  const projectPosts = posts.filter(p => p.post_type === 'project' || p.project_title);

  return (
    <div className="explore-page-wrapper">
      <div className="app-container">
        {/* Explore Hero & Search */}
        <div className="explore-hero">
          <div className="hero-pill">
            <Compass size={16} />
            <span>Universal Discovery</span>
          </div>
          <h1>Explore the Network</h1>
          <p>
            Find exceptional engineers, designers, topic channels, open-source projects, and verified company culture insights.
          </p>

          <div className="explore-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across people, projects, communities, companies..."
              className="input search-input"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="explore-tabs-bar">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Destinations
          </button>
          <button 
            onClick={() => setActiveTab('people')} 
            className={`tab-btn ${activeTab === 'people' ? 'active' : ''}`}
          >
            <Users size={15} />
            <span>Professionals</span>
          </button>
          <button 
            onClick={() => setActiveTab('projects')} 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <Rocket size={15} />
            <span>Projects & Code</span>
          </button>
          <button 
            onClick={() => setActiveTab('communities')} 
            className={`tab-btn ${activeTab === 'communities' ? 'active' : ''}`}
          >
            <Users size={15} />
            <span>Communities</span>
          </button>
          <button 
            onClick={() => setActiveTab('companies')} 
            className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          >
            <Building2 size={15} />
            <span>Anonymous Workplace Intelligence</span>
          </button>
        </div>

        {/* Section 1: Featured Professionals */}
        {(activeTab === 'all' || activeTab === 'people') && (
          <section className="explore-section">
            <div className="section-header-row">
              <div className="section-title-group">
                <Users size={18} className="text-primary" />
                <h2>Suggested Professionals</h2>
              </div>
            </div>

            <div className="professionals-grid">
              {FEATURED_PROFESSIONALS.map((prof) => {
                const isFollowing = followedIds.includes(prof.id);
                return (
                  <div key={prof.id} className="card professional-card">
                    <img src={prof.avatar} alt={prof.display_name} className="prof-avatar" />
                    <Link href={`/profile/${prof.username}`} className="prof-name">
                      {prof.display_name}
                    </Link>
                    <span className="prof-username">@{prof.username}</span>
                    <span className="prof-domain">{prof.domain}</span>
                    <p className="prof-headline">{prof.headline}</p>

                    <button
                      onClick={() => handleToggleFollow(prof.id)}
                      className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-outline'} prof-follow-btn`}
                    >
                      {isFollowing ? (
                        <>
                          <Check size={14} />
                          <span>Following</span>
                        </>
                      ) : (
                        <span>+ Follow</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 2: Projects & Achievements */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className="explore-section">
            <div className="section-header-row">
              <div className="section-title-group">
                <Rocket size={18} className="text-story" />
                <h2>Trending Projects & RFCs</h2>
              </div>
            </div>

            <div className="projects-grid">
              {projectPosts.map((post) => (
                <div key={post.id} className="card project-card">
                  <div className="proj-card-top">
                    <img src={post.author_avatar} alt="" className="proj-author-avatar" />
                    <div>
                      <span className="proj-author-name">{post.author_name}</span>
                      <span className="proj-domain-tag">{post.author_domain}</span>
                    </div>
                  </div>

                  <h3 className="proj-title">{post.project_title || 'Engineering Architecture Milestone'}</h3>
                  <p className="proj-snippet">{post.content.slice(0, 140)}...</p>

                  <div className="proj-card-footer">
                    <Link href={`/feed?post=${post.id}`} className="proj-link">
                      <span>View in Feed</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Topic Communities */}
        {(activeTab === 'all' || activeTab === 'communities') && (
          <section className="explore-section">
            <div className="section-header-row">
              <div className="section-title-group">
                <Users size={18} className="text-primary" />
                <h2>Active Technical Communities</h2>
              </div>
              <Link href="/communities" className="section-see-all">
                View all ({communities.length}) &rarr;
              </Link>
            </div>

            <div className="communities-compact-grid">
              {communities.slice(0, 3).map((comm) => (
                <Link key={comm.id} href={`/communities/${comm.slug}`} className="card comm-compact-card">
                  <div className="comm-compact-icon">
                    <Users size={20} color="#FFF" />
                  </div>
                  <div className="comm-compact-info">
                    <h4>{comm.name}</h4>
                    <span className="comm-compact-sub">
                      {comm.members_count.toLocaleString()} members &bull; {comm.domain}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Anonymous Workplace Intelligence */}
        {(activeTab === 'all' || activeTab === 'companies') && (
          <section className="explore-section">
            <div className="section-header-row">
              <div className="section-title-group">
                <Building2 size={18} className="text-purple" />
                <h2>Anonymous Workplace Intelligence & Culture Signals</h2>
              </div>
              <Link href="/companies" className="section-see-all">
                All Signals &rarr;
              </Link>
            </div>

            <div className="companies-compact-grid">
              {companies.map((comp) => (
                <Link key={comp.id} href={`/companies/${comp.slug}`} className="card comp-compact-card">
                  <img src={comp.logo_url} alt="" className="comp-compact-logo" />
                  <div className="comp-compact-info">
                    <div className="comp-compact-row">
                      <h4>{comp.name}</h4>
                      <div className="score-badge">
                        <Star size={12} fill="currentColor" />
                        <span>{comp.overall_rating}</span>
                      </div>
                    </div>
                    <span className="comp-compact-ind">{comp.industry}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .explore-page-wrapper {
          padding: 2.5rem 0 5rem;
        }

        .explore-hero {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 2.5rem;
        }

        .hero-pill {
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

        .explore-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .explore-hero p {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .explore-search-box {
          position: relative;
          max-width: 500px;
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

        /* Tabs Bar */
        .explore-tabs-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--brand-primary);
          border-color: var(--brand-primary);
        }

        .tab-btn.active {
          background: var(--brand-primary);
          color: #FFF;
          border-color: var(--brand-primary);
        }

        /* Sections */
        .explore-section {
          margin-bottom: 3rem;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .section-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-title-group h2 {
          font-size: 1.35rem;
        }

        .section-see-all {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand-primary);
        }

        /* Professionals Grid */
        .professionals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .professional-card {
          padding: 1.5rem;
          background: var(--surface-card);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .prof-avatar {
          width: 68px;
          height: 68px;
          border-radius: var(--radius-full);
          object-fit: cover;
          margin-bottom: 0.75rem;
        }

        .prof-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .prof-name:hover {
          color: var(--brand-primary);
        }

        .prof-username {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
        }

        .prof-domain {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand-primary);
          background: var(--brand-primary-light);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
        }

        .prof-headline {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .prof-follow-btn {
          width: 100%;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.25rem;
        }

        .project-card {
          padding: 1.25rem;
          background: var(--surface-card);
          display: flex;
          flex-direction: column;
        }

        .proj-card-top {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
        }

        .proj-author-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .proj-author-name {
          font-size: 0.8125rem;
          font-weight: 700;
          display: block;
        }

        .proj-domain-tag {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .proj-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .proj-snippet {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
          flex: 1;
        }

        .proj-card-footer {
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .proj-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--brand-primary);
        }

        /* Compact Communities & Companies */
        .communities-compact-grid, .companies-compact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }

        .comm-compact-card, .comp-compact-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1rem;
          background: var(--surface-card);
          transition: transform var(--transition-fast);
        }

        .comm-compact-card:hover, .comp-compact-card:hover {
          transform: translateY(-2px);
        }

        .comm-compact-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--brand-deep-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .comm-compact-info h4, .comp-compact-info h4 {
          font-size: 0.95rem;
          margin-bottom: 0.15rem;
        }

        .comm-compact-sub, .comp-compact-ind {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .comp-compact-logo {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          object-fit: cover;
          flex-shrink: 0;
        }

        .comp-compact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #D97706;
          margin-left: 0.5rem;
        }

        .text-story { color: #DD2A7B; }
        .text-purple { color: #9333EA; }
      `}</style>
    </div>
  );
}
