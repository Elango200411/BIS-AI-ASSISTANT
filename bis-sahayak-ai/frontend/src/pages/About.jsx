import { ShieldCheck, Users, Target, Zap, BookOpen, Mail, ExternalLink } from 'lucide-react'

export default function About() {
  return (
    <div>
      <div className="page-header">
        <h1>About BIS AI ASSISTANT</h1>
        <p>AI-powered Intelligent Assistant for Indian Standards and BIS Services</p>
      </div>

      <div className="about-hero">
        <div className="about-hero-content">
          <div className="about-brand">
            <div className="about-brand-icon"><ShieldCheck size={32} /></div>
            <div>
              <h2>BIS AI ASSISTANT</h2>
              <p>Your Intelligent Assistant for Indian Standards & BIS Services</p>
            </div>
          </div>
          <p className="about-desc">
            BIS AI ASSISTANT is an intelligent assistant designed to help industries and consumers
            navigate the complex landscape of Indian Standards and Bureau of Indian Standards (BIS)
            services. Leveraging advanced AI and retrieval-augmented generation (RAG) technology,
            it provides instant, accurate answers to queries about IS codes, certification processes,
            compliance requirements, and more.
          </p>
        </div>
      </div>

      <div className="about-mission-grid">
        {[
          { icon: Target, title: 'Our Mission', desc: 'To democratize access to Indian Standards information and make BIS compliance simple, transparent, and accessible for every industry and consumer in India.', color: 'var(--primary-500)' },
          { icon: Zap, title: 'Technology', desc: 'Built on advanced RAG (Retrieval-Augmented Generation) pipelines, vector databases, and large language models trained on official BIS documentation.', color: 'var(--accent-500)' },
          { icon: Users, title: 'For Everyone', desc: 'Designed for manufacturers, importers, quality engineers, legal teams, and consumers who need reliable information about Indian Standards.', color: 'var(--success)' },
        ].map((item) => (
          <div className="card about-mission-card" key={item.title}>
            <item.icon size={28} style={{ color: item.color }} />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 className="about-section-title"><BookOpen size={18} /> Key Features</h3>
        <div className="about-features-grid">
          {[
            'AI-powered chat for natural language queries on IS codes',
            'Product compliance checking against applicable standards',
            'Full-text search of Indian Standards database',
            'BIS certification guidance (Scheme I, CRS, FMCS)',
            'Hallmarking information and centre locator',
            'Multilingual support (English & Hindi)',
            'Real-time updates on BIS circulars and notifications',
            'Document upload and analysis capabilities',
          ].map((feat, i) => (
            <div className="about-feature-item" key={i}>
              <div className="about-feature-check"><Zap size={14} /></div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 className="about-section-title">Technology Stack</h3>
        <div className="about-tech-grid">
          {[
            { label: 'Frontend', tech: 'React + Vite' },
            { label: 'Backend', tech: 'FastAPI (Python)' },
            { label: 'AI Engine', tech: 'LLM + RAG Pipeline' },
            { label: 'Vector DB', tech: 'ChromaDB / FAISS' },
            { label: 'Embeddings', tech: 'OpenAI / Sentence Transformers' },
            { label: 'Data Source', tech: 'BIS Official Standards Catalog' },
          ].map((t) => (
            <div className="about-tech-item" key={t.label}>
              <span className="about-tech-label">{t.label}</span>
              <span className="about-tech-value">{t.tech}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 className="about-section-title">Team & Acknowledgements</h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', marginBottom: '16px', lineHeight: 1.6 }}>
          Built with dedication for Smart India Hackathon 2025. We acknowledge the Bureau of Indian Standards for their
          comprehensive public documentation that powers this assistant.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            <ExternalLink size={14} /> BIS Official Website
          </a>
          <a href="https://www.bis.gov.in/standards" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            <ExternalLink size={14} /> BIS Standards Portal
          </a>
          <button className="btn btn-outline btn-sm"><Mail size={14} /> Contact Us</button>
        </div>
      </div>

      <style>{`
        .about-hero {
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%);
          border-radius: var(--radius-xl); padding: 32px; color: var(--white); margin-bottom: 20px;
        }
        .about-brand { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .about-brand-icon {
          width: 56px; height: 56px; background: rgba(255,255,255,0.15);
          border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center;
        }
        .about-brand h2 { font-size: 1.5rem; font-weight: 700; }
        .about-brand p { font-size: 0.875rem; color: rgba(255,255,255,0.8); margin-top: 2px; }
        .about-desc { font-size: 0.9375rem; color: rgba(255,255,255,0.85); line-height: 1.7; max-width: 800px; }

        .about-mission-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .about-mission-card { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .about-mission-card h3 { font-size: 1rem; font-weight: 600; }
        .about-mission-card p { font-size: 0.8125rem; color: var(--gray-500); line-height: 1.5; }

        .about-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 16px;
        }
        .about-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .about-feature-item { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--gray-700); }
        .about-feature-check {
          width: 24px; height: 24px; border-radius: 50%; background: var(--primary-100);
          color: var(--primary-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .about-tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .about-tech-item {
          background: var(--gray-50); border: 1px solid var(--gray-200);
          border-radius: var(--radius-md); padding: 14px 16px; text-align: center;
        }
        .about-tech-label {
          display: block; font-size: 0.6875rem; font-weight: 700; color: var(--gray-500);
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;
        }
        .about-tech-value { font-size: 0.9375rem; font-weight: 600; color: var(--gray-800); }

        @media (max-width: 768px) {
          .about-hero { padding: 24px; }
          .about-mission-grid { grid-template-columns: 1fr; }
          .about-features-grid { grid-template-columns: 1fr; }
          .about-tech-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
