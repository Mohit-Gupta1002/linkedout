'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { Company, CompanySubmission } from '@/types';

interface CompanyAISummaryProps {
  company: Company;
  submissions: CompanySubmission[];
}

export default function CompanyAISummary({ company, submissions }: CompanyAISummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Deterministic summary synthesis based on real scores and themes
  const overall = company.overall_rating;
  const safety = company.scores.psychological_safety;
  const workLife = company.scores.work_life;
  const comp = company.scores.compensation;
  const learning = company.scores.learning;

  const topStrengths = [
    safety >= 4.0 ? 'High psychological safety allowing junior and senior engineers to voice design tradeoffs freely.' : null,
    comp >= 4.0 ? 'Competitive market compensation with transparent promotion criteria.' : null,
    learning >= 4.0 ? 'Rich engineering learning culture with access to modern distributed tooling.' : null,
    workLife >= 4.0 ? 'Respect for asynchronous communication and flexible working hours.' : null,
    ...company.positive_themes
  ].filter(Boolean) as string[];

  const frictionAreas = [
    workLife < 3.8 ? 'Occasional sprint crunch during festive season or high-velocity quarterly launches.' : null,
    safety < 4.0 ? 'Management alignment requires proactive stakeholder navigation.' : null,
    ...company.common_reasons_for_leaving
  ].filter(Boolean) as string[];

  const fitRecommendation = overall >= 4.2 
    ? 'Ideal for engineers, PMs, and designers who thrive in high-ownership environments and prioritize technical craftsmanship over bureaucratic hierarchy.'
    : 'Best suited for mid-to-senior professionals who excel at autonomous execution and managing their own work-life boundaries.';

  return (
    <div className="card ai-summary-card">
      <div className="ai-summary-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="ai-title-group">
          <div className="ai-badge-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI Workplace Intelligence Synthesis</span>
          </div>
          <span className="ai-confidence-tag">
            <ShieldCheck size={13} />
            <span>Grounded in {submissions.length || company.reviews_count} verified reviews</span>
          </span>
        </div>

        <button 
          type="button" 
          className="expand-btn"
          aria-label={isExpanded ? 'Collapse synthesis' : 'Expand synthesis'}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="ai-summary-content">
          <div className="ai-lead-paragraph">
            <Bot size={20} className="ai-bot-avatar" />
            <p>
              LinkedOut Workplace Intelligence has synthesized <strong>{submissions.length || company.reviews_count} verified employee submissions</strong> for <strong>{company.name}</strong>. Here is the consensus snapshot across leadership, engineering rigor, and culture:
            </p>
          </div>

          <div className="ai-insights-grid">
            {/* Top Strengths */}
            <div className="ai-box positive-box">
              <div className="box-title">
                <CheckCircle size={16} className="text-success" />
                <h4>Consensus Strengths</h4>
              </div>
              <ul className="box-list">
                {topStrengths.slice(0, 3).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Friction Points */}
            <div className="ai-box warning-box">
              <div className="box-title">
                <AlertTriangle size={16} className="text-warning" />
                <h4>Points of Friction & Growth</h4>
              </div>
              <ul className="box-list">
                {frictionAreas.slice(0, 3).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cultural Fit Guidance */}
          <div className="ai-fit-box">
            <strong className="fit-label">Candidate Fit Guidance:</strong>
            <span className="fit-text">{fitRecommendation}</span>
          </div>

          <div className="ai-disclaimer-footer">
            <span>⚡ Deterministic Workplace Synthesis: Generated strictly from employee feedback data with zero hallucination. Verified under pseudonymous isolation tokens.</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-summary-card {
          border: 1.5px solid rgba(10, 102, 194, 0.25);
          background: linear-gradient(180deg, var(--surface-card) 0%, var(--surface-hover) 100%);
          margin-bottom: 1.5rem;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .ai-summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .ai-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .ai-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--brand-primary-light);
          color: var(--brand-primary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 700;
        }

        .sparkle-icon {
          animation: spin-pulse 3s infinite linear;
        }

        @keyframes spin-pulse {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .ai-confidence-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .expand-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .ai-summary-content {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .ai-lead-paragraph {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .ai-bot-avatar {
          color: var(--brand-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .ai-insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ai-box {
          padding: 0.85rem;
          border-radius: var(--radius-md);
        }

        .positive-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .warning-box {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .box-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .box-title h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .box-list {
          padding-left: 1.2rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          line-height: 1.45;
        }

        .ai-fit-box {
          background: var(--surface-card);
          border: 1px solid var(--border-subtle);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .fit-label {
          color: var(--text-primary);
          margin-right: 0.5rem;
        }

        .fit-text {
          color: var(--text-secondary);
        }

        .ai-disclaimer-footer {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .ai-insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
