import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Bot, User, Sparkles, Copy, Trash2, Check,
  Loader2, AlertCircle, BookOpen, ArrowRight, ChevronDown, ChevronRight,
  Target, Database, Layers, Cpu, FileText, Mic, MicOff,
} from 'lucide-react'
import { sendChat } from '../services/api'
import { useApp } from '../context/AppContext'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'hi', label: 'हिन्दी', flag: 'HI' },
  { code: 'ta', label: 'தமிழ்', flag: 'TA' },
]

const SUGGESTED = {
  en: [
    "Which BIS requirements should I check for my product?",
    "What BIS certification is required for my product?",
    "How do I search Indian Standards?",
    "What documents are required for certification?",
    "Explain hallmarking.",
    "How can a consumer file a complaint?",
  ],
  hi: [
    "मेरे उत्पाद के लिए किन BIS आवश्यकताओं की जाँच करनी चाहिए?",
    "मेरे उत्पाद के लिए कौन सा BIS प्रमाणन आवश्यक है?",
    "मैं भारतीय मानकों की खोज कैसे करूँ?",
    "प्रमाणन के लिए किन दस्तावेजों की आवश्यकता है?",
    "हॉलमार्किंग समझाइए।",
    "उपभोक्ता शिकायत कैसे दर्ज करें?",
  ],
  ta: [
    "என் தயாரிப்புக்கு எந்த BIS தேவைகளை சரிபார்க்க வேண்டும்?",
    "என் தயாரிப்புக்கு எந்த BIS சான்றிதழ் தேவை?",
    "இந்திய தரநிலைகளை எப்படி தேடுவது?",
    "சான்றிதழுக்கு எந்த ஆவணங்கள் தேவை?",
    "முத்திரையிடலை விளக்குங்கள்.",
    "நுகர்வோர் புகாரை எப்படி தாக்கல் செய்வது?",
  ],
}

const PLACEHOLDER = {
  en: 'Type your question about Indian Standards...',
  hi: 'भारतीय मानकों के बारे में अपना प्रश्न टाइप करें...',
  ta: 'இந்திய தரநிலைகள் பற்றிய உங்கள் கேள்வியை டைப் செய்யுங்கள்...',
}

const UI_TEXT = {
  en: {
    title: 'AI Assistant',
    subtitle: 'Ask questions about Indian Standards, BIS certification, and compliance',
    clear: 'Clear',
    suggested: 'Suggested questions',
    traceToggle: 'How this answer was generated',
    userIntent: 'User Intent',
    retrievedKnowledge: 'Retrieved Knowledge',
    matchedSources: 'Matched Sources',
    responseMethod: 'Response Method',
    bisLabel: 'BIS AI ASSISTANT',
    youLabel: 'You',
    micUnsupported: 'Speech recognition not supported in this browser',
    micListening: 'Listening...',
    micError: 'Voice input error. Please try again.',
    records: 'records',
    sourceTypes: 'source types',
  },
  hi: {
    title: 'AI सहायक',
    subtitle: 'भारतीय मानकों, BIS प्रमाणन और अनुपालन के बारे में प्रश्न पूछें',
    clear: 'साफ करें',
    suggested: 'सुझाए गए प्रश्न',
    traceToggle: 'इस उत्तर को कैसे तैयार किया गया',
    userIntent: 'उपयोगकर्ता इरादा',
    retrievedKnowledge: 'प्राप्त ज्ञान',
    matchedSources: 'मिलान स्रोत',
    responseMethod: 'प्रतिक्रिया विधि',
    bisLabel: 'BIS सहायक AI',
    youLabel: 'आप',
    micUnsupported: 'इस ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है',
    micListening: 'सुन रहा हूँ...',
    micError: 'वॉइस इनपुट त्रुटि। कृपया पुनः प्रयास करें।',
    records: 'रिकॉर्ड',
    sourceTypes: 'स्रोत प्रकार',
  },
  ta: {
    title: 'AI உதவியாளர்',
    subtitle: 'இந்திய தரநிலைகள், BIS சான்றிதழ் மற்றும் இணக்கம் பற்றி கேள்விகள் கேளுங்கள்',
    clear: 'அழி',
    suggested: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
    traceToggle: 'இந்த பதில் எப்படி உருவாக்கப்பட்டது',
    userIntent: 'பயனர் நோக்கம்',
    retrievedKnowledge: 'பெறப்பட்ட அறிவு',
    matchedSources: 'பொருந்திய மூலங்கள்',
    responseMethod: 'பதில் முறை',
    bisLabel: 'BIS சகாய் AI',
    youLabel: 'நீங்கள்',
    micUnsupported: 'இந்த உலாவியில் குரல் அறிவு ஆதரிக்கப்படவில்லை',
    micListening: 'கேட்டுக்கொண்டிருக்கிறது...',
    micError: 'குரல் உள்ளீடு பிழை. மீண்டும் முயற்சிக்கவும்.',
    records: 'பதிவுகள்',
    sourceTypes: 'மூல வகைகள்',
  },
}

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

function getSpeechRecognition() {
  const w = typeof window !== 'undefined' ? window : null
  return w?.SpeechRecognition || w?.webkitSpeechRecognition || null
}

export default function Assistant() {
  const { language: appLang, setLanguage: setAppLang, addActivity, incrementQuestions } = useApp()
  const [language, setLanguageState] = useState(appLang)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to **BIS AI ASSISTANT**! I can help you with:\n\n- Understanding Indian Standards and IS codes\n- BIS certification and registration requirements\n- Hallmarking of gold and silver\n- Product compliance guidance\n- Consumer complaint filing\n\nHow can I assist you today?",
      sources: [],
      suggested: [],
      traceability: null,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [expandedTrace, setExpandedTrace] = useState({})
  const [isListening, setIsListening] = useState(false)
  const [speechSupported] = useState(() => !!getSpeechRecognition())
  const [micError, setMicError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const ui = UI_TEXT[language] || UI_TEXT.en
  const suggestedQs = SUGGESTED[language] || SUGGESTED.en
  const placeholder = PLACEHOLDER[language] || PLACEHOLDER.en

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg = { role: 'user', content: msg }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setMicError(null)

    try {
      const data = await sendChat(msg, 'consumer', language)
      incrementQuestions()
      addActivity({ type: 'chat', title: msg.length > 60 ? msg.substring(0, 60) + '...' : msg })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          sources: data.sources || [],
          suggested: data.suggested_questions || [],
          disclaimer: data.disclaimer,
          traceability: data.traceability || null,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
          sources: [],
          suggested: [],
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, language])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([messages[0]])
    setInput('')
  }

  const copyResponse = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const toggleMic = () => {
    if (!speechSupported) {
      setMicError(ui.micUnsupported)
      setTimeout(() => setMicError(null), 3000)
      return
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }
    const SpeechRecognition = getSpeechRecognition()
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    const langMap = { en: 'en-US', hi: 'hi-IN', ta: 'ta-IN' }
    recognition.lang = langMap[language] || 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => { setIsListening(true); setMicError(null) }
    recognition.onresult = (event) => { setInput(event.results[0][0].transcript); setIsListening(false) }
    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error !== 'no-speech') { setMicError(ui.micError); setTimeout(() => setMicError(null), 3000) }
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const toggleLang = (code) => { setLanguageState(code); setAppLang(code) }

  return (
    <div className="assistant-root">
      <div className="page-header" style={{ paddingBottom: '12px' }}>
        <div className="assistant-header-row">
          <div>
            <h1>{ui.title}</h1>
            <p>{ui.subtitle}</p>
          </div>
          <div className="assistant-header-actions">
            <div className="lang-selector">
              {LANGUAGES.map((l) => (
                <button key={l.code} className={`lang-btn ${language === l.code ? 'active' : ''}`} onClick={() => toggleLang(l.code)} title={l.label}>
                  {l.flag}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={clearChat} title={ui.clear}>
              <Trash2 size={14} /> {ui.clear}
            </button>
          </div>
        </div>
      </div>

      <div className="assistant-chat-container">
        <div className="assistant-chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`assistant-msg ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="assistant-msg-avatar bot"><Bot size={18} /></div>
              )}
              <div className="assistant-msg-content">
                <div className="assistant-msg-header">
                  <span className="assistant-msg-role">{msg.role === 'assistant' ? ui.bisLabel : ui.youLabel}</span>
                  {msg.role === 'assistant' && i > 0 && (
                    <button className="assistant-copy-btn" onClick={() => copyResponse(msg.content, i)} title="Copy">
                      {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
                <div className={`assistant-msg-text ${msg.role}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />

                {msg.sources && msg.sources.length > 0 && (
                  <div className="assistant-msg-sources">
                    <BookOpen size={12} />
                    {msg.sources.map((s, j) => (
                      <span className="assistant-source-tag" key={j}>{s.title}</span>
                    ))}
                  </div>
                )}

                {msg.disclaimer && (
                  <div className="assistant-disclaimer">
                    <AlertCircle size={12} /> {msg.disclaimer}
                  </div>
                )}

                {msg.traceability && (
                  <div className="assistant-trace">
                    <button className="assistant-trace-toggle" onClick={() => setExpandedTrace(prev => ({ ...prev, [i]: !prev[i] }))}>
                      {expandedTrace[i] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <span>{ui.traceToggle}</span>
                    </button>
                    {expandedTrace[i] && (
                      <div className="assistant-trace-body">
                        <div className="assistant-trace-step">
                          <div className="assistant-trace-icon intent"><Target size={12} /></div>
                          <div><span className="assistant-trace-label">{ui.userIntent}</span><span className="assistant-trace-value">{msg.traceability.user_intent}</span></div>
                        </div>
                        <div className="assistant-trace-connector" />
                        <div className="assistant-trace-step">
                          <div className="assistant-trace-icon knowledge"><Database size={12} /></div>
                          <div>
                            <span className="assistant-trace-label">{ui.retrievedKnowledge}</span>
                            <span className="assistant-trace-value">
                              {msg.traceability.retrieved_knowledge.count} {ui.records}
                              {msg.traceability.retrieved_knowledge.source_types.length > 0 &&
                                ` across ${msg.traceability.retrieved_knowledge.source_types.length} ${ui.sourceTypes}`}
                            </span>
                            <div className="assistant-trace-files">
                              {msg.traceability.retrieved_knowledge.source_files.map((f, fi) => (
                                <span className="assistant-trace-file" key={fi}>{f}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="assistant-trace-connector" />
                        <div className="assistant-trace-step">
                          <div className="assistant-trace-icon matched"><Layers size={12} /></div>
                          <div>
                            <span className="assistant-trace-label">{ui.matchedSources}</span>
                            {msg.traceability.matched_items.map((item, mi) => (
                              <div className="assistant-trace-matched" key={mi}>
                                <span className="assistant-trace-matched-type">{item.type}</span>
                                {item.title}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="assistant-trace-connector" />
                        <div className="assistant-trace-step">
                          <div className="assistant-trace-icon method"><Cpu size={12} /></div>
                          <div><span className="assistant-trace-label">{ui.responseMethod}</span><span className="assistant-trace-value">{msg.traceability.response_method}</span></div>
                        </div>
                        <div className="assistant-trace-summary">
                          <FileText size={11} />
                          <span>{msg.traceability.summary}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {msg.suggested && msg.suggested.length > 0 && i === messages.length - 1 && (
                  <div className="assistant-suggestions">
                    {msg.suggested.map((sq, j) => (
                      <button key={j} className="assistant-suggestion-chip" onClick={() => handleSend(sq)}>
                        <ArrowRight size={11} /> {sq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="assistant-msg-avatar user"><User size={18} /></div>
              )}
            </div>
          ))}

          {loading && (
            <div className="assistant-msg assistant">
              <div className="assistant-msg-avatar bot"><Bot size={18} /></div>
              <div className="assistant-msg-content">
                <div className="assistant-msg-header"><span className="assistant-msg-role">{ui.bisLabel}</span></div>
                <div className="assistant-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="assistant-suggestions-overlay">
            <Sparkles size={16} style={{ color: 'var(--primary-400)' }} />
            <span className="assistant-suggestions-title">{ui.suggested}</span>
            <div className="assistant-suggestions-grid">
              {suggestedQs.map((q, i) => (
                <button key={i} className="assistant-suggestion-card" onClick={() => handleSend(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {micError && (
          <div className="assistant-mic-error">
            <AlertCircle size={13} /> {micError}
          </div>
        )}

        <div className="assistant-input-bar">
          <div className="assistant-input-wrapper">
            <input
              ref={inputRef}
              className="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading}
              aria-label="Chat input"
            />
            <button
              className={`assistant-mic-btn ${isListening ? 'listening' : ''} ${!speechSupported ? 'unsupported' : ''}`}
              onClick={toggleMic}
              title={speechSupported ? (isListening ? ui.micListening : 'Voice input') : ui.micUnsupported}
              disabled={loading}
              aria-label="Voice input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            {isListening && <span className="assistant-mic-pulse" />}
            <button
              className="assistant-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .assistant-root { height: calc(100vh - var(--navbar-height) - 48px); display: flex; flex-direction: column; }
        .assistant-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .assistant-header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        .lang-selector {
          display: flex; gap: 2px;
          background: var(--gray-100); border-radius: var(--radius-md);
          padding: 3px; border: 1px solid var(--gray-200);
        }
        .lang-btn {
          padding: 4px 10px; border: none; border-radius: var(--radius-sm);
          font-size: 0.6875rem; font-weight: 700; cursor: pointer;
          background: transparent; color: var(--gray-500);
          transition: all var(--transition-fast); letter-spacing: 0.03em;
        }
        .lang-btn:hover { color: var(--gray-700); background: var(--gray-200); }
        .lang-btn.active { background: var(--primary-500); color: var(--white); box-shadow: 0 1px 3px rgba(30,86,184,0.2); }

        .assistant-chat-container {
          flex: 1; display: flex; flex-direction: column;
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg); overflow: hidden; min-height: 0; position: relative;
        }

        .assistant-chat-messages {
          flex: 1; overflow-y: auto; padding: 24px;
          display: flex; flex-direction: column; gap: 20px;
        }

        .assistant-msg { display: flex; gap: 12px; max-width: 80%; }
        .assistant-msg.user { align-self: flex-end; flex-direction: row-reverse; }
        .assistant-msg.assistant { align-self: flex-start; }

        .assistant-msg-avatar {
          width: 36px; height: 36px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .assistant-msg-avatar.bot { background: var(--primary-100); color: var(--primary-500); }
        .assistant-msg-avatar.user { background: var(--gray-200); color: var(--gray-600); }

        .assistant-msg-content { min-width: 0; flex: 1; }
        .assistant-msg-header {
          display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;
        }
        .assistant-msg-role {
          font-size: 0.6875rem; font-weight: 600; color: var(--gray-500);
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .assistant-copy-btn {
          background: none; border: none; color: var(--gray-400); cursor: pointer;
          padding: 4px; border-radius: 4px; display: flex; align-items: center;
        }
        .assistant-copy-btn:hover { color: var(--primary-500); background: var(--gray-50); }

        .assistant-msg-text {
          font-size: 0.9375rem; line-height: 1.7; white-space: pre-wrap;
          padding: 14px 16px; border-radius: var(--radius-md);
        }
        .assistant-msg-text.assistant { background: var(--gray-50); border: 1px solid var(--gray-100); }
        .assistant-msg-text.user { background: var(--primary-500); color: var(--white); }
        .assistant-msg-text strong { font-weight: 600; }
        .assistant-msg-text.assistant strong { color: var(--primary-600); }

        .assistant-msg-sources {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          margin-top: 8px; font-size: 0.75rem; color: var(--gray-500);
        }
        .assistant-source-tag {
          background: var(--primary-50); color: var(--primary-600);
          padding: 3px 8px; border-radius: var(--radius-full); border: 1px solid var(--primary-100);
          font-size: 0.6875rem;
        }

        .assistant-disclaimer {
          display: flex; align-items: center; gap: 6px;
          margin-top: 8px; padding: 8px 12px;
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: var(--radius-sm); font-size: 0.75rem; color: #92400e;
        }

        .assistant-trace { margin-top: 8px; }
        .assistant-trace-toggle {
          display: flex; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer;
          padding: 4px 8px; border-radius: var(--radius-sm);
          color: var(--gray-500); font-size: 0.75rem; font-weight: 500;
          transition: all var(--transition-fast);
        }
        .assistant-trace-toggle:hover { background: var(--gray-100); color: var(--gray-700); }

        .assistant-trace-body {
          margin-top: 8px; padding: 12px;
          background: var(--gray-50); border: 1px solid var(--gray-100);
          border-radius: var(--radius-md); font-size: 0.75rem;
        }
        .assistant-trace-step { display: flex; align-items: flex-start; gap: 10px; }
        .assistant-trace-icon {
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .assistant-trace-icon.intent { background: #ede9fe; color: #7c3aed; }
        .assistant-trace-icon.knowledge { background: #dbeafe; color: #2563eb; }
        .assistant-trace-icon.matched { background: #d1fae5; color: #059669; }
        .assistant-trace-icon.method { background: #fef3c7; color: #d97706; }
        .assistant-trace-label { display: block; font-size: 0.625rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.04em; }
        .assistant-trace-value { color: var(--gray-700); font-weight: 500; }
        .assistant-trace-connector { width: 1px; height: 8px; background: var(--gray-200); margin-left: 11px; margin: 2px 0 2px 11px; }
        .assistant-trace-files { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
        .assistant-trace-file {
          background: #eff6ff; color: #1d4ed8;
          padding: 2px 8px; border-radius: var(--radius-full);
          font-size: 0.625rem; font-family: monospace; border: 1px solid #bfdbfe;
        }
        .assistant-trace-matched { display: flex; align-items: center; gap: 6px; color: var(--gray-600); font-size: 0.75rem; margin-top: 4px; }
        .assistant-trace-matched-type {
          background: var(--gray-200); color: var(--gray-600);
          padding: 1px 6px; border-radius: 3px;
          font-size: 0.625rem; font-weight: 600; text-transform: uppercase;
        }
        .assistant-trace-summary {
          display: flex; align-items: center; gap: 6px;
          margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--gray-200);
          color: var(--gray-600); font-size: 0.6875rem; font-style: italic;
        }

        .assistant-suggestions { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
        .assistant-suggestion-chip {
          display: flex; align-items: center; gap: 8px;
          background: var(--white); color: var(--primary-600);
          border: 1px solid var(--primary-200); padding: 10px 14px;
          border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500;
          text-align: left; cursor: pointer; transition: all var(--transition-fast);
        }
        .assistant-suggestion-chip:hover { background: var(--primary-50); border-color: var(--primary-400); transform: translateX(3px); }

        .assistant-typing {
          display: flex; gap: 5px; padding: 14px 16px;
          background: var(--gray-50); border: 1px solid var(--gray-100);
          border-radius: var(--radius-md); width: fit-content;
        }
        .assistant-typing span {
          width: 8px; height: 8px; border-radius: 50%; background: var(--gray-400);
          animation: typing 1.2s infinite ease-in-out;
        }
        .assistant-typing span:nth-child(2) { animation-delay: 0.2s; }
        .assistant-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%,60%,100% { opacity: 0.3; transform: scale(0.8); } 30% { opacity: 1; transform: scale(1); } }

        .assistant-suggestions-overlay {
          padding: 0 24px 16px; display: flex; flex-direction: column;
          align-items: center; gap: 8px;
        }
        .assistant-suggestions-title { font-size: 0.8125rem; color: var(--gray-500); font-weight: 500; }
        .assistant-suggestions-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%;
        }
        .assistant-suggestion-card {
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius-md); padding: 12px 14px;
          font-size: 0.8125rem; color: var(--gray-700); text-align: left;
          cursor: pointer; transition: all var(--transition-fast);
        }
        .assistant-suggestion-card:hover { border-color: var(--primary-300); background: var(--primary-50); color: var(--primary-600); }

        .assistant-mic-error {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 6px 12px; background: #fef2f2; border-top: 1px solid #fecaca;
          color: #dc2626; font-size: 0.75rem; font-weight: 500;
          animation: fadeIn 0.2s ease;
        }

        .assistant-input-bar {
          padding: 12px 16px; border-top: 1px solid var(--gray-200); background: var(--white);
        }
        .assistant-input-wrapper {
          display: flex; align-items: center; gap: 8px;
          background: var(--gray-50); border: 1px solid var(--gray-300);
          border-radius: var(--radius-lg); padding: 6px 8px;
          transition: border-color var(--transition-fast);
        }
        .assistant-input-wrapper:focus-within { border-color: var(--primary-400); box-shadow: 0 0 0 3px rgba(30,86,184,0.08); }
        .assistant-input {
          flex: 1; border: none; background: none; padding: 8px;
          font-size: 0.9375rem; outline: none; color: var(--gray-800);
        }
        .assistant-input::placeholder { color: var(--gray-400); }

        .assistant-mic-btn {
          background: none; border: none; color: var(--gray-400);
          cursor: pointer; padding: 8px; border-radius: var(--radius-sm);
          display: flex; align-items: center; transition: all var(--transition-fast);
          position: relative;
        }
        .assistant-mic-btn:hover:not(:disabled) { color: var(--primary-500); background: var(--gray-100); }
        .assistant-mic-btn.listening { color: #ef4444; }
        .assistant-mic-btn.unsupported { opacity: 0.35; cursor: not-allowed; }
        .assistant-mic-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .assistant-mic-pulse {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #ef4444; animation: micPulse 1.2s infinite;
          pointer-events: none;
        }
        @keyframes micPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }

        .assistant-send-btn {
          background: var(--primary-500); color: var(--white);
          padding: 8px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          transition: background var(--transition-fast); width: 40px; height: 40px;
        }
        .assistant-send-btn:hover { background: var(--primary-600); }
        .assistant-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 768px) {
          .assistant-root { height: calc(100vh - var(--navbar-height) - 32px); }
          .assistant-header-row { flex-direction: column; }
          .assistant-msg { max-width: 95%; }
          .assistant-suggestions-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
