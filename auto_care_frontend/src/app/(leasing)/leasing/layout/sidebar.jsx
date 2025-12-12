"use client";

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  Bell,
  Menu,
  X,
  Users,
  MessagesSquare,
  Building
} from "lucide-react"
import styles from './sidebar.module.css'

const menuItems = [
  { title: "Dashboard", url: "/leasing/dashboard", icon: LayoutDashboard },
  { title: "Create New Plan", url: "/leasing/create-plan", icon: FilePlus2 },
  { title: "Manage Plans", url: "/leasing/manage-plans", icon: ClipboardList },
  { title: "Messages", url: "/leasing/message", icon: MessagesSquare },
  { title: "Notifications", url: "/leasing/notifications", icon: Bell },
  // { title: "Messages", url: "/leasing/message", icon: Building }, <--- DELETED THIS DUPLICATE
  { title: "Company Profile", url: "/leasing/profile", icon: Building },
]

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()
  
  const isActive = (path) => {
    if (path === "/leasing" && pathname === "/leasing") return true
    if (path !== "/leasing" && pathname.startsWith(path)) return true
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
            
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <LayoutDashboard className={styles.logoIcon} />
            </div>
            {!isCollapsed && (
              <div className={styles.logoText}>
                <h1>Auto Care</h1>
                <p>Leasing Company</p>
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
