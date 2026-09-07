import { useState, useEffect } from 'react'
import { Building2, ShieldCheck, Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

const SERVICES_MOCK = [
  { name: 'Product Certification (Scheme I)', description: 'ISI mark certification for mandatory BIS-certified products.', tag: 'ISI Mark' },
  { name: 'Compulsory Registration (CRS)', description: 'Mandatory registration for electronics and IT products.', tag: 'CRS' },
  { name: 'Hallmarking', description: 'Gold and silver hallmarking certification for purity verification.', tag: 'Gold/Silver' },
  { name: 'Laboratory Recognition', description: 'Recognition and accreditation of testing laboratories.', tag: 'Testing' },
  { name: 'Foreign Manufacturers Certification (FMCS)', description: 'BIS certification for foreign manufacturers exporting to India.', tag: 'International' },
  { name: 'Standardization', description: 'Development and harmonization of Indian Standards.', tag: 'Standards' },
]

export default function BISServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/services').then((r) => r.json()).then((d) => { setServices(d.results || SERVICES_MOCK) }).catch(() => { setServices(SERVICES_MOCK) }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-header"><h1>BIS Services</h1><p>Access Bureau of Indian Standards certification, registration, and standardization services</p></div>
      {loading ? <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 size={32} className="spin" style={{ color: 'var(--primary-500)' }} /><p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Loading services...</p></div> : (
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card card" key={i}>
              <div className="service-top"><div className="stat-icon blue"><ShieldCheck size={22} /></div><span className="badge badge-info">{s.tag || 'BIS'}</span></div>
              <h3>{s.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.description}</p>
              <div className="service-footer"><span className="service-status"><CheckCircle2 size={13} /> Available</span></div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; }
        .service-card { display: flex; flex-direction: column; gap: 0.6rem; }
        .service-top { display: flex; align-items: center; justify-content: space-between; }
        .service-card h3 { font-size: 0.95rem; font-weight: 600; }
        .service-footer { margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--gray-100); }
        .service-status { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: var(--success); font-weight: 600; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
