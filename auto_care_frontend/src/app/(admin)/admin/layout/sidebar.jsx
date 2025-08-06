'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Building2,
  Shield,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X
} from "lucide-react"
import styles from './sidebar.module.css'

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Manage Users", url: "/users", icon: Users },
  { title: "Manage Vehicles", url: "/vehicles", icon: Car },
  { title: "Loan Applications", url: "/loans", icon: FileText },
  { title: "Leasing Companies", url: "/leasing", icon: Building2 },
  { title: "Insurance Companies", url: "/insurance", icon: Shield },
  { title: "Reports & Analytics", url: "/reports", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
]

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()
  
  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Car className={styles.logoIcon} />
            </div>
            {!isCollapsed && (
              <div className={styles.logoText}>
                <h1>Auto Care</h1>
                <p>Admin Portal</p>
              </div>
            )}
          </div>
          <button 
            className={styles.mobileClose}
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            {!isCollapsed && (
              <div className={styles.navLabel}>MAIN NAVIGATION</div>
            )}
            <ul className={styles.navList}>
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link 
                    href={item.url}
                    className={`${styles.navLink} ${isActive(item.url) ? styles.active : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <item.icon className={styles.navIcon} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Toggle button */}
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.toggleButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}