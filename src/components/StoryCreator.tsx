'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Type, Sparkles, Check, ArrowRight } from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { Story } from '@/types';

interface StoryCreatorProps {
  onClose: () => void;
  onStoryCreated: (story: Story) => void;
}

const GRADIENTS = [
  { id: 'sunset', label: 'Story Sunset', value: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)' },
  { id: 'navy', label: 'Deep Trust', value: 'linear-gradient(135deg, #102A43 0%, #0A66C2 100%)' },
  { id: 'emerald', label: 'Tech Growth', value: 'linear-gradient(135deg, #059669 0%, #102A43 100%)' },
  { id: 'amethyst', label: 'Frontier AI', value: 'linear-gradient(135deg, #7E22CE 0%, #3B82F6 100%)' }
];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80'
];

export default function StoryCreator({ onClose, onStoryCreated }: StoryCreatorProps) {
  const [mode, setMode] = useState<'gradient' | 'image'>('gradient');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0].value);
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0]);
  const [caption, setCaption] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    setPublishing(true);
    const newStory = StorageEngine.addStory({
      media_type: mode,
      bg_gradient: mode === 'gradient' ? selectedGradient : undefined,
      media_url: mode === 'image' ? imageUrl : undefined,
      text_content: mode === 'gradient' ? (textContent || 'Building the future of professional storytelling.') : undefined,
      caption: caption || undefined
    });

    setTimeout(() => {
      setPublishing(false);
      onStoryCreated(newStory);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content story-creator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="creator-header">
          <div className="creator-title">
            <Sparkles size={20} className="text-story" />
            <h3>Create a 24-Hour Story</h3>
          </div>
          <button onClick={onClose} className="btn-icon sm btn-ghost">
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mode-toggle-group">
          <button 
            type="button" 
            onClick={() => setMode('gradient')}
            className={`mode-btn ${mode === 'gradient' ? 'active' : ''}`}
          >
            <Type size={16} />
            <span>Text & Gradient</span>
          </button>
          <button 
            type="button" 
            onClick={() => setMode('image')}
            className={`mode-btn ${mode === 'image' ? 'active' : ''}`}
          >
            <ImageIcon size={16} />
            <span>Photo Story</span>
          </button>
        </div>

        {/* Story Live Preview Box */}
        <div className="story-preview-container">
          {mode === 'gradient' ? (
            <div className="preview-gradient-card" style={{ background: selectedGradient }}>
              <p className="preview-text">
                {textContent || 'Type your daily highlight, project milestone, or architectural learning...'}
              </p>
            </div>
          ) : (
            <div className="preview-image-card">
              <img src={imageUrl} alt="Story preview" />
            </div>
          )}
        </div>

        {/* Controls based on mode */}
        {mode === 'gradient' ? (
          <div className="creator-controls">
            <div className="form-group">
              <label className="form-label" htmlFor="storyText">Story Text</label>
              <textarea 
                id="storyText"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Share a quick highlight, lesson learned, or hackathon moment..."
                className="textarea sm"
                maxLength={240}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Color Theme</label>
              <div className="gradient-swatches">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGradient(g.value)}
                    className={`gradient-swatch ${selectedGradient === g.value ? 'selected' : ''}`}
                    style={{ background: g.value }}
                    title={g.label}
                  >
                    {selectedGradient === g.value && <Check size={16} color="#FFF" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="creator-controls">
            <div className="form-group">
              <label className="form-label" htmlFor="photoUrl">Photo URL or Select Demo</label>
              <input 
                id="photoUrl"
                type="text" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="input"
              />
              <div className="photo-presets-row">
                {SAMPLE_PHOTO_PRESETS.map((p, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    onClick={() => setImageUrl(p)}
                    className={`preset-thumb ${imageUrl === p ? 'active' : ''}`}
                  >
                    <img src={p} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="caption">Caption (Optional)</label>
              <input 
                id="caption"
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a short caption..."
                className="input"
              />
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="creator-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handlePublish}
            disabled={publishing || (mode === 'gradient' && !textContent.trim())}
            className="btn btn-story"
          >
            {publishing ? 'Publishing...' : 'Share to Stories (24h)'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .story-creator-modal {
          padding: 1.5rem;
          max-width: 480px;
        }

        .creator-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .creator-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .creator-title h3 {
          font-size: 1.15rem;
        }

        .text-story {
          color: #DD2A7B;
        }

        .mode-toggle-group {
          display: flex;
          background: var(--surface-hover);
          padding: 3px;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          gap: 3px;
        }

        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .mode-btn.active {
          background: var(--surface-card);
          color: var(--text-primary);
          box-shadow: var(--shadow-xs);
        }

        .story-preview-container {
          width: 100%;
          height: 240px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 1.25rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-subtle);
        }

        .preview-gradient-card {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          text-align: center;
        }

        .preview-text {
          color: #FFF;
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.4;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
        }

        .preview-image-card {
          width: 100%;
          height: 100%;
        }

        .preview-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .textarea.sm {
          min-height: 70px;
        }

        .gradient-swatches {
          display: flex;
          gap: 0.65rem;
        }

        .gradient-swatch {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 2px solid var(--surface-card);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .gradient-swatch:hover {
          transform: scale(1.1);
        }

        .gradient-swatch.selected {
          box-shadow: 0 0 0 2px var(--brand-primary);
        }

        .photo-presets-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .preset-thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
        }

        .preset-thumb.active {
          border-color: var(--brand-primary);
        }

        .preset-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .creator-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
