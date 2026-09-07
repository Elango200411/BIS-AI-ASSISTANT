import { CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react'

const complianceItems = [
  { product: 'LED Bulbs (CRS)', standard: 'IS 10322:2017', status: 'compliant', lastChecked: '2 days ago', score: 100 },
  { product: 'Electric Iron (CRS)', standard: 'IS 302-2-3:2011', status: 'compliant', lastChecked: '1 week ago', score: 95 },
  { product: 'Steel Bars (BIS)', standard: 'IS 1786:2008', status: 'warning', lastChecked: '3 days ago', score: 78 },
  { product: 'Cement (BIS)', standard: 'IS 12269:2013', status: 'compliant', lastChecked: '5 days ago', score: 100 },
  { product: 'Water Heater (BIS)', standard: 'IS 2065:1998', status: 'non-compliant', lastChecked: '1 day ago', score: 42 },
  { product: 'Toys (CRS)', standard: 'IS 9873:2018', status: 'pending', lastChecked: 'Not checked', score: 0 },
]

export default function Compliance() {
  return (
    <div>
      <div className="page-header"><h1>Compliance Dashboard</h1><p>Track your product compliance status across all Indian Standards</p></div>
      <div className="compliance-overview">
        <div className="card score-card">
          <div className="score-circle"><span className="score-num">79</span><span className="score-label">/ 100</span></div>
          <div><h3>Overall Compliance Score</h3><p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Based on {complianceItems.length} products</p></div>
        </div>
        <div className="overview-stats">
          {[{ count: 3, label: 'Compliant', icon: CheckCircle2, color: 'green' }, { count: 1, label: 'Needs Review', icon: AlertCircle, color: 'yellow' }, { count: 1, label: 'Non-Compliant', icon: AlertCircle, color: 'red' }, { count: 1, label: 'Pending', icon: Clock, color: 'gray' }].map((s) => (
            <div className="overview-stat" key={s.label}><div className={`ov-icon ${s.color}`}><s.icon size={20} /></div><div><strong>{s.count}</strong><span>{s.label}</span></div></div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header"><h3><FileText size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Product Compliance Details</h3></div>
        <div style={{ overflowX: 'auto' }}>
          <div className="table-header"><span>Product</span><span>Standard</span><span>Status</span><span>Score</span><span>Last Checked</span></div>
          {complianceItems.map((item, i) => (
            <div className="table-row" key={i}>
              <span className="col-product">{item.product}</span>
              <span className="col-standard">{item.standard}</span>
              <span><span className={`badge badge-${item.status === 'compliant' ? 'success' : item.status === 'warning' ? 'warning' : item.status === 'non-compliant' ? 'danger' : 'info'}`}>{item.status.replace('-', ' ')}</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '60px', height: '6px', background: 'var(--gray-100)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${item.score}%`, height: '100%', background: item.score >= 90 ? 'var(--success)' : item.score >= 70 ? 'var(--warning)' : 'var(--danger)', borderRadius: '3px' }} /></div><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.score || '—'}</span></span>
              <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{item.lastChecked}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .compliance-overview { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .score-card { display: flex; align-items: center; gap: 1.5rem; padding: 2rem; }
        .score-circle { width: 100px; height: 100px; border-radius: 50%; background: var(--primary-100); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
        .score-num { font-size: 1.75rem; font-weight: 800; color: var(--gray-900); line-height: 1; }
        .score-label { font-size: 0.7rem; color: var(--gray-500); }
        .overview-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .overview-stat { display: flex; align-items: center; gap: 0.75rem; background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 1rem; }
        .ov-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ov-icon.green { background: #dcfce7; color: var(--success); }
        .ov-icon.yellow { background: #fef9c3; color: #ca8a04; }
        .ov-icon.red { background: #fee2e2; color: var(--danger); }
        .ov-icon.gray { background: var(--gray-100); color: var(--gray-500); }
        .overview-stat strong { font-size: 1.1rem; display: block; }
        .overview-stat span { font-size: 0.75rem; color: var(--gray-500); }
        .table-header, .table-row { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr 0.8fr; gap: 1rem; align-items: center; padding: 0.75rem 0.5rem; }
        .table-header { font-size: 0.72rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; border-bottom: 2px solid var(--gray-200); }
        .table-row { border-bottom: 1px solid var(--gray-100); font-size: 0.85rem; }
        .col-product { font-weight: 600; }
        .col-standard { color: var(--primary-600); font-weight: 600; font-size: 0.82rem; }
        @media (max-width: 768px) { .compliance-overview { grid-template-columns: 1fr; } .score-card { flex-direction: column; text-align: center; } }
      `}</style>
    </div>
  )
}
