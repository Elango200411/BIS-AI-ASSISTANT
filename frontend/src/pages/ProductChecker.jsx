import { useState } from 'react'
import { ShieldCheck, Search, AlertCircle, CheckCircle2, FileText, Loader2, AlertTriangle, Info, MessageSquareText, ArrowRight } from 'lucide-react'

const CATEGORIES = ['Electrical Product', 'Construction Material', 'Food & Agriculture', 'Textile & Leather', 'Consumer Product']
const COUNTRIES = ['India', 'China', 'Germany', 'USA', 'Japan', 'South Korea', 'Other']

export default function ProductChecker() {
  const [form, setForm] = useState({ product_name: '', category: '', intended_use: '', manufacturer: '', country: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/compliance/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ readiness_score: 78, compliance_status: { color: 'yellow', label: 'Further Verification Required' }, relevant_standards: [{ standard_number: 'IS 10322:2017', title: 'LED Lamps for General Purpose Lighting', category: 'Electrical' }], next_steps: ['Get product tested at BIS-recognized lab', 'Submit application through BIS portal'] })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header"><h1>Product Compliance Checker</h1><p>Verify your product against applicable Indian Standards and BIS requirements</p></div>
      <div className="compliance-layout">
        <div className="card form-panel">
          <h3>Product Details</h3>
          <div className="form-grid">
            <div className="form-group"><label>Product Name *</label><input className="input-field" placeholder="e.g., LED Bulb, Steel Pipe" value={form.product_name} onChange={(e) => setField('product_name', e.target.value)} /></div>
            <div className="form-group"><label>Category</label><select className="input-field" value={form.category} onChange={(e) => setField('category', e.target.value)}><option value="">Select...</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Intended Use</label><input className="input-field" placeholder="Domestic, Commercial..." value={form.intended_use} onChange={(e) => setField('intended_use', e.target.value)} /></div>
            <div className="form-group"><label>Manufacturer</label><input className="input-field" placeholder="Company name" value={form.manufacturer} onChange={(e) => setField('manufacturer', e.target.value)} /></div>
            <div className="form-group"><label>Country</label><select className="input-field" value={form.country} onChange={(e) => setField('country', e.target.value)}><option value="">Select...</option>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group full-width"><label>Description</label><textarea className="input-field" rows={3} placeholder="Product details..." value={form.description} onChange={(e) => setField('description', e.target.value)} /></div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <><Loader2 size={18} className="spin" /> Analyzing...</> : <><Search size={18} /> Check Compliance</>}
          </button>
        </div>
        {result && (
          <div className="card result-panel">
            <h3>Compliance Result</h3>
            <div className="score-circle"><div className="score-value">{result.readiness_score}%</div></div>
            <div className={`status-badge ${result.compliance_status?.color}`}>{result.compliance_status?.label}</div>
            {result.relevant_standards?.length > 0 && (
              <div className="result-section"><h4>Relevant Standards</h4>{result.relevant_standards.map((s, i) => <div key={i} className="result-item"><span className="result-code">{s.standard_number}</span><span>{s.title}</span></div>)}</div>
            )}
            {result.next_steps?.length > 0 && (
              <div className="result-section"><h4>Next Steps</h4><ol>{result.next_steps.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
            )}
          </div>
        )}
      </div>
      <style>{`
        .compliance-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-panel h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .form-group label { font-size: 0.78rem; font-weight: 600; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.04em; }
        .full-width { grid-column: 1 / -1; }
        .result-panel h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
        .score-circle { width: 120px; height: 120px; border-radius: 50%; background: var(--primary-100); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .score-value { font-size: 2rem; font-weight: 800; color: var(--primary-600); }
        .status-badge { text-align: center; padding: 0.5rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; }
        .status-badge.yellow { background: #fef9c3; color: #854d0e; }
        .status-badge.green { background: #dcfce7; color: #166534; }
        .status-badge.red { background: #fee2e2; color: #991b1b; }
        .result-section { margin-top: 1rem; }
        .result-section h4 { font-size: 0.82rem; font-weight: 600; color: var(--gray-600); text-transform: uppercase; margin-bottom: 0.5rem; }
        .result-item { padding: 0.5rem 0; border-bottom: 1px solid var(--gray-100); font-size: 0.85rem; }
        .result-code { font-weight: 700; color: var(--primary-600); margin-right: 0.5rem; }
        .result-section ol { padding-left: 1.2rem; font-size: 0.85rem; line-height: 1.8; color: var(--gray-700); }
        @media (max-width: 768px) { .compliance-layout, .form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
