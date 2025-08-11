'use client'

import { useState } from 'react'
import Header from './admin/layout/header'
import Sidebar from './admin/layout/sidebar'
import styles from './layout.module.css'

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className={styles.container}>
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ''}`}>
        <Header setIsMobileOpen={setIsMobileOpen} />
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}