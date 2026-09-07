import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Copy, Trash2, Check, Loader2, AlertCircle, BookOpen, ArrowRight, Mic, MicOff, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'hi', label: 'हिन्दी', flag: 'HI' },
  { code: 'ta', label: 'தமிழ்', flag: 'TA' },
]

const SUGGESTED = {
  en: ["Which BIS requirements should I check for my product?", "What BIS certification is required?", "How do I search Indian Standards?", "What documents are required for certification?", "Explain hallmarking.", "How can a consumer file a complaint?"],
  hi: ["मेरे उत्पाद के लिए किन BIS आवश्यकताओं की जाँच करनी चाहिए?", "मेरे उत्पाद के लिए कौन सा BIS प्रमाणन आवश्यक है?", "मैं भारतीय मानकों की खोज कैसे करूँ?"],
  ta: ["என் தயாரிப்புக்கு எந்த BIS தேவைகளை சரிபார்க்க வேண்டும்?", "என் தயாரிப்புக்கு எந்த BIS சான்றிதழ் தேவை?", "இந்திய தரநிலைகளை எப்படி தேடுவது?"],
}

const PLACEHOLDER = { en: 'Type your question about Indian Standards...', hi: 'भारतीय मानकों के बारे में अपना प्रश्न टाइप करें...', ta: 'இந்திய தரநிலைகள் பற்றிய உங்கள் கேள்வியை டைப் செய்யுங்கள்...' }

export default function Assistant() {
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to **BIS Sahayak AI**! I can help you with:\n\n- Understanding Indian Standards and IS codes\n- BIS certification and registration requirements\n- Hallmarking of gold and silver\n- Product compliance guidance\n\nHow can I assist you today?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response || data.message || 'Response received.' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, the AI service is not available right now. Please try again later.' }])
    } finally { setLoading(false); inputRef.current?.focus() }
  }

  return (
    <div className="assistant-page">
      <div className="page-header" style={{ paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>AI Assistant</h1><p>Ask questions about Indian Standards and BIS certification</p></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="lang-selector">
              {LANGUAGES.map((l) => (<button key={l.code} className={`lang-btn ${language === l.code ? 'active' : ''}`} onClick={() => setLanguage(l.code)}>{l.flag}</button>))}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div className={`msg-avatar ${msg.role}`}>{msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}</div>
              <div className="msg-body">
                <div className="msg-header">
                  <span className="msg-role">{msg.role === 'assistant' ? 'BIS Sahayak AI' : 'You'}</span>
                  {msg.role === 'assistant' && i > 0 && (
                    <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(msg.content); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000) }}>
                      {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
                <div className={`msg-text ${msg.role}`}>{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg assistant">
              <div className="msg-avatar assistant"><Bot size={18} /></div>
              <div className="msg-body">
                <div className="msg-header"><span className="msg-role">BIS Sahayak AI</span></div>
                <div className="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="suggestions-overlay">
            <Sparkles size={16} style={{ color: 'var(--primary-400)' }} />
            <span className="suggestions-title">Suggested questions</span>
            <div className="suggestions-grid">
              {(SUGGESTED[language] || SUGGESTED.en).map((q, i) => (
                <button key={i} className="suggestion-card" onClick={() => handleSend(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-bar">
          <div className="chat-input-wrapper">
            <input ref={inputRef} className="chat-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder={PLACEHOLDER[language]} disabled={loading} />
            <button className="send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
              {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .assistant-page { height: calc(100vh - 4rem); display: flex; flex-direction: column; }
        .chat-container { flex: 1; display: flex; flex-direction: column; background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); overflow: hidden; min-height: 0; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .chat-msg { display: flex; gap: 0.75rem; max-width: 80%; }
        .chat-msg.user { align-self: flex-end; flex-direction: row-reverse; }
        .msg-avatar { width: 32px; height: 32px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .msg-avatar.assistant { background: var(--primary-100); color: var(--primary-500); }
        .msg-avatar.user { background: var(--gray-200); color: var(--gray-600); }
        .msg-body { min-width: 0; flex: 1; }
        .msg-header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.2rem; }
        .msg-role { font-size: 0.72rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.04em; }
        .copy-btn { background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 2px; border-radius: 4px; display: flex; align-items: center; }
        .copy-btn:hover { color: var(--primary-500); background: var(--gray-50); }
        .msg-text { font-size: 0.88rem; line-height: 1.65; white-space: pre-wrap; padding: 0.85rem 1rem; border-radius: var(--radius-md); }
        .msg-text.assistant { background: var(--gray-50); border: 1px solid var(--gray-100); }
        .msg-text.user { background: var(--primary-500); color: var(--white); }
        .typing-indicator { display: flex; gap: 4px; padding: 0.85rem 1rem; background: var(--gray-50); border: 1px solid var(--gray-100); border-radius: var(--radius-md); width: fit-content; }
        .typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: var(--gray-400); animation: typing 1.2s infinite ease-in-out; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%,60%,100% { opacity: 0.3; transform: scale(0.8); } 30% { opacity: 1; transform: scale(1); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .suggestions-overlay { padding: 0 1.5rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .suggestions-title { font-size: 0.8rem; color: var(--gray-500); font-weight: 500; }
        .suggestions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; width: 100%; }
        .suggestion-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 0.7rem 0.85rem; font-size: 0.8rem; color: var(--gray-700); text-align: left; cursor: pointer; transition: all 0.2s; }
        .suggestion-card:hover { border-color: var(--primary-300); background: var(--primary-50); color: var(--primary-600); }
        .chat-input-bar { padding: 0.85rem 1.25rem; border-top: 1px solid var(--gray-200); background: var(--white); }
        .chat-input-wrapper { display: flex; align-items: center; gap: 0.5rem; background: var(--gray-50); border: 1px solid var(--gray-300); border-radius: var(--radius-lg); padding: 0.35rem 0.5rem; }
        .chat-input-wrapper:focus-within { border-color: var(--primary-400); box-shadow: 0 0 0 3px rgba(30,86,184,0.08); }
        .chat-input { flex: 1; border: none; background: none; padding: 0.5rem; font-size: 0.9rem; outline: none; color: var(--gray-800); }
        .send-btn { background: var(--primary-500); color: var(--white); padding: 0.5rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .send-btn:hover { background: var(--primary-600); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .lang-selector { display: flex; gap: 0.15rem; background: var(--gray-100); border-radius: var(--radius-md); padding: 0.15rem; border: 1px solid var(--gray-200); }
        .lang-btn { padding: 0.3rem 0.55rem; border: none; border-radius: var(--radius-sm); font-size: 0.68rem; font-weight: 700; cursor: pointer; background: transparent; color: var(--gray-500); transition: all 0.15s; }
        .lang-btn:hover { color: var(--gray-700); background: var(--gray-200); }
        .lang-btn.active { background: var(--primary-500); color: var(--white); }
        @media (max-width: 768px) { .chat-msg { max-width: 95%; } .suggestions-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

function Sparkles(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
}
