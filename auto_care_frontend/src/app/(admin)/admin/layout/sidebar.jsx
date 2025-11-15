'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from "next/image";
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
import { RiAdvertisementFill } from 'react-icons/ri'

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Manage Users", url: "/admin/manageUsers", icon: Users },
  { title: "Manage Vehicles", url: "/admin/manageVehicles", icon: Car },
  { title: "Manage Reviews", url: "/admin/manageReviews", icon: FileText },
  { title: "Advertisements", url: "/admin/advertisements", icon: RiAdvertisementFill },
  { title: "Leasing Companies", url: "/admin/leasing", icon: Building2 },
  { title: "Leasing Plans", url: "/admin/leasing-plans", icon: FileText },
  { title: "Insurance Companies", url: "/admin/insurance", icon: Shield },
  { title: "Insurance Plans", url: "/admin/insurance-plans", icon: FileText },
  { title: "Reports & Analytics", url: "/admin/reports", icon: BarChart3 },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Settings", url: "/admin/settings", icon: Settings },
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