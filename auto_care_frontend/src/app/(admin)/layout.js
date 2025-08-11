'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './admin/layout/header'
import Sidebar from './admin/layout/sidebar'
import styles from './layout.module.css'

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      setIsAuthorized(true);
    } else {
      router.push('/signin');
    }
  }, [router]);

  if (!isAuthorized) {
    // You can return a loader here or null to prevent flashing the layout
    return null; 
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
        <Header setIsMobileOpen={setIsMobileOpen} />
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
