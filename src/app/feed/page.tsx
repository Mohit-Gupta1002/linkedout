'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, Filter, Rocket, MessageSquare, 
  Image as ImageIcon, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { Post, Story, Community, Company, UserProfile } from '@/types';
import { StorageEngine } from '@/lib/storage';
import StoryRail from '@/components/StoryRail';
import StoryViewer from '@/components/StoryViewer';
import StoryCreator from '@/components/StoryCreator';
import PostComposer from '@/components/PostComposer';
import PostCard from '@/components/PostCard';
import FeedSidebarLeft from '@/components/FeedSidebarLeft';
import FeedSidebarRight from '@/components/FeedSidebarRight';

type FeedFilterType = 'all' | 'project' | 'image' | 'discussion';

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="app-container" style={{ padding: '2rem 1rem' }}>Loading feed...</div>}>
      <FeedContent />
    </Suspense>
  );
}

function FeedContent() {
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Story Viewer & Creator Modals
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  // Feed Filter
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>('all');

  useEffect(() => {
    // Initial data hydration
    const user = StorageEngine.getUser();
    setCurrentUser(user);
    setPosts(StorageEngine.getPosts());
    setStories(StorageEngine.getStories());
    setCommunities(StorageEngine.getCommunities());
    setCompanies(StorageEngine.getCompanies());

    // Check if query param requests create action
    if (searchParams.get('action') === 'create') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }, [searchParams]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleStoryCreated = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
  };

  const handleStoryDeleted = () => {
    setStories(StorageEngine.getStories());
  };

  const handleCommunityToggled = (updatedComm: Community) => {
    setCommunities(prev => prev.map(c => c.id === updatedComm.id ? updatedComm : c));
  };

  // Filter posts based on tab
  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'project') return post.post_type === 'project';
    if (activeFilter === 'image') return post.post_type === 'image' || (post.media_urls && post.media_urls.length > 0);
    if (activeFilter === 'discussion') return post.is_pseudonymous || post.post_type === 'discussion';
    return true;
  });

  return (
    <div className="feed-page-wrapper">
      <div className="app-container main-content-layout">
        {/* Left Sidebar */}
        <FeedSidebarLeft 
          user={currentUser} 
          communities={communities} 
        />

        {/* Center Main Feed */}
        <main className="main-feed-column">
          {/* 1. Horizontal Stories Rail */}
          <StoryRail
            stories={stories}
            currentUser={currentUser}
            onOpenStory={(id) => setActiveStoryId(id)}
            onOpenCreateStory={() => setIsCreatingStory(true)}
          />

          {/* 2. Interactive Post Composer */}
          {currentUser && (
            <PostComposer
              currentUser={currentUser}
              communities={communities}
              onPostCreated={handlePostCreated}
            />
          )}

          {/* 3. Feed Filters */}
          <div className="feed-filters-bar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`feed-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            >
              All Updates
            </button>
            <button
              onClick={() => setActiveFilter('project')}
              className={`feed-filter-btn ${activeFilter === 'project' ? 'active' : ''}`}
            >
              <Rocket size={14} />
              <span>Projects & Code</span>
            </button>
            <button
              onClick={() => setActiveFilter('image')}
              className={`feed-filter-btn ${activeFilter === 'image' ? 'active' : ''}`}
            >
              <ImageIcon size={14} />
              <span>Visual Media</span>
            </button>
            <button
              onClick={() => setActiveFilter('discussion')}
              className={`feed-filter-btn ${activeFilter === 'discussion' ? 'active' : ''}`}
            >
              <MessageSquare size={14} />
              <span>Pseudonymous Intel</span>
            </button>
          </div>

          {/* 4. Posts List */}
          <div className="posts-stream">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                />
              ))
            ) : (
              <div className="card empty-feed-card">
                <Sparkles size={32} className="empty-icon" />
                <h3>No updates in this category yet</h3>
                <p>Be the first to share an engineering milestone or project showcase!</p>
                <button onClick={() => setActiveFilter('all')} className="btn btn-secondary btn-sm mt-3">
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <FeedSidebarRight
          communities={communities}
          companies={companies}
          onCommunityToggled={handleCommunityToggled}
        />
      </div>

      {/* Story Viewer Modal */}
      {activeStoryId && (
        <StoryViewer
          stories={stories}
          initialStoryId={activeStoryId}
          currentUser={currentUser}
          onClose={() => setActiveStoryId(null)}
          onStoryDeleted={handleStoryDeleted}
        />
      )}

      {/* Story Creator Modal */}
      {isCreatingStory && (
        <StoryCreator
          onClose={() => setIsCreatingStory(false)}
          onStoryCreated={handleStoryCreated}
        />
      )}

      <style jsx>{`
        .feed-page-wrapper {
          min-height: calc(100vh - var(--nav-height));
        }

        .main-feed-column {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .feed-filters-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 0.25rem;
        }

        .feed-filters-bar::-webkit-scrollbar {
          display: none;
        }

        .feed-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-full);
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .feed-filter-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }

        .feed-filter-btn.active {
          background: var(--brand-primary);
          color: #FFF;
          border-color: var(--brand-primary);
        }

        .posts-stream {
          display: flex;
          flex-direction: column;
        }

        .empty-feed-card {
          padding: 3rem 1.5rem;
          text-align: center;
          background: var(--surface-card);
        }

        .empty-icon {
          color: var(--brand-primary);
          margin: 0 auto 0.75rem;
        }

        .empty-feed-card h3 {
          font-size: 1.15rem;
          margin-bottom: 0.35rem;
        }

        .empty-feed-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
