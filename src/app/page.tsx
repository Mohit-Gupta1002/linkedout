'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, Sparkles, Users, Building2, Shield, ArrowRight, 
  CheckCircle2, Compass, Eye, Heart, MessageSquare, TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="app-container hero-container">
          <div className="hero-pill animate-fade-in">
            <span className="pill-dot" />
            <span>The New Era of Professional Social Networking</span>
          </div>

          <h1 className="hero-title animate-fade-in">
            Your work. Your people.<br />
            <span className="hero-gradient-text">Your real story.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in">
            Your professional life deserves a better feed. Break free from hollow corporate platitudes. 
            Connect with peers, share visual stories, join technical communities, and access candid workplace intelligence.
          </p>

          <div className="hero-cta-group animate-fade-in">
            <Link href="/auth/sign-up" className="btn btn-primary btn-lg">
              <span>Join LinkedOut</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/feed" className="btn btn-secondary btn-lg">
              <Compass size={18} />
              <span>Explore the Feed</span>
            </Link>
          </div>

          {/* Interactive Feature Teaser Grid */}
          <div className="feature-teaser-grid">
            {/* Card 1: Visual Stories */}
            <div className="card feature-card">
              <div className="feature-card-header">
                <div className="feature-icon story-icon">
                  <Sparkles size={20} />
                </div>
                <span className="badge badge-story">Visual Stories</span>
              </div>
              <h3 className="feature-card-title">Authentic 24h Visual Stories</h3>
              <p className="feature-card-desc">
                Share behind-the-scenes engineering whiteboards, launch celebrations, hackathon marathons, and design critiques that expire in 24 hours.
              </p>
              <div className="feature-mini-preview story-preview">
                <div className="mini-story-ring">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="" />
                </div>
                <div className="mini-story-ring">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="" />
                </div>
                <div className="mini-story-ring">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="" />
                </div>
                <span className="mini-hint">Tap to view live daily stories</span>
              </div>
            </div>

            {/* Card 2: Professional Content */}
            <div className="card feature-card">
              <div className="feature-card-header">
                <div className="feature-icon pro-icon">
                  <Briefcase size={20} />
                </div>
                <span className="badge badge-blue">Professional Credibility</span>
              </div>
              <h3 className="feature-card-title">Showcase Real Architecture & Code</h3>
              <p className="feature-card-desc">
                High-substance updates with technical design docs, multi-image project carousels, benchmark breakdowns, and verified career milestones.
              </p>
              <div className="feature-mini-preview pro-preview">
                <div className="mini-post-badge">
                  <CheckCircle2 size={14} className="text-success" />
                  <span>Quantized LLM Engine benchmark: 58% RAM reduced</span>
                </div>
              </div>
            </div>

            {/* Card 3: Domain Communities */}
            <div className="card feature-card">
              <div className="feature-card-header">
                <div className="feature-icon comm-icon">
                  <Users size={20} />
                </div>
                <span className="badge badge-blue">Domain Communities</span>
              </div>
              <h3 className="feature-card-title">Channel-Based Discussions</h3>
              <p className="feature-card-desc">
                Discord-inspired spaces for AI, Software Engineering, Design, and Startups. Discuss RFCs, system architecture, and salary trends without noise.
              </p>
              <div className="feature-mini-preview tags-preview">
                <span className="mini-tag">#distributed-systems</span>
                <span className="mini-tag">#career-growth</span>
                <span className="mini-tag">#compensation</span>
              </div>
            </div>

            {/* Card 4: Workplace Intelligence */}
            <div className="card feature-card">
              <div className="feature-card-header">
                <div className="feature-icon intel-icon">
                  <Building2 size={20} />
                </div>
                <span className="badge badge-pseudo">Pseudonymous Mode</span>
              </div>
              <h3 className="feature-card-title">Unfiltered Workplace Intelligence</h3>
              <p className="feature-card-desc">
                Review companies with protected pseudonymous identities. Learn real work-life balance, management styles, and on-call realities before accepting an offer.
              </p>
              <div className="feature-mini-preview intel-preview">
                <div className="intel-metric">
                  <span className="metric-label">Psychological Safety</span>
                  <span className="metric-value">4.8 / 5.0</span>
                </div>
                <div className="intel-metric">
                  <span className="metric-label">Work-Life Balance</span>
                  <span className="metric-value">4.2 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Comparison Section */}
      <section className="comparison-section">
        <div className="app-container">
          <div className="section-header text-center">
            <span className="badge badge-blue">The LinkedOut Difference</span>
            <h2 className="section-title">Built for Real Humans, Not Algorithms</h2>
            <p className="section-subtitle">
              We took the professional trust of LinkedIn, the visual soul of Instagram, and the candid honesty of community forums.
            </p>
          </div>

          <div className="comparison-grid">
            <div className="card comparison-card traditional">
              <div className="comp-badge bad">Traditional Professional Networks</div>
              <ul className="comp-list">
                <li>❌ Performative hustle culture & fabricated positivity</li>
                <li>❌ Rigid, text-heavy feeds that ignore creative visual work</li>
                <li>❌ Fear of sharing candid workplace feedback due to retaliation</li>
                <li>❌ Algorithm pushes engagement bait rather than technical depth</li>
              </ul>
            </div>

            <div className="card comparison-card linkedout-card">
              <div className="comp-badge good">LinkedOut Experience</div>
              <ul className="comp-list">
                <li>✅ Real project milestones, genuine challenges & lessons learned</li>
                <li>✅ 24-hour visual Stories & rich multi-image portfolios</li>
                <li>✅ Protected pseudonymous mode for honest workplace discussions</li>
                <li>✅ Topic channels that organize discussions by technical domain</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="app-container">
          <div className="card cta-card">
            <div className="cta-content">
              <h2>Ready to experience a better professional network?</h2>
              <p>Join thousands of engineers, designers, founders, and students across India and globally.</p>
              <div className="cta-buttons">
                <Link href="/auth/sign-up" className="btn btn-story btn-lg">
                  Get Started in 2 Minutes
                </Link>
                <Link href="/feed" className="btn btn-secondary btn-lg">
                  Browse Public Discussions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="app-container footer-inner">
          <div className="footer-left">
            <span className="logo-text">Linked<span className="logo-accent">Out</span></span>
            <p className="footer-tagline">Your work. Your people. Your real story.</p>
          </div>
          <div className="footer-links">
            <Link href="/feed">Feed</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/communities">Communities</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/auth/sign-in">Sign In</Link>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} LinkedOut. Built with modern web craft.
          </div>
        </div>
      </footer>

      {/* Page Styles */}
      <style jsx>{`
        .landing-wrapper {
          overflow-x: hidden;
        }

        .hero-section {
          padding: 4.5rem 0 3.5rem;
          background: radial-gradient(circle at 50% 0%, rgba(10, 102, 194, 0.08) 0%, transparent 70%);
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .pill-dot {
          width: 7px;
          height: 7px;
          background: var(--brand-primary);
          border-radius: var(--radius-full);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 1.25rem;
          line-height: 1.15;
          max-width: 820px;
        }

        .hero-gradient-text {
          background: var(--story-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 680px;
          margin-bottom: 2.25rem;
          line-height: 1.6;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .feature-teaser-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          width: 100%;
          text-align: left;
        }

        @media (max-width: 860px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .feature-teaser-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-subtle);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .feature-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .story-icon {
          background: rgba(221, 42, 123, 0.12);
          color: #DD2A7B;
        }

        .pro-icon {
          background: var(--brand-primary-light);
          color: var(--brand-primary);
        }

        .comm-icon {
          background: rgba(16, 42, 67, 0.1);
          color: var(--brand-deep-navy);
        }

        [data-theme="dark"] .comm-icon {
          background: rgba(37, 133, 232, 0.15);
          color: var(--brand-primary);
        }

        .intel-icon {
          background: rgba(126, 34, 206, 0.12);
          color: #7E22CE;
        }

        .feature-card-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .feature-card-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .feature-mini-preview {
          background: var(--surface-hover);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-strong);
        }

        .story-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mini-story-ring {
          padding: 2px;
          background: var(--story-gradient);
          border-radius: var(--radius-full);
          display: inline-flex;
        }

        .mini-story-ring img {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--surface-card);
          object-fit: cover;
        }

        .mini-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 0.5rem;
        }

        .mini-post-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
        }

        .text-success {
          color: var(--success);
        }

        .tags-preview {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .mini-tag {
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--surface-card);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          color: var(--brand-primary);
          border: 1px solid var(--border-subtle);
        }

        .intel-preview {
          display: flex;
          justify-content: space-around;
        }

        .intel-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .metric-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Comparison Section */
        .comparison-section {
          padding: 4.5rem 0;
          border-top: 1px solid var(--border-subtle);
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .text-center {
          text-align: center;
        }

        .section-title {
          font-size: 2.25rem;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr;
          }
        }

        .comparison-card {
          padding: 2rem;
        }

        .comp-badge {
          display: inline-block;
          font-size: 0.8125rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.5rem;
        }

        .comp-badge.bad {
          background: var(--error-bg);
          color: var(--error);
          border: 1px solid var(--error-border);
        }

        .comp-badge.good {
          background: var(--success-bg);
          color: var(--success);
          border: 1px solid var(--success-border);
        }

        .linkedout-card {
          border: 2px solid var(--brand-primary);
          box-shadow: 0 8px 24px rgba(10, 102, 194, 0.12);
        }

        .comp-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.95rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 3rem 0 5rem;
        }

        .cta-card {
          background: linear-gradient(135deg, var(--brand-deep-navy) 0%, #0A4A87 100%);
          color: #FFF;
          padding: 3.5rem 2rem;
          text-align: center;
          border: none;
        }

        .cta-content h2 {
          color: #FFF;
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
        }

        .cta-content p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Footer */
        .landing-footer {
          border-top: 1px solid var(--border-subtle);
          padding: 2.5rem 0;
          background: var(--surface-card);
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .footer-tagline {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .footer-links a:hover {
          color: var(--brand-primary);
        }

        .footer-copyright {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
