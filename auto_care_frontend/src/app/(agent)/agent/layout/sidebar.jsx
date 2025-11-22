'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from "next/image";
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FilePlus,
  Archive,
  MessageSquare,
  CheckCircle,
  Shield,
  Package,
  CreditCard,
  User,
  Menu,
  X
} from "lucide-react"
import styles from './sidebar.module.css'

const menuItems = [
  { title: "Dashboard", url: "/agent/dashboard", icon: LayoutDashboard },
  { title: "Create Ad", url: "/agent/create-ad", icon: FilePlus },
  { title: "My Ads", url: "/agent/my-ads", icon: Archive },
  { title: "All Vehicle Ads", url: "/agent/all-ads", icon: Archive },
  { title: "Messages", url: "/agent/messages", icon: MessageSquare },
  { title: "Sold Ads", url: "/agent/sold-ads", icon: CheckCircle },
  { title: "Plans", url: "/agent/plans", icon: Shield },
  { title: "Buy Packages", url: "/agent/buy-packages", icon: CreditCard },
  { title: "Package Usage", url: "/agent/package-usage", icon: Package },
  { title: "Profile", url: "/agent/profile", icon: User },
]

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()
  
  const isActive = (path) => {
    if (path === "/agent" && pathname === "/agent") return true
    if (path !== "/agent" && pathname.startsWith(path)) return true
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
            <div className={styles.logoIconWrapper}>
            <Image
              src="/logo.png"
              alt="Auto Care Logo"
              width={75}
              height={34}
              priority
            />
          </div>

            {!isCollapsed && (
              <div className={styles.logoText}>
                <h1>Auto Care</h1>
                <p>Agent Portal</p>
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
