'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, CheckCheck, Heart, UserPlus, MessageSquare, 
  Sparkles, Shield, ArrowRight 
} from 'lucide-react';
import { NotificationItem } from '@/types';
import { StorageEngine } from '@/lib/storage';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setNotifications(StorageEngine.getNotifications());
  }, []);

  const handleMarkAsRead = (id: string) => {
    StorageEngine.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = () => {
    StorageEngine.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="notif-icon-like" fill="currentColor" />;
      case 'follow':
        return <UserPlus size={16} className="notif-icon-follow" />;
      case 'comment':
        return <MessageSquare size={16} className="notif-icon-comment" />;
      default:
        return <Bell size={16} className="notif-icon-default" />;
    }
  };

  return (
    <div className="notifications-page">
      <div className="app-container notif-container">
        {/* Header */}
        <div className="notif-page-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay up to date with interactions, mentions, and community debates.</p>
          </div>

          <div className="notif-header-actions">
            <button 
              onClick={handleMarkAllRead} 
              className="btn btn-secondary btn-sm"
              title="Mark all notifications as read"
            >
              <CheckCheck size={16} />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="notif-filters-bar">
          <button
            onClick={() => setFilter('all')}
            className={`notif-filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`notif-filter-btn ${filter === 'unread' ? 'active' : ''}`}
          >
            Unread Only ({notifications.filter(n => !n.is_read).length})
          </button>
        </div>

        {/* Notifications Stream */}
        <div className="card notif-card-wrapper">
          {filtered.length > 0 ? (
            <div className="notif-stream-list">
              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className={`notif-item-row ${!item.is_read ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(item.id)}
                >
                  <div className="notif-avatar-col">
                    <img src={item.actor_avatar} alt="" className="notif-avatar" />
                    <div className="notif-badge-icon">
                      {getNotificationIcon(item.type)}
                    </div>
                  </div>

                  <div className="notif-content-col">
                    <div className="notif-text-row">
                      <Link href={`/profile/${item.actor_username}`} className="notif-actor-name">
                        {item.actor_name}
                      </Link>{' '}
                      <span className="notif-message-text">{item.message}</span>
                    </div>

                    <div className="notif-meta-row">
                      <span className="notif-time">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {item.link && (
                        <Link href={item.link} className="notif-view-link">
                          <span>View Details</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {!item.is_read && (
                    <div className="unread-dot" title="Unread" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="notif-empty-state">
              <Sparkles size={36} className="notif-empty-icon" />
              <h3>All caught up!</h3>
              <p>You have reviewed all your professional notifications.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .notifications-page {
          padding: 2.5rem 0 5rem;
        }

        .notif-container {
          max-width: 680px;
        }

        .notif-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .notif-page-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .notif-page-header p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .notif-filters-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .notif-filter-btn {
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
        }

        .notif-filter-btn:hover {
          color: var(--brand-primary);
        }

        .notif-filter-btn.active {
          background: var(--brand-primary);
          color: #FFF;
          border-color: var(--brand-primary);
        }

        .notif-card-wrapper {
          background: var(--surface-card);
          overflow: hidden;
        }

        .notif-stream-list {
          display: flex;
          flex-direction: column;
        }

        .notif-item-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.15rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .notif-item-row:last-child {
          border-bottom: none;
        }

        .notif-item-row:hover {
          background: var(--surface-hover);
        }

        .notif-item-row.unread {
          background: var(--brand-primary-light);
        }

        .notif-avatar-col {
          position: relative;
          flex-shrink: 0;
        }

        .notif-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }

        .notif-badge-icon {
          position: absolute;
          bottom: -2px;
          right: -4px;
          background: var(--surface-card);
          width: 22px;
          height: 22px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-xs);
        }

        .notif-icon-like {
          color: #DC2626;
        }

        .notif-icon-follow {
          color: var(--brand-primary);
        }

        .notif-icon-comment {
          color: #059669;
        }

        .notif-icon-default {
          color: var(--brand-deep-navy);
        }

        .notif-content-col {
          flex: 1;
        }

        .notif-text-row {
          font-size: 0.9375rem;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .notif-actor-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .notif-actor-name:hover {
          color: var(--brand-primary);
        }

        .notif-message-text {
          color: var(--text-secondary);
        }

        .notif-meta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.35rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .notif-view-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--brand-primary);
          font-weight: 600;
        }

        .notif-view-link:hover {
          text-decoration: underline;
        }

        .unread-dot {
          width: 9px;
          height: 9px;
          border-radius: var(--radius-full);
          background: var(--brand-primary);
          flex-shrink: 0;
        }

        .notif-empty-state {
          padding: 3.5rem 1.5rem;
          text-align: center;
        }

        .notif-empty-icon {
          color: var(--brand-primary);
          margin: 0 auto 0.75rem;
        }

        .notif-empty-state h3 {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }

        .notif-empty-state p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
