import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ShieldCheck, MessageSquareText, Search, Building2, ClipboardCheck, Info, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Assistant from './pages/Assistant'
import ProductChecker from './pages/ProductChecker'
import StandardsSearch from './pages/StandardsSearch'
import BISServices from './pages/BISServices'
import Compliance from './pages/Compliance'
import About from './pages/About'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText },
  { to: '/product-checker', label: 'Product Checker', icon: ShieldCheck },
  { to: '/standards', label: 'Standards Search', icon: Search },
  { to: '/services', label: 'BIS Services', icon: Building2 },
  { to: '/compliance', label: 'Compliance', icon: ClipboardCheck },
  { to: '/about', label: 'About', icon: Info },
]

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon"><ShieldCheck size={24} /></div>
            {!collapsed && (
              <div className="brand-text">
                <span className="brand-name">BIS Sahayak AI</span>
              </div>
            )}
          </div>
          <button className="collapse-btn" onClick={onToggle}>☰</button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a key={item.to} href={item.to} className="nav-item" onClick={onMobileClose}>
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <p>v1.0.0</p>}
        </div>
      </aside>
    </>
  )
}

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main className="main-content" style={{ marginLeft: collapsed ? '72px' : 'var(--sidebar-width)' }}>
        <div className="top-bar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="top-bar-right">
            <span className="lang-badge">EN</span>
            <span className="notification-badge">🔔</span>
            <div className="avatar">B</div>
          </div>
        </div>
        <div className="page-container">{children}</div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/product-checker" element={<ProductChecker />} />
          <Route path="/standards" element={<StandardsSearch />} />
          <Route path="/services" element={<BISServices />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
