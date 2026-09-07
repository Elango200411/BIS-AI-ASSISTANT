import { useState, useEffect } from 'react'
import {
  Building2, ShieldCheck, FileCheck, Stamp, Users, Globe,
  ArrowRight, CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp,
  MessageSquareText, Search, FileText, HelpCircle, BadgeCheck,
} from 'lucide-react'
import { getServices, getService } from '../services/api'
import { useApp } from '../context/AppContext'

const CATEGORY_MAP = {
  'Product Certification (Scheme I)': { icon: ShieldCheck, color: 'blue', tag: 'ISI Mark' },
  'Compulsory Registration (CRS)': { icon: FileCheck, color: 'orange', tag: 'CRS' },
  'Hallmarking': { icon: Stamp, color: 'green', tag: 'Gold/Silver' },
  'Laboratory Recognition': { icon: Building2, color: 'purple', tag: 'Testing' },
  'Foreign Manufacturers (FMCS)': { icon: Globe, color: 'blue', tag: 'International' },
  'Standardization': { icon: Users, color: 'green', tag: 'Standards' },
  'Verification': { icon: BadgeCheck, color: 'blue', tag: 'Verify' },
  'Complaint': { icon: HelpCircle, color: 'orange', tag: 'Grievance' },
}

function getMeta(name) {
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return val
  }
  return { icon: ShieldCheck, color: 'blue', tag: 'BIS' }
}

export default function BisServices() {
  const { addActivity } = useApp()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => { loadServices() }, [])

  const loadServices = async (q = '') => {
    setLoading(true); setError(null)
    try { const data = await getServices(q); setServices(data.results) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleSearch = () => { loadServices(searchQuery); setExpandedId(null); setDetail(null) }
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const toggleExpand = async (serviceId) => {
    if (expandedId === serviceId) { setExpandedId(null); setDetail(null); return }
    setExpandedId(serviceId); setDetailLoading(true)
    try {
      const data = await getService(serviceId)
      setDetail(data)
      addActivity({ type: 'service', title: `Viewed service: ${data?.name || serviceId}` })
    } catch { setDetail(null) } finally { setDetailLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1>BIS Services</h1>
        <p>Access Bureau of Indian Standards certification, registration, and standardization services</p>
      </div>

      <div className="bs-alert">
        <CheckCircle2 size={20} />
        <div>
          <strong>BIS Services Portal Status: Online</strong>
          <p>All services currently operational. Mon-Sat 9:30 AM - 6:00 PM IST</p>
        </div>
      </div>

      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <Search size={20} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
        <input
          placeholder="Search BIS services (e.g., certification, hallmarking, CRS)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />} Search
        </button>
      </div>

      {loading && <div className="loading-state"><div className="spinner" /><p>Loading services...</p></div>}
      {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}

      {!loading && !error && services.length === 0 && (
        <div className="empty-state card">
          <Search size={40} style={{ color: 'var(--gray-300)' }} />
          <h3>No services found</h3>
          <p>Try a different search term or clear the filter.</p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="bs-grid">
          {services.map((s) => {
            const meta = getMeta(s.name)
            const Icon = meta.icon
            const isExpanded = expandedId === s.service_id
            return (
              <div className={`card bs-card ${isExpanded ? 'bs-card-expanded' : ''}`} key={s.service_id}>
                <div className="bs-card-top">
                  <div className={`stat-icon ${meta.color}`}><Icon size={22} /></div>
                  <span className="badge badge-info">{meta.tag}</span>
                </div>
                <h3 className="bs-card-title">{s.name}</h3>
                <p className="bs-card-desc">{s.description}</p>
                {s.target_user && (
                  <div className="bs-card-meta">
                    <span className="bs-card-meta-label">Who needs this:</span>
                    <span className="bs-card-meta-value">{s.target_user}</span>
                  </div>
                )}
                <div className="bs-card-footer">
                  <span className="bs-card-status"><CheckCircle2 size={13} /> Available</span>
                  <button className="btn btn-outline btn-sm" onClick={() => toggleExpand(s.service_id)}>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? 'Less' : 'Details'}
                  </button>
                </div>
                {isExpanded && (
                  <div className="bs-expanded">
                    {detailLoading ? (
                      <div style={{ padding: '16px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                    ) : detail ? (
                      <>
                        {detail.required_documents?.length > 0 && (
                          <div className="bs-expanded-section">
                            <h4><FileText size={14} /> Required Documents</h4>
                            <ul>{detail.required_documents.map((doc, i) => <li key={i}>{doc}</li>)}</ul>
                          </div>
                        )}
                        {detail.process_steps?.length > 0 && (
                          <div className="bs-expanded-section">
                            <h4><ArrowRight size={14} /> Process Steps</h4>
                            <ol>{detail.process_steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
                          </div>
                        )}
                        {detail.keywords?.length > 0 && (
                          <div className="bs-expanded-section">
                            <h4><HelpCircle size={14} /> FAQ Topics</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {detail.keywords.map((kw, i) => <span className="tag" key={i}>{kw}</span>)}
                            </div>
                          </div>
                        )}
                        <button className="btn btn-accent btn-sm" onClick={() => window.location.href = '/assistant'} style={{ marginTop: '8px' }}>
                          <MessageSquareText size={14} /> Ask AI About This
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .bs-alert {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 18px; background: var(--success-light);
          border: 1px solid #bbf7d0; border-radius: var(--radius-lg);
          color: var(--success-dark); margin-bottom: 20px;
        }
        .bs-alert strong { font-size: 0.9375rem; }
        .bs-alert p { font-size: 0.8125rem; margin-top: 2px; color: var(--success); }
        .bs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .bs-card { display: flex; flex-direction: column; gap: 10px; }
        .bs-card-expanded { border-color: var(--primary-300); box-shadow: var(--shadow-md); grid-column: 1 / -1; }
        .bs-card-top { display: flex; align-items: center; justify-content: space-between; }
        .bs-card-title { font-size: 1rem; font-weight: 600; line-height: 1.3; }
        .bs-card-desc { font-size: 0.8125rem; color: var(--gray-500); line-height: 1.5; }
        .bs-card-meta {
          background: var(--gray-50); border-radius: var(--radius-sm);
          padding: 10px 14px; font-size: 0.8125rem;
        }
        .bs-card-meta-label { font-weight: 700; color: var(--gray-600); display: block; margin-bottom: 2px; }
        .bs-card-meta-value { color: var(--gray-500); line-height: 1.4; }
        .bs-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: auto; padding-top: 12px; border-top: 1px solid var(--gray-100);
        }
        .bs-card-status { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--success); font-weight: 600; }
        .bs-expanded { margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--gray-100); }
        .bs-expanded-section { margin-bottom: 14px; }
        .bs-expanded-section h4 {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 700; color: var(--gray-600);
          text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;
        }
        .bs-expanded-section ul, .bs-expanded-section ol {
          padding-left: 20px; font-size: 0.875rem; color: var(--gray-600); line-height: 1.8;
        }
        .bs-expanded-section li { margin-bottom: 4px; }

        @media (max-width: 1280px) { .bs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .bs-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
