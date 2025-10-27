'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  Bell,
  Menu,
  X
} from "lucide-react"
import styles from './sidebar.module.css'

const menuItems = [
  { title: "Dashboard", url: "/Insurance/insuranceCompany", icon: LayoutDashboard },
  { title: "Create New Plan", url: "/Insurance/createPlan", icon: FilePlus2 },
  { title: "Manage Plans", url: "/Insurance/managePlans", icon: ClipboardList },
  { title: "Notifications", url: "/Insurance/notifications", icon: Bell },
]

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === "/admin" && pathname === "/admin") return true
    if (path !== "/admin" && pathname.startsWith(path)) return true
    return false
  }

  const handleLinkClick = () => {
    setIsMobileOpen(false)
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
      
      <aside className={`
        ${styles.sidebar} 
        ${isCollapsed ? styles.collapsed : ''} 
        ${isMobileOpen ? styles.mobileOpen : ''}
      `}>
        
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <LayoutDashboard className={styles.logoIcon} />
            </div>
            {!isCollapsed && (
              <div className={styles.logoText}>
                <h1>Auto Care</h1>
                <p>Insurance Admin</p>
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
              <div className={styles.navLabel}>MAIN MENU</div>
            )}
            <ul className={styles.navList}>
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    onClick={handleLinkClick}
                    className={`
                      ${styles.navLink} 
                      ${isActive(item.url) ? styles.active : ''}
                      ${isCollapsed ? styles.collapsed : ''}
                    `}
                  >
                    <item.icon className={styles.navIcon} />
                    {!isCollapsed && <span>{item.title}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className={styles.tooltip}>
                        {item.title}
                        <div className={styles.tooltipArrow}></div>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer with toggle button */}
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.toggleButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu 
              size={16} 
              className={`${styles.toggleIcon} ${isCollapsed ? styles.toggleIconRotated : ''}`} 
            />
            {!isCollapsed && <span>Collapse</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className={styles.tooltip}>
                Expand Sidebar
                <div className={styles.tooltipArrow}></div>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}



