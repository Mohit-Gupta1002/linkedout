'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Story, UserProfile } from '@/types';

interface StoryRailProps {
  stories: Story[];
  currentUser: UserProfile | null;
  onOpenStory: (storyId: string) => void;
  onOpenCreateStory: () => void;
}

export default function StoryRail({
  stories,
  currentUser,
  onOpenStory,
  onOpenCreateStory
}: StoryRailProps) {
  // Check if current user already has an active story
  const myStory = currentUser ? stories.find(s => s.author_id === currentUser.id) : null;

  return (
    <div className="card story-rail-card">
      <div className="story-rail-scroll">
        {/* User's "Add Story" or "Your Story" button */}
        <div className="story-item" onClick={myStory ? () => onOpenStory(myStory.id) : onOpenCreateStory}>
          <div className={`story-avatar-container ${myStory ? (myStory.seen ? 'seen' : 'unseen') : 'add-story'}`}>
            <img 
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt="Your story" 
              className="story-avatar-img"
            />
            {!myStory && (
              <div className="add-story-badge">
                <Plus size={14} strokeWidth={3} />
              </div>
            )}
          </div>
          <span className="story-author-name">
            {myStory ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* Stories from professionals */}
        {stories
          .filter(s => s.author_id !== currentUser?.id)
          .map((story) => (
            <button
              key={story.id}
              onClick={() => onOpenStory(story.id)}
              className="story-item"
              aria-label={`View story by ${story.author_name}`}
            >
              <div className={`story-avatar-container ${story.seen ? 'seen' : 'unseen'}`}>
                <img 
                  src={story.author_avatar} 
                  alt={story.author_name} 
                  className="story-avatar-img"
                />
              </div>
              <span className="story-author-name">
                {story.author_name.split(' ')[0]}
              </span>
            </button>
          ))}
      </div>

      <style jsx>{`
        .story-rail-card {
          padding: 1rem 0.75rem;
          margin-bottom: 1.25rem;
          background: var(--surface-card);
        }

        .story-rail-scroll {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.25rem 0.5rem;
        }

        .story-rail-scroll::-webkit-scrollbar {
          display: none;
        }

        .story-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          flex-shrink: 0;
          background: transparent;
          border: none;
          padding: 0;
          width: 72px;
        }

        .story-avatar-container {
          position: relative;
          width: 62px;
          height: 62px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5px;
          transition: transform var(--transition-fast);
        }

        .story-item:hover .story-avatar-container {
          transform: scale(1.05);
        }

        .story-avatar-container.unseen {
          background: var(--story-gradient);
        }

        .story-avatar-container.seen {
          background: var(--border-strong);
        }

        .story-avatar-container.add-story {
          background: transparent;
          border: 1.5px dashed var(--brand-primary);
        }

        .story-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          border: 2px solid var(--surface-card);
          object-fit: cover;
        }

        .add-story-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: var(--brand-primary);
          color: #FFF;
          width: 22px;
          height: 22px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--surface-card);
        }

        .story-author-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-primary);
          max-width: 68px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
