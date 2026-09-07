import { useState } from 'react'
import { Search, FileText, ExternalLink, Loader2, AlertCircle } from 'lucide-react'

export default function StandardsSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(`http://localhost:8000/api/standards/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    } catch (err) { setError('Failed to search standards. Backend may be offline.') } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header"><h1>Indian Standards Search</h1><p>Browse and search the Bureau of Indian Standards database</p></div>
      <div className="search-bar-lg">
        <Search size={20} style={{ color: 'var(--gray-400)' }} />
        <input className="search-input" placeholder="Search by standard code, title, or keyword..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }} />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? <><Loader2 size={16} className="spin" /> Searching...</> : <><Search size={16} /> Search</>}
        </button>
      </div>
      {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}><Loader2 size={32} className="spin" /><p style={{ marginTop: '0.5rem' }}>Searching...</p></div>}
      {results && results.results?.length > 0 && (
        <div className="standards-list">
          {results.results.map((s, i) => (
            <div className="standard-item card" key={i}>
              <div className="std-icon"><FileText size={24} /></div>
              <div className="std-info">
                <span className="std-code">{s.standard_number}</span>
                <h4>{s.title}</h4>
                <p>{s.description}</p>
                <span className="badge badge-info">{s.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {results && results.results?.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '3rem' }}><Search size={40} style={{ color: 'var(--gray-300)' }} /><h3>No results found</h3><p style={{ color: 'var(--gray-500)' }}>Try a different keyword</p></div>}
      {!results && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Search size={48} style={{ color: 'var(--primary-300)' }} />
          <h3 style={{ marginTop: '1rem' }}>Search Indian Standards</h3>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Enter a keyword or standard number (e.g., IS 456)</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['cement', 'LED', 'steel', 'solar'].map((s) => <button key={s} className="badge badge-info" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem' }} onClick={() => setQuery(s)}>{s}</button>)}
          </div>
        </div>
      )}
      <style>{`
        .search-bar-lg { display: flex; align-items: center; gap: 0.75rem; background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 0.5rem 0.75rem; margin-bottom: 1.5rem; }
        .search-input { flex: 1; border: none; background: none; font-size: 0.95rem; padding: 0.5rem; outline: none; color: var(--gray-800); }
        .error-banner { display: flex; align-items: center; gap: 0.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-lg); color: #991b1b; font-size: 0.9rem; margin-bottom: 1rem; }
        .standards-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .standard-item { display: flex; gap: 1rem; align-items: flex-start; padding: 1.25rem; }
        .std-icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--primary-50); color: var(--primary-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .std-info { flex: 1; }
        .std-code { font-weight: 700; color: var(--primary-600); font-size: 0.9rem; }
        .std-info h4 { font-size: 0.88rem; margin-top: 0.15rem; }
        .std-info p { font-size: 0.8rem; color: var(--gray-500); margin-top: 0.25rem; line-height: 1.5; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
