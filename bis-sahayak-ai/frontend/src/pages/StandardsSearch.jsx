import { useState } from 'react'
import { Search, FileText, ExternalLink, BookOpen, Tag, ArrowLeft, Loader2, AlertCircle, ShieldCheck, Info } from 'lucide-react'
import { searchStandards, getStandard } from '../services/api'
import { useApp } from '../context/AppContext'

export default function StandardsSearch() {
  const { addActivity } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true); setError(null); setSelected(null); setSearched(true)
    try {
      const data = await searchStandards(query)
      setResults(data)
      addActivity({ type: 'search', title: `Searched standards: "${query}"` })
    } catch (err) { setError(err.message); setResults(null) } finally { setLoading(false) }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleViewDetail = async (standardId) => {
    setDetailLoading(true); setDetailError(null)
    try { setSelected(await getStandard(standardId)) }
    catch (err) { setDetailError(err.message) } finally { setDetailLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Indian Standards Search</h1>
        <p>Browse and search the Bureau of Indian Standards database</p>
      </div>

      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <Search size={20} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
        <input
          placeholder="Search by standard code, title, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {selected && (
        <div className="card ss-detail" style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Back to results
          </button>
          <div className="ss-detail-header">
            <div className="ss-detail-icon"><FileText size={28} /></div>
            <div>
              <span className="ss-detail-code">{selected.standard_number}</span>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '2px' }}>{selected.title}</h2>
            </div>
          </div>
          <div className="ss-detail-grid">
            <div><h4 className="ss-detail-label"><Info size={14} /> Description</h4><p>{selected.description}</p></div>
            <div><h4 className="ss-detail-label"><ShieldCheck size={14} /> Applicability</h4><p>{selected.applicability}</p></div>
            <div><h4 className="ss-detail-label"><Tag size={14} /> Category</h4><p>{selected.category}</p></div>
            <div><h4 className="ss-detail-label"><BookOpen size={14} /> Related BIS Service</h4><p>{selected.related_service}</p></div>
          </div>
          {selected.keywords?.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <h4 className="ss-detail-label" style={{ marginBottom: '8px' }}>Keywords</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selected.keywords.map((kw, i) => <span className="tag" key={i}>{kw}</span>)}
              </div>
            </div>
          )}
          {selected.source && <div className="ss-detail-source">Source: {selected.source}</div>}
        </div>
      )}

      {detailLoading && (
        <div className="loading-state card" style={{ marginBottom: '16px' }}>
          <div className="spinner" /><p>Loading standard details...</p>
        </div>
      )}

      {detailError && <div className="error-banner" style={{ marginBottom: '16px' }}><AlertCircle size={18} /> {detailError}</div>}

      {!selected && !detailLoading && (
        <>
          {loading && <div className="loading-state"><div className="spinner" /><p>Searching standards database...</p></div>}

          {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}

          {!loading && !error && searched && results && (
            <>
              <div className="ss-results-header">
                <h3>{results.count === 0 ? 'No standards found' : `${results.count} standard${results.count !== 1 ? 's' : ''} found`}</h3>
                <span className="ss-results-meta"><BookOpen size={14} /> Query: "{results.query}"</span>
              </div>

              {results.count === 0 && (
                <div className="empty-state card">
                  <Search size={40} style={{ color: 'var(--gray-300)' }} />
                  <h3>No matching standards</h3>
                  <p>Try a different keyword like <strong>cement</strong>, <strong>LED</strong>, <strong>steel</strong>, or a standard number like <strong>IS 456</strong></p>
                </div>
              )}

              <div className="ss-list">
                {results.results.map((s) => (
                  <div className="ss-item card" key={s.standard_id}>
                    <div className="ss-item-icon"><FileText size={22} /></div>
                    <div className="ss-item-info">
                      <div className="ss-item-meta">
                        <span className="ss-item-code">{s.standard_number}</span>
                        <span className="badge badge-success">Current</span>
                      </div>
                      <h4 className="ss-item-title">{s.title}</h4>
                      <p className="ss-item-desc">{s.description}</p>
                      <div className="ss-item-tags">
                        <span className="tag"><Tag size={11} /> {s.category}</span>
                        {s.related_service && <span className="tag"><ShieldCheck size={11} /> {s.related_service}</span>}
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => handleViewDetail(s.standard_id)} style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '4px' }}>
                      <ExternalLink size={14} /> Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {!searched && (
            <div className="empty-state card">
              <Search size={48} style={{ color: 'var(--primary-300)' }} />
              <h3>Search Indian Standards</h3>
              <p>Enter a keyword, standard number (e.g., IS 456), or topic to search the BIS database.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Try:</span>
                {['cement', 'LED', 'steel', 'solar', 'toys', 'concrete'].map((s) => (
                  <button key={s} className="tag" style={{ cursor: 'pointer', border: '1px solid var(--primary-200)', background: 'var(--primary-50)', color: 'var(--primary-600)' }} onClick={() => setQuery(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .ss-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .ss-results-header h3 { font-size: 1rem; font-weight: 600; color: var(--gray-700); }
        .ss-results-meta { display: flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--gray-500); }
        .ss-list { display: flex; flex-direction: column; gap: 12px; }
        .ss-item { display: flex; align-items: flex-start; gap: 16px; padding: 20px; }
        .ss-item-icon {
          width: 44px; height: 44px; border-radius: var(--radius-md);
          background: var(--primary-50); color: var(--primary-500);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ss-item-info { flex: 1; min-width: 0; }
        .ss-item-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .ss-item-code { font-weight: 700; color: var(--primary-600); font-size: 0.9375rem; }
        .ss-item-title { font-size: 0.9375rem; color: var(--gray-700); margin-bottom: 4px; font-weight: 600; }
        .ss-item-desc { font-size: 0.8125rem; color: var(--gray-500); line-height: 1.5; margin-bottom: 8px; }
        .ss-item-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .ss-detail-header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
        .ss-detail-icon {
          width: 52px; height: 52px; border-radius: var(--radius-md);
          background: var(--primary-100); color: var(--primary-500);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ss-detail-code { font-weight: 700; color: var(--primary-600); font-size: 1rem; }
        .ss-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .ss-detail-label { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
        .ss-detail-grid p { font-size: 0.9375rem; color: var(--gray-700); line-height: 1.6; }
        .ss-detail-source { font-size: 0.75rem; color: var(--gray-400); padding-top: 12px; border-top: 1px solid var(--gray-100); }

        @media (max-width: 768px) {
          .ss-item { flex-direction: column; }
          .ss-item .btn { width: 100%; justify-content: center; }
          .ss-detail-grid { grid-template-columns: 1fr; }
          .ss-results-header { flex-direction: column; align-items: flex-start; gap: 4px; }
        }
      `}</style>
    </div>
  )
}
