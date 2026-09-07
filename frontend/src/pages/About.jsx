import { ShieldCheck, Users, Target, Zap, BookOpen, Mail, ExternalLink } from 'lucide-react'

export default function About() {
  return (
    <div>
      <div className="page-header"><h1>About BIS Sahayak AI</h1><p>AI-powered Intelligent Assistant for Indian Standards and BIS Services</p></div>
      <div className="about-hero">
        <div className="about-brand"><div className="about-icon"><ShieldCheck size={32} /></div><div><h2>BIS Sahayak AI</h2><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Your Intelligent Assistant for Indian Standards & BIS Services</p></div></div>
        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '800px' }}>BIS Sahayak AI is an intelligent assistant designed to help industries and consumers navigate the complex landscape of Indian Standards and Bureau of Indian Standards (BIS) services.</p>
      </div>
      <div className="mission-grid">
        {[{ icon: Target, title: 'Our Mission', desc: 'To democratize access to Indian Standards information and make BIS compliance simple, transparent, and accessible.', color: 'var(--primary-500)' }, { icon: Zap, title: 'Technology', desc: 'Built on advanced RAG pipelines, vector databases, and large language models trained on official BIS documentation.', color: 'var(--accent-500)' }, { icon: Users, title: 'For Everyone', desc: 'Designed for manufacturers, importers, quality engineers, legal teams, and consumers.', color: 'var(--success)' }].map((m) => (
          <div className="card mission-card" key={m.title}><m.icon size={28} style={{ color: m.color }} /><h3>{m.title}</h3><p>{m.desc}</p></div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}><BookOpen size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Key Features</h3>
        <div className="features-grid">
          {['AI-powered chat for natural language queries', 'Product compliance checking', 'Full-text search of Indian Standards', 'BIS certification guidance', 'Multilingual support (English & Hindi)', 'Real-time BIS updates'].map((f, i) => (
            <div className="feature-item" key={i}><div className="feature-check"><Zap size={14} /></div><span>{f}</span></div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Technology Stack</h3>
        <div className="tech-grid">
          {[{ l: 'Frontend', t: 'React + Vite' }, { l: 'Backend', t: 'FastAPI (Python)' }, { l: 'AI Engine', t: 'LLM + RAG Pipeline' }, { l: 'Data Source', t: 'BIS Official Standards' }].map((t) => (
            <div className="tech-item" key={t.l}><span className="tech-label">{t.l}</span><span className="tech-value">{t.t}</span></div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Team & Acknowledgements</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>Built with dedication for Smart India Hackathon 2025.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><ExternalLink size={14} /> BIS Official Website</a>
          <button className="btn btn-outline btn-sm"><Mail size={14} /> Contact Us</button>
        </div>
      </div>
      <style>{`
        .about-hero { background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%); border-radius: var(--radius-xl); padding: 2.5rem; color: var(--white); margin-bottom: 1.5rem; }
        .about-brand { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .about-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; }
        .about-brand h2 { font-size: 1.5rem; font-weight: 700; }
        .mission-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; }
        .mission-card { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start; }
        .mission-card h3 { font-size: 1rem; font-weight: 600; }
        .mission-card p { font-size: 0.82rem; color: var(--gray-500); line-height: 1.5; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
        .feature-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--gray-700); }
        .feature-check { width: 22px; height: 22px; border-radius: 50%; background: var(--primary-100); color: var(--primary-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
        .tech-item { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 0.85rem 1rem; text-align: center; }
        .tech-label { display: block; font-size: 0.7rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem; }
        .tech-value { font-size: 0.88rem; font-weight: 600; color: var(--gray-800); }
        @media (max-width: 768px) { .features-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
