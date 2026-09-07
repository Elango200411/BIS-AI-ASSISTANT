import { useState } from 'react'
import {
  ShieldCheck, Search, AlertCircle, CheckCircle2, ArrowRight,
  FileText, Loader2, AlertTriangle, Info, MessageSquareText, ChevronRight,
} from 'lucide-react'
import { checkCompliance } from '../services/api'
import { useApp } from '../context/AppContext'

const CATEGORY_OPTIONS = [
  'Electrical Product', 'Construction Material', 'Food & Agriculture',
  'Textile & Leather', 'Renewable Energy', 'Consumer Product',
  'Automotive Component', 'Medical Device', 'Chemical & Petrochemical', 'Mechanical Engineering',
]

const COUNTRY_OPTIONS = [
  'India', 'China', 'Germany', 'USA', 'Japan', 'South Korea',
  'Taiwan', 'Vietnam', 'Bangladesh', 'Other',
]

const STATUS_CONFIG = {
  green: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', iconColor: '#16a34a', label: 'Information Available — Likely Ready' },
  yellow: { bg: '#fefce8', border: '#fde68a', color: '#854d0e', iconColor: '#ca8a04', label: 'Further Verification Required' },
  red: { bg: '#fef2f2', border: '#fecaca', color: '#991b1b', iconColor: '#dc2626', label: 'Certification / Compliance Attention Required' },
}

export default function ProductCompliance() {
  const { addActivity, incrementCompliance } = useApp()
  const [form, setForm] = useState({
    product_name: '', category: '', intended_use: '',
    manufacturer: '', country: '', description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    if (!Object.values(form).some((v) => v.trim())) {
      setError('Please fill in at least one field.')
      return
    }
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await checkCompliance(form)
      setResult(data)
      incrementCompliance()
      addActivity({ type: 'compliance', title: `Checked: ${form.product_name || 'Product'} (${form.category || 'General'})` })
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const reset = () => {
    setForm({ product_name: '', category: '', intended_use: '', manufacturer: '', country: '', description: '' })
    setResult(null); setError(null)
  }

  const sc = result ? STATUS_CONFIG[result.compliance_status?.color] || STATUS_CONFIG.yellow : null

  return (
    <div>
      <div className="page-header">
        <h1>Product Compliance Checker</h1>
        <p>Verify your product against applicable Indian Standards and BIS requirements</p>
      </div>

      <div className="pc-layout">
        <div className="pc-form card">
          <h3 className="pc-section-title"><FileText size={18} /> Product Details</h3>
          <div className="pc-form-grid">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="input-field" placeholder="e.g., LED Bulb, Steel Pipe, Cement..." value={form.product_name} onChange={(e) => setField('product_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Product Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setField('category', e.target.value)}>
                <option value="">Select category...</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Intended Use</label>
              <input className="input-field" placeholder="e.g., Domestic, Commercial, Industrial" value={form.intended_use} onChange={(e) => setField('intended_use', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Manufacturer / Importer</label>
              <input className="input-field" placeholder="Company or individual name" value={form.manufacturer} onChange={(e) => setField('manufacturer', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Country of Manufacture</label>
              <select className="input-field" value={form.country} onChange={(e) => setField('country', e.target.value)}>
                <option value="">Select country...</option>
                {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Product Description</label>
              <textarea className="input-field" rows={3} placeholder="Describe your product, its features, power rating, materials, etc." value={form.description} onChange={(e) => setField('description', e.target.value)} />
            </div>
          </div>
          <div className="pc-form-actions">
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
              {loading ? 'Analyzing...' : 'Check Compliance'}
            </button>
            {result && <button className="btn btn-secondary" onClick={reset}>New Check</button>}
          </div>
        </div>

        {loading && (
          <div className="loading-state card">
            <div className="spinner" />
            <p>Analyzing product against BIS standards database...</p>
          </div>
        )}

        {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}

        {result && (
          <div className="pc-results">
            <div className="pc-score-banner card" style={{ background: sc?.bg, borderColor: sc?.border }}>
              <div className="pc-score-left">
                <div className="pc-score-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={sc?.iconColor || '#999'} strokeWidth="7"
                      strokeDasharray={`${(result.readiness_score / 100) * 264} 264`}
                      strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="pc-score-num">
                    <span className="pc-score-big" style={{ color: sc?.color }}>{result.readiness_score}</span>
                    <span className="pc-score-sub">/ 100</span>
                  </div>
                </div>
              </div>
              <div className="pc-score-right">
                <div className="pc-status-badge" style={{ background: sc?.bg, border: `1px solid ${sc?.border}`, color: sc?.color }}>
                  {result.compliance_status?.color === 'green' && <CheckCircle2 size={18} />}
                  {result.compliance_status?.color === 'yellow' && <AlertTriangle size={18} />}
                  {result.compliance_status?.color === 'red' && <AlertCircle size={18} />}
                  <strong>{sc?.label}</strong>
                </div>
                <p className="pc-score-meta">Field completeness: {result.field_completeness}% · {result.filled_fields?.length || 0} of 6 fields provided</p>
                {result.detected_categories?.length > 0 && (
                  <div className="pc-detected">
                    Detected: {result.detected_categories.map((c) => <span className="tag" key={c}>{c}</span>)}
                  </div>
                )}
              </div>
            </div>

            <div className="pc-results-grid">
              <div className="pc-result-col">
                {result.relevant_standards?.length > 0 && (
                  <div className="card">
                    <h4 className="pc-section-title"><FileText size={16} /> Applicable Standards</h4>
                    {result.relevant_standards.map((s, i) => (
                      <div className="pc-result-row" key={i}>
                        <span className="pc-result-code">{s.standard_number}</span>
                        <span className="pc-result-title">{s.title}</span>
                        <span className="tag">{s.category}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.applicable_certification_rules?.length > 0 && (
                  <div className="card">
                    <h4 className="pc-section-title"><ShieldCheck size={16} /> Certification Requirements</h4>
                    {result.applicable_certification_rules.map((r, i) => (
                      <div className="pc-result-block" key={i}>
                        <span className="pc-result-code">{r.title}</span>
                        <span className="pc-result-desc">{r.description}</span>
                        {r.compliance_requirements?.length > 0 && (
                          <ul className="pc-result-list">{r.compliance_requirements.slice(0, 3).map((req, j) => <li key={j}>{req}</li>)}</ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="pc-result-col">
                {result.related_bis_services?.length > 0 && (
                  <div className="card">
                    <h4 className="pc-section-title"><ArrowRight size={16} /> Related BIS Services</h4>
                    {result.related_bis_services.map((s, i) => (
                      <div className="pc-result-block" key={i}>
                        <span className="pc-result-code">{s.name}</span>
                        <span className="pc-result-desc">{s.description}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.next_steps?.length > 0 && (
                  <div className="card">
                    <h4 className="pc-section-title"><ChevronRight size={16} /> Suggested Next Steps</h4>
                    <ol className="pc-next-steps">{result.next_steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
                  </div>
                )}
                {result.missing_fields?.length > 0 && (
                  <div className="card">
                    <h4 className="pc-section-title"><Info size={16} /> Missing Information</h4>
                    <div className="pc-missing">{result.missing_fields.map((f, i) => <span className="tag" style={{ background: '#fef9c3', borderColor: '#fde68a', color: '#854d0e' }} key={i}>{f}</span>)}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card pc-disclaimer">
              <AlertTriangle size={16} />
              <div>
                <strong>Disclaimer</strong>
                <p>{result.disclaimer}</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button className="btn btn-accent" onClick={() => window.location.href = '/assistant'}>
                <MessageSquareText size={16} /> Ask AI for More Guidance
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pc-layout { display: flex; flex-direction: column; gap: 20px; }
        .pc-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 16px;
        }
        .pc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pc-form-actions { display: flex; gap: 12px; margin-top: 20px; }
        .pc-score-banner { display: flex; align-items: center; gap: 24px; padding: 24px; }
        .pc-score-left { flex-shrink: 0; }
        .pc-score-circle { position: relative; width: 110px; height: 110px; }
        .pc-score-circle svg { width: 100%; height: 100%; }
        .pc-score-num { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .pc-score-big { font-size: 1.75rem; font-weight: 800; display: block; line-height: 1; }
        .pc-score-sub { font-size: 0.6875rem; color: var(--gray-500); }
        .pc-score-right { flex: 1; }
        .pc-status-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: var(--radius-md);
          font-size: 0.9375rem; margin-bottom: 8px;
        }
        .pc-score-meta { font-size: 0.8125rem; color: var(--gray-500); margin-bottom: 6px; }
        .pc-detected { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .pc-results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pc-result-col { display: flex; flex-direction: column; gap: 16px; }
        .pc-result-row { display: flex; align-items: center; gap: 8px; padding: 10px 0; border-bottom: 1px solid var(--gray-100); font-size: 0.875rem; }
        .pc-result-row:last-child { border-bottom: none; }
        .pc-result-code { font-weight: 700; color: var(--primary-600); }
        .pc-result-title { color: var(--gray-700); flex: 1; }
        .pc-result-block { padding: 10px 0; border-bottom: 1px solid var(--gray-100); }
        .pc-result-block:last-child { border-bottom: none; }
        .pc-result-desc { display: block; font-size: 0.8125rem; color: var(--gray-500); margin-top: 4px; line-height: 1.5; }
        .pc-result-list { padding-left: 20px; font-size: 0.8125rem; color: var(--gray-600); margin-top: 6px; line-height: 1.7; }
        .pc-next-steps { padding-left: 20px; font-size: 0.875rem; color: var(--gray-700); line-height: 1.9; }
        .pc-missing { display: flex; flex-wrap: wrap; gap: 6px; }
        .pc-disclaimer {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 16px 18px; background: #fffbeb; border: 1px solid #fde68a;
          border-radius: var(--radius-lg); color: #92400e;
        }
        .pc-disclaimer strong { font-size: 0.8125rem; display: block; margin-bottom: 2px; }
        .pc-disclaimer p { font-size: 0.8125rem; line-height: 1.5; }

        @media (max-width: 768px) {
          .pc-form-grid { grid-template-columns: 1fr; }
          .pc-form-actions { flex-direction: column; }
          .pc-form-actions .btn { width: 100%; }
          .pc-score-banner { flex-direction: column; text-align: center; }
          .pc-results-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
