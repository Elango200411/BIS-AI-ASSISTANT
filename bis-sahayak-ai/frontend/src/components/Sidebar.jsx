import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Search,
  Building2,
  ClipboardCheck,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText },
  { to: '/compliance-checker', label: 'Product Checker', icon: ShieldCheck },
  { to: '/standards-search', label: 'Standards Search', icon: Search },
  { to: '/bis-services', label: 'BIS Services', icon: Building2 },
  { to: '/compliance', label: 'Compliance', icon: ClipboardCheck },
  { to: '/about', label: 'About', icon: Info },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={onMobileClose}
      />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">BIS AI ASSISTANT</span>
            <span className="sidebar-brand-tag">Intelligent Assistant</span>
          </div>
          <button className="collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
            >
              <span className="nav-item-icon">
                <item.icon size={20} />
              </span>
              <span className="nav-item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="version-badge">v1.0.0</div>
            <p>Smart India Hackathon 2025</p>
          </div>
        </div>
      </aside>
    </>
  )
}
