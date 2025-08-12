import React from 'react';
import {
  Car,
  BarChart3,
  Users,
  Clock,
  Settings,
  ChevronLeft,
  X
} from 'lucide-react';
import styles from '../dashboard.module.css'; // Import CSS Modules

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen }) => {
  const navItems = [
    { icon: BarChart3, label: 'Dashboard Overview', active: true },
    { icon: Car, label: 'Active Leases' },
    { icon: Clock, label: 'Pending Approvals' },
    { icon: Users, label: 'User Management' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Car className={styles.logoIcon} />
          </div>
          <div className={styles.logoText}>
            <h1>LeaseHub</h1>
            <p>Admin Portal</p>
          </div>
        </div>
        <button
          className={styles.mobileClose}
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li key={index}>
                <a href="#" className={`${styles.navLink} ${item.active ? styles.active : ''} ${sidebarCollapsed ? styles.collapsed : ''}`}>
                  <item.icon className={styles.navIcon} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {sidebarCollapsed && (
                    <div className={styles.tooltip}>
                      <div className={styles.tooltipArrow} />
                      {item.label}
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <button
          className={styles.toggleButton}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronLeft className={`${styles.toggleIcon} ${sidebarCollapsed ? styles.toggleIconRotated : ''}`} />
          {!sidebarCollapsed && <span>Collapse</span>}
          {sidebarCollapsed && (
            <div className={styles.tooltip}>
              <div className={styles.tooltipArrow} />
              Expand
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;