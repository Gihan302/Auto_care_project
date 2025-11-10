"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Menu
} from "lucide-react"
import styles from '../../../(admin)/admin/layout/header.module.css' // Reusing admin header styles
import useLocalStorage from '@/utils/useLocalStorage';

export default function Header({ setIsMobileOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useLocalStorage('user', null);
  const [clientLoaded, setClientLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
    setIsDropdownOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Link href="/">
          <img src="/logo.png" alt="AutoCare Logo" className={styles.logo} />
        </Link>
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>Leasing Company Portal</h1>
          <p className={styles.headerSubtitle}>Welcome, {clientLoaded && (user?.cName || 'Leasing Company')}</p>
        </div>
      </div>
            
      <div className={styles.headerRight}>
        <button
          className={styles.themeToggle}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
                
        <div className={styles.dropdown}>
          <button 
            className={styles.dropdownTrigger}
            onClick={handleDropdownToggle}
          >
            <div className={styles.avatar}>{clientLoaded && (user?.cName?.charAt(0) || 'L')}</div>
            <span className={styles.adminName}>{clientLoaded && (user?.cName || 'Leasing Co.')}</span>
            <ChevronDown 
              size={16} 
              className={`${styles.chevron} ${isDropdownOpen ? styles.chevronRotated : ''}`} 
            />
          </button>
                    
          {isDropdownOpen && (
            <>
              <div 
                className={styles.backdrop}
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <div className={styles.dropdownMenu}>
                <Link href="/leasing/profile" className={styles.dropdownItem}>
                  Profile Settings
                </Link>
                <button 
                  className={styles.dropdownItem}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Account Preferences
                </button>
                <hr className={styles.dropdownSeparator} />
                <button 
                  className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
