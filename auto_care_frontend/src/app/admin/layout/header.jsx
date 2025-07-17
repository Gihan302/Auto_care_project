'use client'

import { useState } from 'react'
import {
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Menu
} from "lucide-react"
import styles from './header.module.css'

export default function Header({ setIsMobileOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
    setIsDropdownOpen(false)
  }

  const handleProfileSettings = () => {
    // Add profile settings logic here
    console.log('Opening profile settings...')
    setIsDropdownOpen(false)
  }

  const handleAccountPreferences = () => {
    // Add account preferences logic here
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
          <p className={styles.headerSubtitle}>Welcome back, Admin</p>
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
            <div className={styles.avatar}>AD</div>
            <span className={styles.adminName}>Admin</span>
            <ChevronDown size={16} />
          </button>
          
          {isDropdownOpen && (
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
                className={`${styles.dropdownItem} ${styles.logout}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}