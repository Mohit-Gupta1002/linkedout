'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Compass, Users, Building2, Bell, PlusCircle, 
  Search, Moon, Sun, Shield, LogOut, Check, X, Sparkles, MessageSquare, Settings
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { UserProfile, Company, Community, Post } from '@/types';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Search Results
  const [searchResults, setSearchResults] = useState<{
    communities: Community[];
    companies: Company[];
    posts: Post[];
  }>({ communities: [], companies: [], posts: [] });

  useEffect(() => {
    // Load User & Theme
    const currentUser = StorageEngine.getUser();
    setUser(currentUser);
    setUnreadCount(StorageEngine.getUnreadNotificationsCount());
    setUnreadMessagesCount(StorageEngine.getUnreadMessagesCount());

    const savedTheme = (localStorage.getItem('linkedout_theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('linkedout_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ communities: [], companies: [], posts: [] });
      return;
    }
    const q = query.toLowerCase();
    const comms = StorageEngine.getCommunities().filter(c => 
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
    const comps = StorageEngine.getCompanies().filter(c => 
      c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)
    );
    const psts = StorageEngine.getPosts().filter(p => 
      p.content.toLowerCase().includes(q) || p.author_name.toLowerCase().includes(q)
    );
    setSearchResults({ communities: comms, companies: comps, posts: psts });
  };

  // Do not show full nav on landing page or auth/onboarding pages if user preferred
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return (
      <header className="auth-header">
        <div className="app-container auth-header-inner">
          <Link href="/" className="logo-link">
            <span className="logo-text">Linked<span className="logo-accent">Out</span></span>
          </Link>
          <div className="auth-header-actions">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link href="/feed" className="btn btn-secondary btn-sm">
              Explore as Guest
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Top Desktop Navigation */}
      <header className="navbar">
        <div className="app-container navbar-inner">
          <div className="navbar-left">
            <Link href={user ? '/feed' : '/'} className="logo-link">
              <span className="logo-badge">LO</span>
              <span className="logo-text">Linked<span className="logo-accent">Out</span></span>
            </Link>

            {/* Global Search Bar */}
            <div className="search-container">
              <Search size={17} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search professionals, companies, communities..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} className="search-clear">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="navbar-nav">
            <Link href="/feed" className={`nav-item ${pathname === '/feed' ? 'active' : ''}`}>
              <Home size={20} />
              <span className="nav-label">Home</span>
            </Link>
            <Link href="/explore" className={`nav-item ${pathname === '/explore' ? 'active' : ''}`}>
              <Compass size={20} />
              <span className="nav-label">Explore</span>
            </Link>
            <Link href="/communities" className={`nav-item ${pathname.startsWith('/communities') ? 'active' : ''}`}>
              <Users size={20} />
              <span className="nav-label">Communities</span>
            </Link>
            <Link href="/companies" className={`nav-item ${pathname.startsWith('/companies') ? 'active' : ''}`}>
              <Building2 size={20} />
              <span className="nav-label">Companies</span>
            </Link>
            <Link href="/messages" className={`nav-item ${pathname.startsWith('/messages') ? 'active' : ''}`}>
              <div className="icon-badge-wrapper">
                <MessageSquare size={20} />
                {unreadMessagesCount > 0 && <span className="nav-unread-dot">{unreadMessagesCount}</span>}
              </div>
              <span className="nav-label">Messages</span>
            </Link>
            <Link href="/notifications" className={`nav-item ${pathname === '/notifications' ? 'active' : ''}`}>
              <div className="icon-badge-wrapper">
                <Bell size={20} />
                {unreadCount > 0 && <span className="nav-unread-dot">{unreadCount}</span>}
              </div>
              <span className="nav-label">Notifications</span>
            </Link>
          </nav>

          {/* Nav Right (Create Button + Theme + Profile) */}
          <div className="navbar-right">
            <Link href="/feed?action=create" className="btn btn-story btn-sm create-btn">
              <PlusCircle size={17} />
              <span>Create</span>
            </Link>

            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="profile-menu-container">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="profile-avatar-btn"
                  aria-label="User menu"
                >
                  <img src={user.avatar_url} alt={user.display_name} className="nav-avatar" />
                </button>

                {isProfileMenuOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="dropdown-user-header">
                      <img src={user.avatar_url} alt="" className="dropdown-avatar" />
                      <div className="dropdown-user-info">
                        <strong>{user.display_name}</strong>
                        <span>@{user.username}</span>
                        <div className="pseudonym-pill">
                          <Shield size={12} />
                          <span>Pseudo: @{user.pseudonym_username || 'anonymous'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link 
                      href={`/profile/${user.username}`} 
                      className="dropdown-item" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      View Public Profile
                    </Link>
                    <Link 
                      href="/my-communities" 
                      className="dropdown-item" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      My Communities
                    </Link>
                    <Link 
                      href="/messages" 
                      className="dropdown-item" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Direct Messages {unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}
                    </Link>
                    <Link 
                      href="/share-experience" 
                      className="dropdown-item" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Submit Company Review
                    </Link>
                    <Link 
                      href="/settings" 
                      className="dropdown-item" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Privacy & Settings
                    </Link>
                    <Link 
                      href="/auth/onboarding" 
                      className="dropdown-item" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Edit Preferences & Onboarding
                    </Link>
                    <div className="dropdown-divider" />
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        router.push('/auth/sign-in');
                      }}
                      className="dropdown-item dropdown-logout"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/sign-in" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="search-dropdown-overlay" onClick={() => setIsSearchOpen(false)}>
            <div className="search-dropdown-card" onClick={(e) => e.stopPropagation()}>
              <div className="search-card-header">
                <span>Search results for <strong>&ldquo;{searchQuery}&rdquo;</strong></span>
                <button onClick={() => setIsSearchOpen(false)} className="btn-ghost btn-sm">Close</button>
              </div>

              {/* Communities Match */}
              {searchResults.communities.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Communities</div>
                  {searchResults.communities.slice(0, 3).map(comm => (
                    <Link 
                      key={comm.id} 
                      href={`/communities/${comm.slug}`}
                      className="search-result-row"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="search-res-icon"><Users size={16} /></div>
                      <div>
                        <div className="search-res-name">{comm.name}</div>
                        <div className="search-res-sub">{comm.members_count.toLocaleString()} members &bull; {comm.domain}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Companies Match */}
              {searchResults.companies.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Companies & Culture Insights</div>
                  {searchResults.companies.slice(0, 3).map(comp => (
                    <Link 
                      key={comp.id} 
                      href={`/companies/${comp.slug}`}
                      className="search-result-row"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="search-res-icon"><Building2 size={16} /></div>
                      <div>
                        <div className="search-res-name">{comp.name}</div>
                        <div className="search-res-sub">{comp.industry} &bull; {comp.overall_rating} ★ ({comp.reviews_count} reviews)</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts Match */}
              {searchResults.posts.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Posts & Insights</div>
                  {searchResults.posts.slice(0, 3).map(post => (
                    <Link 
                      key={post.id} 
                      href={`/feed?post=${post.id}`}
                      className="search-result-row"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <img src={post.author_avatar} alt="" className="search-res-avatar" />
                      <div>
                        <div className="search-res-name">{post.author_name}</div>
                        <div className="search-res-sub">{post.content.slice(0, 80)}...</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.communities.length === 0 && searchResults.companies.length === 0 && searchResults.posts.length === 0 && (
                <div className="search-empty-state">
                  No direct matches found. Try searching for skills, company names, or topics like &quot;AI&quot; or &quot;Engineering&quot;.
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link href="/feed" className={`mobile-nav-item ${pathname === '/feed' ? 'active' : ''}`}>
          <Home size={22} />
          <span>Home</span>
        </Link>
        <Link href="/explore" className={`mobile-nav-item ${pathname === '/explore' ? 'active' : ''}`}>
          <Compass size={22} />
          <span>Explore</span>
        </Link>
        <Link href="/feed?action=create" className="mobile-nav-item mobile-nav-create">
          <div className="mobile-create-circle">
            <PlusCircle size={26} />
          </div>
          <span>Create</span>
        </Link>
        <Link href="/communities" className={`mobile-nav-item ${pathname.startsWith('/communities') ? 'active' : ''}`}>
          <Users size={22} />
          <span>Communities</span>
        </Link>
        <Link href={user ? `/profile/${user.username}` : '/auth/sign-in'} className={`mobile-nav-item ${pathname.startsWith('/profile') ? 'active' : ''}`}>
          {user ? (
            <img src={user.avatar_url} alt="" className="mobile-nav-avatar" />
          ) : (
            <Users size={22} />
          )}
          <span>Profile</span>
        </Link>
      </nav>

      {/* Navigation Custom Styling */}
      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 900;
          height: var(--nav-height);
          background: var(--surface-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex: 1;
          max-width: 500px;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--brand-deep-navy);
          letter-spacing: -0.03em;
        }

        [data-theme="dark"] .logo-link {
          color: var(--text-primary);
        }

        .logo-badge {
          background: var(--brand-primary);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-sm);
          line-height: 1;
        }

        .logo-accent {
          color: var(--brand-primary);
        }

        .search-container {
          position: relative;
          width: 100%;
          max-width: 340px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 2rem 0.5rem 2.25rem;
          background: var(--surface-hover);
          border: 1px solid transparent;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .search-input:focus {
          outline: none;
          background: var(--surface-card);
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.12);
        }

        .search-clear {
          position: absolute;
          right: 0.65rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 0.85rem;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 500;
          gap: 0.2rem;
          transition: all var(--transition-fast);
        }

        .nav-item:hover {
          color: var(--brand-primary);
          background: var(--surface-hover);
        }

        .nav-item.active {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .icon-badge-wrapper {
          position: relative;
          display: flex;
        }

        .nav-unread-dot {
          position: absolute;
          top: -4px;
          right: -8px;
          background: var(--error);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background: var(--surface-hover);
          transition: all var(--transition-fast);
        }

        .theme-toggle-btn:hover {
          color: var(--brand-primary);
          background: var(--surface-active);
        }

        .profile-menu-container {
          position: relative;
        }

        .profile-avatar-btn {
          padding: 0;
          display: flex;
        }

        .nav-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 2px solid var(--border-subtle);
          object-fit: cover;
        }

        .profile-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          width: 260px;
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 0.75rem;
          z-index: 1000;
          animation: fadeIn 150ms ease-out;
        }

        .dropdown-user-header {
          display: flex;
          gap: 0.75rem;
          padding-bottom: 0.5rem;
        }

        .dropdown-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .dropdown-user-info {
          display: flex;
          flex-direction: column;
          font-size: 0.8125rem;
        }

        .dropdown-user-info span {
          color: var(--text-muted);
        }

        .pseudonym-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.35rem;
          background: rgba(126, 34, 206, 0.1);
          color: #7E22CE;
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 600;
        }

        [data-theme="dark"] .pseudonym-pill {
          color: #C084FC;
          background: rgba(192, 132, 252, 0.15);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.5rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--text-primary);
          transition: background var(--transition-fast);
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: var(--surface-hover);
        }

        .dropdown-logout {
          color: var(--error);
        }

        /* Search Dropdown */
        .search-dropdown-overlay {
          position: fixed;
          inset: var(--nav-height) 0 0 0;
          background: rgba(10, 15, 24, 0.4);
          z-index: 850;
          display: flex;
          justify-content: center;
          padding-top: 1rem;
        }

        .search-dropdown-card {
          width: 100%;
          max-width: 620px;
          max-height: 80vh;
          overflow-y: auto;
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: 1.25rem;
        }

        .search-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.875rem;
        }

        .search-section {
          margin-top: 1rem;
        }

        .search-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .search-result-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .search-result-row:hover {
          background: var(--surface-hover);
        }

        .search-res-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-res-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .search-res-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .search-res-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .search-empty-state {
          padding: 2rem 1rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--mobile-nav-height);
          background: var(--surface-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-subtle);
          z-index: 900;
          align-items: center;
          justify-content: space-around;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.7rem;
          gap: 0.15rem;
          flex: 1;
        }

        .mobile-nav-item.active {
          color: var(--brand-primary);
        }

        .mobile-create-circle {
          background: var(--story-gradient);
          color: #FFF;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px var(--story-gradient-glow);
          margin-top: -12px;
        }

        .mobile-nav-avatar {
          width: 22px;
          height: 22px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .nav-label {
            display: none;
          }
          .create-btn span {
            display: none;
          }
          .create-btn {
            padding: 0.5rem;
          }
        }

        @media (max-width: 768px) {
          .navbar-nav {
            display: none;
          }
          .search-container {
            max-width: 180px;
          }
          .create-btn {
            display: none;
          }
          .mobile-bottom-nav {
            display: flex;
          }
        }

        /* Auth Header */
        .auth-header {
          height: 64px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--surface-card);
          display: flex;
          align-items: center;
        }

        .auth-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      `}</style>
    </>
  );
}
