import React from 'react';
import {
  Sun,
  Moon,
  Bell,
  Menu,
  ChevronDown
} from 'lucide-react';
import styles from '../dashboard.module.css'; // Import CSS Modules

const Header = ({ sidebarCollapsed, setMobileMenuOpen, darkMode, setDarkMode, dropdownOpen, setDropdownOpen }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>Dashboard Overview</h1>
          <p className={styles.headerSubtitle}>Welcome back, manage your leasing operations</p>
        </div>
      </div>

      <div className={styles.headerRight}>
        <button className={styles.themeToggle} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>

        <div className={styles.dropdown}>
          <button
            className={styles.dropdownTrigger}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.avatar}>AD</div>
            <span className={styles.adminName}>Admin User</span>
            <ChevronDown className={`${styles.chevron} ${dropdownOpen ? styles.chevronRotated : ''}`} size={16} />
          </button>

          {dropdownOpen && (
            <>
              <div className={styles.backdrop} onClick={() => setDropdownOpen(false)} />
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem}>
                  <Users size={16} />
                  Profile
                </button>
                <button className={styles.dropdownItem}>
                  <Settings size={16} />
                  Settings
                </button>
                <hr className={styles.dropdownSeparator} />
                <button className={`${styles.dropdownItem} ${styles.logoutItem}`}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;