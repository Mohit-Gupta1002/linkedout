'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Trash2, Heart, Sparkles, Clock } from 'lucide-react';
import { Story, UserProfile } from '@/types';
import { StorageEngine } from '@/lib/storage';

interface StoryViewerProps {
  stories: Story[];
  initialStoryId: string;
  currentUser: UserProfile | null;
  onClose: () => void;
  onStoryDeleted?: () => void;
}

export default function StoryViewer({
  stories,
  initialStoryId,
  currentUser,
  onClose,
  onStoryDeleted
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = stories.findIndex(s => s.id === initialStoryId);
    return idx !== -1 ? idx : 0;
  });

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reactionSent, setReactionSent] = useState<string | null>(null);

  const currentStory = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Mark story as seen
  useEffect(() => {
    if (currentStory) {
      StorageEngine.markStorySeen(currentStory.id);
    }
  }, [currentStory]);

  // Auto-progress timer (5 seconds per story)
  useEffect(() => {
    if (isPaused || !currentStory) return;

    const interval = 50; // update every 50ms
    const totalDuration = 5000;
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, handleNext, currentStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  if (!currentStory) return null;

  const hoursRemaining = Math.max(
    1,
    Math.round((new Date(currentStory.expires_at).getTime() - Date.now()) / (3600 * 1000))
  );

  const isMyStory = currentUser && currentStory.author_id === currentUser.id;

  const handleDelete = () => {
    StorageEngine.deleteStory(currentStory.id);
    if (onStoryDeleted) onStoryDeleted();
    if (stories.length <= 1) {
      onClose();
    } else {
      handleNext();
    }
  };

  const handleReaction = (emoji: string) => {
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(null), 1500);
  };

  return (
    <div className="story-viewer-overlay">
      <div 
        className="story-viewer-card"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars for each story */}
        <div className="story-progress-row">
          {stories.map((story, idx) => (
            <div key={story.id} className="story-progress-track">
              <div 
                className="story-progress-bar"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className="story-header">
          <div className="story-author-info">
            <img src={currentStory.author_avatar} alt="" className="story-author-avatar" />
            <div>
              <div className="story-author-name">{currentStory.author_name}</div>
              <div className="story-time-badge">
                <Clock size={11} />
                <span>{hoursRemaining}h left</span>
              </div>
            </div>
          </div>

          <div className="story-header-actions">
            {isMyStory && (
              <button onClick={handleDelete} className="story-action-btn" title="Delete your story">
                <Trash2 size={18} />
              </button>
            )}
            <button onClick={onClose} className="story-action-btn" title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Story Content Body */}
        <div className="story-body">
          {/* Navigation Click Hotspots */}
          <div className="story-nav-hotspot left" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
          <div className="story-nav-hotspot right" onClick={(e) => { e.stopPropagation(); handleNext(); }} />

          {currentStory.media_type === 'image' && currentStory.media_url ? (
            <div className="story-image-wrapper">
              <img src={currentStory.media_url} alt="" className="story-media-image" />
            </div>
          ) : (
            <div 
              className="story-gradient-card"
              style={{ background: currentStory.bg_gradient || 'var(--story-gradient)' }}
            >
              <div className="story-gradient-text">
                {currentStory.text_content || 'Working on something exciting at LinkedOut!'}
              </div>
            </div>
          )}

          {/* Optional Caption Overlay */}
          {currentStory.caption && (
            <div className="story-caption-overlay">
              <p>{currentStory.caption}</p>
            </div>
          )}

          {/* Reaction Floating Toast */}
          {reactionSent && (
            <div className="reaction-floating-toast animate-scale-up">
              <span>{reactionSent}</span>
            </div>
          )}
        </div>

        {/* Story Bottom Quick Reaction Bar */}
        <div className="story-footer">
          <div className="quick-reaction-pills">
            {['❤️', '🔥', '👏', '🚀', '💡'].map(emoji => (
              <button 
                key={emoji}
                onClick={() => handleReaction(emoji)} 
                className="reaction-pill-btn"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Prev/Next Floating Buttons */}
      {currentIndex > 0 && (
        <button onClick={handlePrev} className="floating-nav-btn prev">
          <ChevronLeft size={24} />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button onClick={handleNext} className="floating-nav-btn next">
          <ChevronRight size={24} />
        </button>
      )}

      <style jsx>{`
        .story-viewer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 10, 18, 0.92);
          backdrop-filter: blur(12px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .story-viewer-card {
          width: 100%;
          max-width: 440px;
          height: 85vh;
          max-height: 820px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: #000;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .story-progress-row {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          gap: 4px;
          z-index: 30;
        }

        .story-progress-track {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .story-progress-bar {
          height: 100%;
          background: #FFF;
          transition: width 50ms linear;
        }

        .story-header {
          position: absolute;
          top: 24px;
          left: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 30;
        }

        .story-author-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .story-author-avatar {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          border: 2px solid #FFF;
          object-fit: cover;
        }

        .story-author-name {
          color: #FFF;
          font-weight: 700;
          font-size: 0.9rem;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        }

        .story-time-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.75rem;
        }

        .story-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .story-action-btn {
          color: #FFF;
          background: rgba(0, 0, 0, 0.4);
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }

        .story-action-btn:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        .story-body {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .story-nav-hotspot {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 35%;
          z-index: 20;
          cursor: pointer;
        }

        .story-nav-hotspot.left { left: 0; }
        .story-nav-hotspot.right { right: 0; }

        .story-image-wrapper {
          width: 100%;
          height: 100%;
        }

        .story-media-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .story-gradient-card {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          text-align: center;
        }

        .story-gradient-text {
          color: #FFF;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.4;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }

        .story-caption-overlay {
          position: absolute;
          bottom: 70px;
          left: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: #FFF;
          font-size: 0.875rem;
          z-index: 25;
        }

        .reaction-floating-toast {
          position: absolute;
          font-size: 3.5rem;
          pointer-events: none;
          z-index: 40;
          animation: floatUp 1s ease-out forwards;
        }

        @keyframes floatUp {
          0% { transform: scale(0.5) translateY(20px); opacity: 0; }
          40% { transform: scale(1.2) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(-60px); opacity: 0; }
        }

        .story-footer {
          position: absolute;
          bottom: 12px;
          left: 16px;
          right: 16px;
          z-index: 30;
          display: flex;
          justify-content: center;
        }

        .quick-reaction-pills {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .reaction-pill-btn {
          font-size: 1.25rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 150ms ease;
        }

        .reaction-pill-btn:hover {
          transform: scale(1.3);
        }

        .floating-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.15);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: background var(--transition-fast);
        }

        .floating-nav-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .floating-nav-btn.prev {
          left: 2rem;
        }

        .floating-nav-btn.next {
          right: 2rem;
        }

        @media (max-width: 768px) {
          .floating-nav-btn {
            display: none;
          }
          .story-viewer-card {
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
