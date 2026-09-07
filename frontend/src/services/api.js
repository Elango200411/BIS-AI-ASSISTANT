const API_BASE = 'http://localhost:8000/api'

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`)
  return res.json()
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`)
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`)
  return res.json()
}

export async function searchStandards(query) {
  const res = await fetch(`${API_BASE}/standards/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}

export async function getStandard(standardId) {
  const res = await fetch(`${API_BASE}/standards/${encodeURIComponent(standardId)}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('Standard not found')
    throw new Error(`Failed to fetch standard: ${res.status}`)
  }
  return res.json()
}

export async function getServices(query = '', category = '') {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (category) params.set('category', category)
  const res = await fetch(`${API_BASE}/services?${params.toString()}`)
  if (!res.ok) throw new Error(`Services fetch failed: ${res.status}`)
  return res.json()
}

export async function getService(serviceId) {
  const res = await fetch(`${API_BASE}/services/${encodeURIComponent(serviceId)}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('Service not found')
    throw new Error(`Failed to fetch service: ${res.status}`)
  }
  return res.json()
}

export async function checkCompliance(payload) {
  const res = await fetch(`${API_BASE}/compliance/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Compliance check failed: ${res.status}`)
  return res.json()
}

export async function sendChatMessage(payload) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`)
  return res.json()
}
