import {
  MOCK_STATS, MOCK_STANDARDS, MOCK_SERVICES, MOCK_SERVICE_DETAIL,
  generateMockCompliance, MOCK_CHAT_RESPONSE,
} from './mockData'

const API_BASE = '/api'
const TIMEOUT_MS = 3000

async function safeFetch(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch {
    clearTimeout(timer)
    return null
  }
}

export async function healthCheck() {
  const res = await safeFetch(`${API_BASE}/health`)
  if (res && res.ok) return res.json()
  return { status: 'mock', message: 'Running in preview mode' }
}

export async function getStats() {
  const res = await safeFetch(`${API_BASE}/stats`)
  if (res && res.ok) return res.json()
  return MOCK_STATS
}

export async function searchStandards(query) {
  const res = await safeFetch(`${API_BASE}/standards/search?q=${encodeURIComponent(query)}`)
  if (res && res.ok) return res.json()
  const q = query.toLowerCase()
  const filtered = MOCK_STANDARDS.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.standard_number.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.keywords.some((k) => k.toLowerCase().includes(q))
  )
  return { query, count: filtered.length, results: filtered }
}

export async function getStandard(standardId) {
  const res = await safeFetch(`${API_BASE}/standards/${encodeURIComponent(standardId)}`)
  if (res && res.ok) return res.json()
  return MOCK_STANDARDS.find((s) => s.standard_id === standardId) || MOCK_STANDARDS[0]
}

export async function getServices(query = '', category = '') {
  const res = await safeFetch(`${API_BASE}/services?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`)
  if (res && res.ok) return res.json()
  const q = query.toLowerCase()
  const filtered = q
    ? MOCK_SERVICES.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q))
      )
    : MOCK_SERVICES
  return { count: filtered.length, results: filtered }
}

export async function getService(serviceId) {
  const res = await safeFetch(`${API_BASE}/services/${encodeURIComponent(serviceId)}`)
  if (res && res.ok) return res.json()
  const svc = MOCK_SERVICES.find((s) => s.service_id === serviceId) || MOCK_SERVICES[0]
  return { ...svc, ...MOCK_SERVICE_DETAIL }
}

export async function checkCompliance(payload) {
  const res = await safeFetch(`${API_BASE}/compliance/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res && res.ok) return res.json()
  return generateMockCompliance(payload)
}

export async function sendChat(message, userType = 'consumer', language = 'en') {
  const res = await safeFetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, user_type: userType, language }),
  })
  if (res && res.ok) return res.json()
  return MOCK_CHAT_RESPONSE
}
