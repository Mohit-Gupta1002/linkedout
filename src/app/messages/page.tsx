'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Send, Shield, Search, Check, CheckCheck, 
  ArrowLeft, MessageSquare, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { Conversation, DirectMessage, UserProfile } from '@/types';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get('c');

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = StorageEngine.getUser();
    setCurrentUser(user);

    const convList = StorageEngine.getConversations();
    setConversations(convList);

    const targetId = initialConvId || (convList.length > 0 ? convList[0].id : '');
    if (targetId) {
      setActiveConvId(targetId);
      loadMessages(targetId);
      StorageEngine.markConversationRead(targetId);
    }
  }, [initialConvId]);

  const loadMessages = (convId: string) => {
    const list = StorageEngine.getMessages(convId);
    setMessages(list);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    loadMessages(convId);
    StorageEngine.markConversationRead(convId);
    setConversations(StorageEngine.getConversations());
  };

  const activeConversation = conversations.find(c => c.id === activeConvId);

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || newMessageText).trim();
    if (!content || !activeConversation || !currentUser) return;

    const newMsg = StorageEngine.sendMessage(
      activeConversation.id,
      activeConversation.participant.id,
      content
    );

    setMessages(prev => [...prev, newMsg]);
    setNewMessageText('');
    setConversations(StorageEngine.getConversations());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    'Thanks for sharing!',
    'Could you share the GitHub repo link?',
    'Let me review and get back to you shortly.',
    'Agreed on that architecture choice!'
  ];

  const filteredConversations = conversations.filter(c => 
    c.participant.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.participant.domain.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.last_message.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="messages-page-wrapper">
      <div className="app-container messages-layout-container">
        
        {/* Left Pane: Conversations List */}
        <aside className="conv-sidebar">
          <div className="conv-sidebar-header">
            <div className="conv-title-row">
              <h2 className="conv-title">Messages</h2>
              <span className="conv-count-badge">{conversations.length}</span>
            </div>
            <div className="conv-search-box">
              <Search size={15} className="conv-search-icon" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="conv-search-input"
              />
            </div>
          </div>

          <div className="conv-list">
            {filteredConversations.length === 0 ? (
              <div className="conv-empty">
                <MessageSquare size={32} className="text-muted mb-2" />
                <p className="text-sm text-secondary">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isActive = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`conv-item-btn ${isActive ? 'active' : ''}`}
                  >
                    <div className="conv-avatar-wrapper">
                      <img 
                        src={conv.participant.avatar} 
                        alt={conv.participant.name} 
                        className="conv-avatar" 
                      />
                      {conv.participant.is_online && <span className="online-status-dot" />}
                    </div>

                    <div className="conv-details">
                      <div className="conv-header-row">
                        <span className="conv-name">{conv.participant.name}</span>
                        <span className="conv-time">
                          {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="conv-preview-row">
                        <span className="conv-last-msg">{conv.last_message}</span>
                        {conv.unread_count > 0 && (
                          <span className="conv-unread-pill">{conv.unread_count}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane: Active Thread */}
        <main className="conv-main-chat">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-user">
                  <div className="conv-avatar-wrapper">
                    <img 
                      src={activeConversation.participant.avatar} 
                      alt="" 
                      className="chat-avatar" 
                    />
                    {activeConversation.participant.is_online && <span className="online-status-dot" />}
                  </div>
                  <div>
                    <div className="chat-name-row">
                      <h3 className="chat-name">{activeConversation.participant.name}</h3>
                      <span className="badge badge-primary text-xs">{activeConversation.participant.domain}</span>
                    </div>
                    <p className="chat-headline">{activeConversation.participant.headline}</p>
                  </div>
                </div>

                <div className="chat-header-actions">
                  <Link 
                    href={`/profile/${activeConversation.participant.username}`} 
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Profile</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>

              {/* Safety & Respect Alert */}
              {showSafetyBanner && (
                <div className="chat-safety-banner">
                  <Shield size={16} className="safety-icon" />
                  <div className="safety-text">
                    <strong>Respectful Professional Workplace Messaging:</strong> Never share passwords, bank accounts, or sensitive private credentials. Minor accounts have protected communication boundaries.
                  </div>
                  <button 
                    onClick={() => setShowSafetyBanner(false)} 
                    className="safety-close-btn"
                    title="Dismiss"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Message Feed Area */}
              <div className="chat-message-feed">
                {messages.map((msg, index) => {
                  const isMine = msg.sender_id === currentUser?.id;
                  const timeFormatted = new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });

                  return (
                    <div key={msg.id || index} className={`chat-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                      {!isMine && (
                        <img 
                          src={msg.sender_avatar} 
                          alt="" 
                          className="bubble-avatar" 
                        />
                      )}
                      <div className="bubble-content-box">
                        <div className="bubble-text">{msg.content}</div>
                        <div className="bubble-meta">
                          <span className="bubble-time">{timeFormatted}</span>
                          {isMine && (
                            <span className="bubble-status">
                              <CheckCheck size={13} className="text-brand" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="chat-quick-replies">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(qr)}
                    className="quick-reply-chip"
                  >
                    <Sparkles size={12} className="qr-sparkle" />
                    <span>{qr}</span>
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="chat-input-bar">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activeConversation.participant.name}...`}
                  className="chat-text-input"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!newMessageText.trim()}
                  className="btn btn-primary btn-sm chat-send-btn"
                  title="Send message"
                >
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageSquare size={48} className="text-muted mb-3" />
              <h3>Select a Conversation</h3>
              <p className="text-secondary text-sm">Choose a peer from the left list to begin chatting.</p>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .messages-page-wrapper {
          min-height: calc(100vh - 120px);
          padding: 1.5rem 0;
          background: var(--bg-canvas);
        }

        .messages-layout-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.25rem;
          height: calc(100vh - 150px);
          min-height: 580px;
        }

        /* Sidebar */
        .conv-sidebar {
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .conv-sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .conv-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .conv-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .conv-count-badge {
          background: var(--surface-hover);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .conv-search-box {
          position: relative;
        }

        .conv-search-icon {
          position: absolute;
          left: 0.65rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .conv-search-input {
          width: 100%;
          padding: 0.45rem 0.65rem 0.45rem 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          background: var(--surface-hover);
          color: var(--text-primary);
          font-size: 0.8125rem;
        }

        .conv-search-input:focus {
          outline: none;
          border-color: var(--brand-primary);
          background: var(--surface-card);
        }

        .conv-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .conv-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }

        .conv-item-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          border-bottom: 1px solid var(--border-subtle);
          transition: background var(--transition-fast);
          width: 100%;
        }

        .conv-item-btn:hover {
          background: var(--surface-hover);
        }

        .conv-item-btn.active {
          background: var(--brand-primary-light);
          border-left: 3px solid var(--brand-primary);
        }

        .conv-avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .conv-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .online-status-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 10px;
          height: 10px;
          background: #10B981;
          border: 2px solid var(--surface-card);
          border-radius: var(--radius-full);
        }

        .conv-details {
          flex: 1;
          min-width: 0;
        }

        .conv-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.2rem;
        }

        .conv-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conv-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .conv-preview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .conv-last-msg {
          font-size: 0.775rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conv-unread-pill {
          background: var(--brand-primary);
          color: #FFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        /* Main Chat */
        .conv-main-chat {
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--surface-card);
        }

        .chat-header-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .chat-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chat-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chat-headline {
          font-size: 0.775rem;
          color: var(--text-secondary);
          max-width: 450px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-safety-banner {
          background: #FEF3C7;
          border-bottom: 1px solid #FDE68A;
          color: #92400E;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        [data-theme="dark"] .chat-safety-banner {
          background: rgba(245, 158, 11, 0.15);
          border-bottom-color: rgba(245, 158, 11, 0.3);
          color: #FCD34D;
        }

        .safety-icon {
          flex-shrink: 0;
        }

        .safety-text {
          flex: 1;
        }

        .safety-close-btn {
          background: none;
          border: none;
          font-size: 1.15rem;
          cursor: pointer;
          color: inherit;
          line-height: 1;
        }

        /* Feed */
        .chat-message-feed {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .chat-bubble-row {
          display: flex;
          gap: 0.5rem;
          max-width: 75%;
        }

        .chat-bubble-row.theirs {
          align-self: flex-start;
        }

        .chat-bubble-row.mine {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .bubble-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-fit: cover;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .bubble-content-box {
          padding: 0.65rem 0.95rem;
          border-radius: 14px;
          font-size: 0.875rem;
          line-height: 1.45;
          position: relative;
        }

        .chat-bubble-row.theirs .bubble-content-box {
          background: var(--surface-hover);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          border-top-left-radius: 3px;
        }

        .chat-bubble-row.mine .bubble-content-box {
          background: var(--brand-primary);
          color: #FFFFFF;
          border-top-right-radius: 3px;
        }

        .bubble-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
          margin-top: 0.25rem;
          font-size: 0.65rem;
          opacity: 0.75;
        }

        /* Quick Replies */
        .chat-quick-replies {
          display: flex;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: var(--surface-card);
          border-top: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .quick-reply-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .quick-reply-chip:hover {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          border-color: var(--brand-primary);
        }

        .qr-sparkle {
          color: var(--brand-primary);
        }

        /* Input Bar */
        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--surface-card);
        }

        .chat-text-input {
          flex: 1;
          padding: 0.65rem 0.95rem;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-subtle);
          background: var(--surface-hover);
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .chat-text-input:focus {
          outline: none;
          border-color: var(--brand-primary);
          background: var(--surface-card);
        }

        .chat-send-btn {
          padding: 0.65rem 1.15rem;
        }

        .no-chat-selected {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .messages-layout-container {
            grid-template-columns: 1fr;
          }

          .conv-sidebar {
            display: ${activeConvId ? 'none' : 'flex'};
          }

          .conv-main-chat {
            display: ${activeConvId ? 'flex' : 'none'};
          }
        }
      `}</style>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="app-loading">Loading conversations...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
