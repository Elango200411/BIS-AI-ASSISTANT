import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, MessageSquareText, Search, Building2, FileText,
  Clock, ArrowRight, BarChart3, Users, RefreshCw,
  Factory, Zap, Database, Globe, Activity,
} from 'lucide-react'
import { getStats } from '../services/api'
import { useApp } from '../context/AppContext'

function formatTimeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

const ACTIVITY_ICONS = {
  chat: MessageSquareText,
  compliance: ShieldCheck,
  search: Search,
  service: Building2,
}

export default function Dashboard() {
  const {
    userType, setUserType,
    activity, clearActivity,
    complianceChecks, questionsAsked,
  } = useApp()

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [, setTick] = useState(0)

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const statsCards = [
    {
      label: 'Knowledge Base',
      value: stats ? stats.total_kb_records : '...',
      icon: Database,
      color: 'blue',
      sub: stats ? `${stats.faqs} FAQs, ${stats.standards_indexed} standards` : 'Loading...',
    },
    {
      label: 'BIS Services',
      value: stats ? stats.bis_services : '...',
      icon: Building2,
      color: 'green',
      sub: stats ? `${stats.consumer_services} consumer, ${stats.certification_rules} cert rules` : 'Loading...',
    },
    {
      label: 'Compliance Checks',
      value: complianceChecks,
      icon: ShieldCheck,
      color: 'purple',
      sub: 'This session',
    },
    {
      label: 'Questions Answered',
      value: questionsAsked,
      icon: MessageSquareText,
      color: 'orange',
      sub: 'This session',
    },
  ]

  const quickActions = [
    { label: 'Ask BIS AI', desc: 'Get instant answers about Indian Standards and BIS', icon: MessageSquareText, to: '/assistant', color: 'blue' },
    { label: 'Check My Product', desc: 'Verify product compliance with Indian standards', icon: ShieldCheck, to: '/compliance-checker', color: 'green' },
    { label: 'Search Standards', desc: 'Browse and search IS codes and specifications', icon: Search, to: '/standards-search', color: 'orange' },
    { label: 'BIS Services', desc: 'Access all Bureau of Indian Standards services', icon: Building2, to: '/bis-services', color: 'purple' },
  ]

  return (
    <div>
      {/* Welcome Section */}
      <div className="dash-welcome">
        <div className="dash-welcome-content">
          <p className="dash-welcome-title">Welcome to BIS AI ASSISTANT</p>
          <p className="dash-welcome-sub">Your intelligent assistant for Indian Standards and BIS Services.</p>

          <div className="dash-welcome-actions">
            <Link to="/assistant" className="btn btn-primary btn-lg">
              <MessageSquareText size={18} /> Ask BIS AI
            </Link>
            <Link to="/compliance-checker" className="btn btn-secondary btn-lg">
              <ShieldCheck size={18} /> Check My Product
            </Link>
          </div>

          <div className="user-type-selector">
            <span className="user-type-label">I am a:</span>
            <button className={`user-type-btn ${userType === 'consumer' ? 'active' : ''}`} onClick={() => setUserType('consumer')}>
              <Users size={14} /> Consumer
            </button>
            <button className={`user-type-btn ${userType === 'industry' ? 'active' : ''}`} onClick={() => setUserType('industry')}>
              <Factory size={14} /> Industry / Manufacturer
            </button>
          </div>
        </div>
        <div className="dash-welcome-graphic">
          <div className="dash-welcome-circle c1" />
          <div className="dash-welcome-circle c2" />
          <div className="dash-welcome-icon">
            <Globe size={56} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid" style={{ marginTop: '24px' }}>
        {statsCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>
              <s.icon size={22} />
            </div>
            <div className="stat-info">
              <h4>{statsLoading ? <span className="skeleton" style={{ display: 'inline-block', width: '48px', height: '24px' }}>&nbsp;</span> : s.value}</h4>
              <p>{s.label}</p>
              <span className="stat-sub">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="section-title">
        <Zap size={18} /> Quick Actions
      </h2>
      <div className="dash-quick-grid">
        {quickActions.map((action) => (
          <Link to={action.to} key={action.label} className="dash-qa-card">
            <div className={`dash-qa-icon ${action.color}`}>
              <action.icon size={22} />
            </div>
            <div className="dash-qa-content">
              <h3>{action.label}</h3>
              <p>{action.desc}</p>
            </div>
            <ArrowRight size={18} className="dash-qa-arrow" />
          </Link>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="dash-bottom">
        {/* Recent Activity */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3><Clock size={18} /> Recent Activity</h3>
            {activity.length > 0 && (
              <button className="btn btn-ghost btn-xs" onClick={clearActivity}>
                <RefreshCw size={12} /> Clear
              </button>
            )}
          </div>
          {activity.length === 0 ? (
            <div className="empty-state" style={{ flex: 1 }}>
              <Activity size={36} style={{ color: 'var(--gray-300)' }} />
              <p>No activity yet. Start by asking a question or checking a product.</p>
            </div>
          ) : (
            <div className="dash-activity-list">
              {activity.map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type] || FileText
                return (
                  <div className="dash-activity-item" key={i}>
                    <div className={`dash-activity-icon ${item.type}`}>
                      <Icon size={14} />
                    </div>
                    <div className="dash-activity-info">
                      <p className="dash-activity-title">{item.title}</p>
                      <span className="dash-activity-time">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <span className={`badge badge-${item.type === 'chat' ? 'info' : item.type === 'compliance' ? 'success' : item.type === 'search' ? 'warning' : 'info'}`}>
                      {item.type}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3><BarChart3 size={18} /> System Status</h3>
          </div>
          <div className="dash-status-list">
            {[
              { label: 'RAG Engine', status: 'Operational' },
              { label: 'Knowledge Base', status: stats ? `${stats.total_kb_records} records` : 'Loading...' },
              { label: 'Translation Service', status: '3 languages' },
              { label: 'Voice Input', status: 'Web Speech API' },
              { label: 'AI Chat Engine', status: 'Ready' },
            ].map((s) => (
              <div className="dash-status-row" key={s.label}>
                <span>{s.label}</span>
                <span className="dash-status-badge">{s.status}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        .dash-welcome {
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 50%, #1e40af 100%);
          border-radius: var(--radius-xl);
          padding: 32px;
          color: var(--white);
          position: relative;
          overflow: hidden;
          min-height: 220px;
        }
        .dash-welcome-content { position: relative; z-index: 2; max-width: 640px; }
        .dash-welcome-badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          padding: 4px 14px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: 0.04em;
          backdrop-filter: blur(4px);
        }

        .dash-welcome-title { font-size: 1.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 4px; }
        .dash-welcome-sub { color: rgba(255,255,255,0.8); font-size: 0.9375rem; margin-bottom: 20px; }
        .dash-welcome-actions {
          display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .dash-welcome-actions .btn-secondary {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          color: var(--white);
        }
        .dash-welcome-actions .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.4);
        }
        .dash-welcome-graphic {
          position: absolute; top: -30px; right: -30px; z-index: 1;
        }
        .dash-welcome-circle {
          position: absolute; border-radius: 50%; opacity: 0.07;
        }
        .dash-welcome-circle.c1 { width: 240px; height: 240px; background: var(--white); top: 0; right: 0; }
        .dash-welcome-circle.c2 { width: 160px; height: 160px; background: #60a5fa; top: 40px; right: 180px; }
        .dash-welcome-icon {
          position: absolute; top: 30px; right: 50px;
          color: rgba(255,255,255,0.12);
          animation: floatIcon 6s ease-in-out infinite;
        }
        @keyframes floatIcon { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

        .user-type-selector {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .user-type-label {
          font-size: 0.8125rem; font-weight: 500; color: rgba(255,255,255,0.7);
        }
        .user-type-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: var(--radius-full);
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.8);
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: all var(--transition-fast);
          backdrop-filter: blur(4px);
        }
        .user-type-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.4);
        }
        .user-type-btn.active {
          background: var(--white);
          color: var(--primary-700);
          border-color: var(--white);
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }

        .dash-quick-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        .dash-qa-card {
          display: flex; align-items: center; gap: 14px;
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg); padding: 20px;
          transition: all var(--transition-base); cursor: pointer; text-decoration: none;
        }
        .dash-qa-card:hover {
          border-color: var(--primary-300);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .dash-qa-icon {
          width: 48px; height: 48px; border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-qa-icon.blue { background: var(--primary-100); color: var(--primary-500); }
        .dash-qa-icon.green { background: var(--success-light); color: var(--success); }
        .dash-qa-icon.orange { background: #fff7ed; color: var(--accent-500); }
        .dash-qa-icon.purple { background: #f3e8ff; color: #7c3aed; }
        .dash-qa-content { flex: 1; min-width: 0; }
        .dash-qa-content h3 { font-size: 0.9375rem; font-weight: 600; color: var(--gray-800); }
        .dash-qa-content p { font-size: 0.8125rem; color: var(--gray-500); margin-top: 2px; line-height: 1.4; }
        .dash-qa-arrow { color: var(--gray-400); flex-shrink: 0; transition: all var(--transition-fast); }
        .dash-qa-card:hover .dash-qa-arrow { transform: translateX(3px); color: var(--primary-500); }

        .dash-bottom {
          display: grid; grid-template-columns: 1.5fr 1fr;
          gap: 16px; margin-top: 24px;
        }

        .dash-activity-list { display: flex; flex-direction: column; }
        .dash-activity-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid var(--gray-100);
        }
        .dash-activity-item:last-child { border-bottom: none; }
        .dash-activity-icon {
          width: 32px; height: 32px; border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-activity-icon.chat { background: var(--primary-100); color: var(--primary-500); }
        .dash-activity-icon.compliance { background: var(--success-light); color: var(--success); }
        .dash-activity-icon.search { background: #fff7ed; color: var(--accent-500); }
        .dash-activity-icon.service { background: #f3e8ff; color: #7c3aed; }
        .dash-activity-info { flex: 1; min-width: 0; }
        .dash-activity-title { font-size: 0.8125rem; color: var(--gray-700); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dash-activity-time { font-size: 0.75rem; color: var(--gray-400); }

        .dash-status-list { display: flex; flex-direction: column; gap: 12px; }
        .dash-status-row {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.875rem; color: var(--gray-600);
        }
        .dash-status-badge {
          font-size: 0.75rem; font-weight: 600; color: var(--success);
          display: flex; align-items: center; gap: 6px;
        }
        .dash-status-badge::before {
          content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--success);
        }

        @media (max-width: 1280px) {
          .dash-quick-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .dash-welcome { padding: 24px; min-height: auto; }
          .dash-welcome-title { font-size: 1.25rem; }
          .dash-welcome-actions { flex-direction: column; }
          .dash-welcome-actions .btn { width: 100%; }
          .user-type-selector { flex-direction: column; align-items: flex-start; }
          .dash-quick-grid { grid-template-columns: 1fr; }
          .dash-bottom { grid-template-columns: 1fr; }
          .dash-welcome-graphic { display: none; }
        }
      `}</style>
    </div>
  )
}
