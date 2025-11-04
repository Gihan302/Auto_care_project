'use client'

import { useState, useEffect } from 'react'
import {
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Menu
} from "lucide-react"
import styles from './header.module.css'

import { useRouter } from 'next/navigation'

export default function Header({ setIsMobileOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
  }, []);

  const getCompanyInitials = () => {
    if (!userData) return 'C';
    const companyName = userData.companyName || userData.fname || '';
    return companyName.charAt(0).toUpperCase();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/signin')
    setIsDropdownOpen(false)
  }

  const handleProfileSettings = () => {
    console.log('Opening profile settings...')
    setIsDropdownOpen(false)
  }

  const handleAccountPreferences = () => {
    console.log('Opening account preferences...')
    setIsDropdownOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>Dashboard Overview</h1>
          <p className={styles.headerSubtitle}>Welcome back, {userData?.companyName || userData?.fname || 'Company'}</p>
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
            <div className={styles.avatar}>{getCompanyInitials()}</div>
            <span className={styles.adminName}>{userData?.companyName || userData?.fname || 'Company'}</span>
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
                <button 
                  className={styles.dropdownItem}
                  onClick={handleProfileSettings}
                >
                  Profile Settings
                </button>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleAccountPreferences}
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