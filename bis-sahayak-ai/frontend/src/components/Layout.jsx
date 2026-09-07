import { useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import Sidebar from './Sidebar'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/assistant': 'AI Assistant',
  '/compliance-checker': 'Product Checker',
  '/standards-search': 'Standards Search',
  '/bis-services': 'BIS Services',
  '/compliance': 'Compliance',
  '/about': 'About',
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  const handleToggle = useCallback(() => setCollapsed((p) => !p), [])
  const handleMobileOpen = useCallback(() => setMobileOpen(true), [])
  const handleMobileClose = useCallback(() => setMobileOpen(false), [])

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      <div className={`main-area ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="top-navbar">
          <div className="navbar-left">
            <button className="mobile-menu-btn" onClick={handleMobileOpen} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="navbar-title">{pageTitle}</h1>
            </div>
          </div>

          <div className="navbar-right">
            <button className="navbar-btn" aria-label="Notifications" title="Notifications">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <div className="navbar-avatar" title="Profile" role="button" tabIndex={0}>
              B
            </div>
          </div>
        </header>

        <div className="page-scroll">
          <div className="page-container animate-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
