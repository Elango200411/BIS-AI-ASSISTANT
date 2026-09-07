import { CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react'

const complianceItems = [
  { product: 'LED Bulbs (CRS)', standard: 'IS 10322:2017', status: 'compliant', lastChecked: '2 days ago', score: 100 },
  { product: 'Electric Iron (CRS)', standard: 'IS 302-2-3:2011', status: 'compliant', lastChecked: '1 week ago', score: 95 },
  { product: 'Steel Bars (BIS)', standard: 'IS 1786:2008', status: 'warning', lastChecked: '3 days ago', score: 78 },
  { product: 'Cement (BIS)', standard: 'IS 12269:2013', status: 'compliant', lastChecked: '5 days ago', score: 100 },
  { product: 'Water Heater (BIS)', standard: 'IS 2065:1998', status: 'non-compliant', lastChecked: '1 day ago', score: 42 },
  { product: 'Toys (CRS)', standard: 'IS 9873:2018', status: 'pending', lastChecked: 'Not checked', score: 0 },
]

const overallScore = 79

export default function Compliance() {
  return (
    <div>
      <div className="page-header">
        <h1>Compliance Dashboard</h1>
        <p>Track your product compliance status across all Indian Standards and BIS schemes</p>
      </div>

      <div className="comp-overview">
        <div className="card comp-score-card">
          <div className="comp-score-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--primary-500)" strokeWidth="8"
                strokeDasharray={`${(overallScore / 100) * 326.7} 326.7`}
                strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div className="comp-score-value">
              <span className="comp-score-num">{overallScore}</span>
              <span className="comp-score-label">/ 100</span>
            </div>
          </div>
          <div className="comp-score-info">
            <h3>Overall Compliance Score</h3>
            <p>Based on {complianceItems.length} products checked</p>
          </div>
        </div>

        <div className="comp-stats-grid">
          {[
            { count: 3, label: 'Compliant', icon: CheckCircle2, colorClass: 'green' },
            { count: 1, label: 'Needs Review', icon: AlertCircle, colorClass: 'yellow' },
            { count: 1, label: 'Non-Compliant', icon: AlertCircle, colorClass: 'red' },
            { count: 1, label: 'Pending', icon: Clock, colorClass: 'gray' },
          ].map((s) => (
            <div className="comp-stat-item" key={s.label}>
              <div className={`comp-stat-icon ${s.colorClass}`}><s.icon size={20} /></div>
              <div><strong>{s.count}</strong><span>{s.label}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3><FileText size={18} /> Product Compliance Details</h3>
        </div>
        <div className="comp-table">
          <div className="comp-table-header">
            <span className="comp-col-product">Product</span>
            <span className="comp-col-standard">Standard</span>
            <span className="comp-col-status">Status</span>
            <span className="comp-col-score">Score</span>
            <span className="comp-col-checked">Last Checked</span>
          </div>
          {complianceItems.map((item, i) => (
            <div className="comp-table-row" key={i}>
              <span className="comp-col-product">{item.product}</span>
              <span className="comp-col-standard">{item.standard}</span>
              <span className="comp-col-status">
                <span className={`badge badge-${item.status === 'compliant' ? 'success' : item.status === 'warning' ? 'warning' : item.status === 'non-compliant' ? 'danger' : 'info'}`}>
                  {item.status.replace('-', ' ')}
                </span>
              </span>
              <span className="comp-col-score">
                <div className="comp-bar-wrap">
                  <div className="comp-bar" style={{
                    width: item.score + '%',
                    background: item.score >= 90 ? 'var(--success)' : item.score >= 70 ? 'var(--warning)' : item.score > 0 ? 'var(--danger)' : 'var(--gray-300)',
                  }} />
                </div>
                <span className="comp-bar-text">{item.score || '—'}</span>
              </span>
              <span className="comp-col-checked">{item.lastChecked}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .comp-overview { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .comp-score-card { display: flex; align-items: center; gap: 24px; padding: 28px; }
        .comp-score-circle { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
        .comp-score-circle svg { width: 100%; height: 100%; }
        .comp-score-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
        .comp-score-num { font-size: 1.75rem; font-weight: 800; color: var(--gray-900); display: block; line-height: 1; }
        .comp-score-label { font-size: 0.6875rem; color: var(--gray-500); }
        .comp-score-info h3 { font-size: 1rem; font-weight: 600; }
        .comp-score-info p { font-size: 0.8125rem; color: var(--gray-500); margin-top: 4px; }

        .comp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .comp-stat-item {
          display: flex; align-items: center; gap: 12px;
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius-md); padding: 14px;
        }
        .comp-stat-icon {
          width: 40px; height: 40px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .comp-stat-icon.green { background: var(--success-light); color: var(--success); }
        .comp-stat-icon.yellow { background: var(--warning-light); color: var(--warning); }
        .comp-stat-icon.red { background: var(--danger-light); color: var(--danger); }
        .comp-stat-icon.gray { background: var(--gray-100); color: var(--gray-500); }
        .comp-stat-item strong { font-size: 1.125rem; display: block; }
        .comp-stat-item span { font-size: 0.75rem; color: var(--gray-500); }

        .comp-table { overflow-x: auto; }
        .comp-table-header, .comp-table-row {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr 0.8fr;
          gap: 16px; align-items: center; padding: 12px 8px;
        }
        .comp-table-header {
          font-size: 0.6875rem; font-weight: 700; color: var(--gray-500);
          text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--gray-200);
        }
        .comp-table-row { border-bottom: 1px solid var(--gray-100); font-size: 0.875rem; }
        .comp-table-row:last-child { border-bottom: none; }
        .comp-col-product { font-weight: 600; color: var(--gray-800); }
        .comp-col-standard { color: var(--primary-600); font-weight: 600; font-size: 0.8125rem; }
        .comp-col-checked { font-size: 0.8125rem; color: var(--gray-500); }
        .comp-bar-wrap { width: 80px; height: 6px; background: var(--gray-100); border-radius: 3px; overflow: hidden; }
        .comp-bar { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .comp-bar-text { font-size: 0.8125rem; font-weight: 600; margin-left: 8px; color: var(--gray-700); }

        @media (max-width: 768px) {
          .comp-overview { grid-template-columns: 1fr; }
          .comp-score-card { flex-direction: column; text-align: center; }
          .comp-table-header, .comp-table-row { grid-template-columns: 1fr 1fr; gap: 8px; }
          .comp-col-standard, .comp-col-checked, .comp-col-score { display: none; }
        }
      `}</style>
    </div>
  )
}
