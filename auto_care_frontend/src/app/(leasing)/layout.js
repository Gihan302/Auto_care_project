"use client";

import { useState } from 'react'
import Header from './leasing/layout/header'
import Sidebar from './leasing/layout/sidebar'
import styles from './layout.module.css'

export default function LeasingLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleDarkMode = () => {
    console.log('Toggling dark mode. Current state:', isDarkMode);
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark')
    console.log('Toggled dark mode. New state:', !isDarkMode);
  }

  return (
    <div className={styles.container}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ''}`}>
        <Header 
          setIsMobileOpen={setIsMobileOpen} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
