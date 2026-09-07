import { ShieldCheck, MessageSquareText, Search, Building2, FileText, Clock, ArrowRight, CheckCircle2, BarChart3, Users, RefreshCw, Briefcase, Factory, Zap, Database, Globe, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
  { label: 'Knowledge Base Records', value: '1,250+', icon: Database, color: 'blue', sub: '320 FAQs, 450 standards' },
  { label: 'BIS Services', value: '10+', icon: Building2, color: 'green', sub: '8 consumer, 15 cert rules' },
  { label: 'Compliance Checks', value: '320+', icon: ShieldCheck, color: 'purple', sub: 'This session' },
  { label: 'Questions Answered', value: '1,500+', icon: MessageSquareText, color: 'orange', sub: 'This session' },
]

const quickActions = [
  { label: 'Ask BIS AI', desc: 'Get instant answers about Indian Standards and BIS', icon: MessageSquareText, color: 'blue' },
  { label: 'Check My Product', desc: 'Verify product compliance with Indian standards', icon: ShieldCheck, color: 'green' },
  { label: 'Search Standards', desc: 'Browse and search IS codes and specifications', icon: Search, color: 'orange' },
  { label: 'BIS Services', desc: 'Access all Bureau of Indian Standards services', icon: Building2, color: 'purple' },
]

export default function Dashboard() {
  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-content">
          <span className="welcome-badge">Smart India Hackathon 2025</span>
          <h1>Good Morning 👋</h1>
          <p className="welcome-subtitle">Welcome to BIS Sahayak AI</p>
          <p className="welcome-desc">Your intelligent assistant for Indian Standards and BIS Services.</p>
          <div className="welcome-actions">
            <button className="btn btn-primary btn-lg">Ask BIS AI</button>
            <button className="btn btn-secondary btn-lg">Check My Product</button>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}><s.icon size={22} /></div>
            <div className="stat-info">
              <h4>{s.value}</h4>
              <p>{s.label}</p>
              <span className="stat-sub">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title"><Zap size={18} /> Quick Actions</h2>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <div className="quick-action-card" key={action.label}>
            <div className={`qa-icon ${action.color}`}><action.icon size={22} /></div>
            <div className="qa-content">
              <h3>{action.label}</h3>
              <p>{action.desc}</p>
            </div>
            <ArrowRight size={18} className="qa-arrow" />
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <div className="card">
          <div className="card-header">
            <h3><Clock size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Recent Activity</h3>
          </div>
          <div className="activity-empty">
            <Activity size={32} style={{ color: 'var(--gray-300)' }} />
            <p>No activity yet. Start by asking a question or checking a product.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><BarChart3 size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />System Status</h3>
          </div>
          <div className="status-list">
            {['RAG Engine', 'Knowledge Base', 'Translation Service', 'Voice Input', 'AI Chat Engine'].map((s) => (
              <div className="status-row" key={s}>
                <span>{s}</span>
                <span className="status-indicator online">Operational</span>
              </div>
            ))}
          </div>
          <div className="sih-badge">
            <Briefcase size={16} />
            <div>
              <span className="sih-title">Smart India Hackathon</span>
              <span className="sih-sub">Problem ID: 26107</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .welcome-section {
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 50%, #1e40af 100%);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          color: var(--white);
          margin-bottom: 1.5rem;
        }
        .welcome-content { max-width: 640px; }
        .welcome-badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          padding: 0.25rem 0.85rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .welcome-section h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.25rem; }
        .welcome-subtitle { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.25rem; }
        .welcome-desc { color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-bottom: 1.25rem; }
        .welcome-actions { display: flex; gap: 0.75rem; }
        .welcome-actions .btn-secondary { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: var(--white); }
        .section-title { display: flex; align-items: center; gap: 0.4rem; margin-top: 1.75rem; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600; }
        .quick-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .quick-action-card {
          display: flex; align-items: center; gap: 1rem;
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg); padding: 1.2rem;
          cursor: pointer; transition: all 0.2s;
        }
        .quick-action-card:hover { border-color: var(--primary-300); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .qa-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qa-icon.blue { background: var(--primary-100); color: var(--primary-500); }
        .qa-icon.green { background: #f0fdf4; color: #16a34a; }
        .qa-icon.orange { background: #fff7ed; color: #ea580c; }
        .qa-icon.purple { background: #faf5ff; color: #9333ea; }
        .qa-content { flex: 1; min-width: 0; }
        .qa-content h3 { font-size: 0.9rem; font-weight: 600; }
        .qa-content p { font-size: 0.76rem; color: var(--gray-500); margin-top: 0.15rem; }
        .qa-arrow { color: var(--gray-400); flex-shrink: 0; }
        .dashboard-bottom { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.25rem; margin-top: 1.5rem; }
        .activity-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 2rem 1rem; color: var(--gray-400); text-align: center; }
        .activity-empty p { font-size: 0.82rem; }
        .status-list { display: flex; flex-direction: column; gap: 0.7rem; }
        .status-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: var(--gray-600); }
        .status-indicator { font-size: 0.72rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem; }
        .status-indicator::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--success); }
        .status-indicator.online { color: var(--success); }
        .sih-badge { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--gray-100); display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); color: #166534; }
        .sih-title { font-size: 0.78rem; font-weight: 700; display: block; }
        .sih-sub { font-size: 0.68rem; color: #15803d; }
        @media (max-width: 1024px) { .quick-actions-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .stat-grid, .quick-actions-grid, .dashboard-bottom { grid-template-columns: 1fr; } .welcome-actions { flex-direction: column; } }
      `}</style>
    </div>
  )
}
