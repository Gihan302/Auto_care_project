'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, Menu, X, Bell, MessageCircle, User, Settings, LogOut } from 'lucide-react';
import styles from '../layout.module.css';
import Image from 'next/image';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(5);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const vehicleCategories = [
    { name: 'Cars', href: '/user/carListing' },
    { name: 'Vans', href: '/user/message' },
    { name: 'SUVs', href: '/vehicles/suvs' },
    { name: 'Trucks', href: '/vehicles/trucks' },
    { name: 'Motor Bikes', href: '/vehicles/motorbikes' },
    { name: 'Three Wheelers', href: '/vehicles/three-wheelers' },
    { name: 'Busses', href: '/vehicles/busses' },
    { name: 'Lorries', href: '/vehicles/lorries' },
  ];

  const researchOptions = [
    { name: 'Car Reviews', href: '/user/research/review' },
    { name: 'Compare Cars', href: '/user/research/compare' },
    { name: 'Car Finder Quiz', href: '/user/research/quiz' },
    { name: 'Buying Power Calculator', href: '/user/research/buyingPower' },
    { name: 'Lease Calculator', href: '/user/research/leaseCalculator' },
    { name: 'Chat with Auto Genie AI', href: '/user/research/autoGenie' }
  ];

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Checking auth - Token:', token ? 'exists' : 'missing');
      console.log('Checking auth - User:', user ? 'exists' : 'missing');
      
      if (token && user) {
        setIsAuthenticated(true);
        try {
          const parsedUser = JSON.parse(user);
          console.log('User data:', parsedUser);
          setUserData(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes (for multi-tab support)
    window.addEventListener('storage', checkAuth);
    
    // Listen for custom auth event
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (activeDropdown !== 'user') {
          setActiveDropdown(null);
        }
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        if (activeDropdown === 'user') {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    
    // Update state
    setIsAuthenticated(false);
    setUserData(null);
    setActiveDropdown(null);
    
    // Redirect to home page
    window.location.href = '/';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return 'U';
    const firstName = userData.fname || '';
    const lastName = userData.lname || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get user role display name
  const getUserRole = () => {
    if (!userData || !userData.roles || userData.roles.length === 0) return 'User';
    const role = userData.roles[0].replace('ROLE_', '');
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <Link href="/" className={styles.logoContainer}>
          <div className={styles.logoIconWrapper}>
            <Image
              src="/logo.png"
              alt="Auto Care Logo"
              width={150}
              height={75}
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.navbarActive} ref={dropdownRef}>
          {/* VEHICLES Dropdown */}
          <div className={styles.navItemWrapper}>
            <button onClick={() => handleDropdownToggle('vehicles')} className={styles.navItem}>
              <span>VEHICLES</span>
              <ChevronDown className={`${styles.chevron} ${activeDropdown === 'vehicles' ? styles.chevronRotated : ''}`} size={16} />
            </button>

            <div className={`${styles.dropdownMenu} ${activeDropdown === 'vehicles' ? styles.dropdownActive : styles.dropdownEnter}`}>
              <div className={styles.dropdownContent}>
                {vehicleCategories.map((category, index) => (
                  <Link key={index} href={category.href} className={styles.dropdownLink} onClick={() => setActiveDropdown(null)}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RESEARCH Dropdown */}
          <div className={styles.navItemWrapper}>
            <button onClick={() => handleDropdownToggle('research')} className={styles.navItem}>
              <span>RESEARCH</span>
              <ChevronDown className={`${styles.chevron} ${activeDropdown === 'research' ? styles.chevronRotated : ''}`} size={16} />
            </button>

            <div className={`${styles.dropdownMenu} ${activeDropdown === 'research' ? styles.dropdownActive : styles.dropdownEnter}`}>
              <div className={styles.dropdownContent}>
                {researchOptions.map((option, index) => (
                  <Link key={index} href={option.href} className={styles.dropdownLink} onClick={() => setActiveDropdown(null)}>
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sell Your Car */}
          <Link href="/user/sellCar" className={styles.navItem}>
            SELL YOUR CAR
          </Link>
        </nav>

        {/* Search + Sign Up / User Section */}
        <div className={styles.searchSignupWrapper}>
          <form className={styles.searchContainer}>
            <input type="text" placeholder="Search" className={styles.searchInput} />
            <Search className={styles.searchIcon} size={16} />
          </form>

          {isAuthenticated ? (
            /* Authenticated User Section */
            <div className={styles.userSection}>
              {/* Notifications Icon */}
              <Link href="/user/notifications" className={styles.iconButton}>
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className={styles.notificationBadge}>{notificationCount}</span>
                )}
              </Link>

              {/* Messages Icon */}
              <Link href="/user/message" className={styles.iconButton}>
                <MessageCircle size={20} />
                {messageCount > 0 && (
                  <span className={styles.notificationBadge}>{messageCount}</span>
                )}
              </Link>

              {/* User Profile Dropdown */}
              <div className={styles.navItemWrapper} ref={userDropdownRef}>
                <button onClick={() => handleDropdownToggle('user')} className={styles.userButton}>
                  <div className={styles.userAvatar}>
                    {getUserInitials()}
                  </div>
                  <ChevronDown className={`${styles.chevronSmall} ${activeDropdown === 'user' ? styles.chevronRotated : ''}`} size={16} />
                </button>

                <div className={`${styles.dropdownMenu} ${styles.dropdownMenuRight} ${activeDropdown === 'user' ? styles.dropdownActive : styles.dropdownEnter}`}>
                  {/* User Info Section */}
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatarLarge}>
                      {getUserInitials()}
                    </div>
                    <div className={styles.userDetails}>
                      <p className={styles.userName}>
                        {userData?.fname} {userData?.lname}
                      </p>
                      <p className={styles.userRole}>{getUserRole()}</p>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider}></div>

                  {/* Menu Items */}
                  <div className={styles.dropdownContent}>
                    <Link href="/user/profile" className={styles.dropdownLink} onClick={() => setActiveDropdown(null)}>
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link href="/user/settings" className={styles.dropdownLink} onClick={() => setActiveDropdown(null)}>
                      <Settings size={16} />
                      Settings
                    </Link>
                    <Link href="/user/notifications" className={`${styles.dropdownLink} ${styles.messageLink}`} onClick={() => setActiveDropdown(null)}>
                      <Bell size={16} />
                      Notifications
                      {notificationCount > 0 && (
                        <span className={styles.inlineBadge}>{notificationCount}</span>
                      )}
                    </Link>
                    <Link href="/user/message" className={`${styles.dropdownLink} ${styles.messageLink}`} onClick={() => setActiveDropdown(null)}>
                      <MessageCircle size={16} />
                      Messages
                      {messageCount > 0 && (
                        <span className={styles.inlineBadge}>{messageCount}</span>
                      )}
                    </Link>
                  </div>

                  <div className={styles.dropdownDivider}></div>

                  {/* Logout */}
                  <div className={styles.dropdownContent}>
                    <button onClick={handleLogout} className={`${styles.dropdownLink} ${styles.logoutLink}`}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Non-authenticated - Sign Up Button */
            <Link href="/signup" className={styles.signupBtn}>
              SIGN UP
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.mobileMenuButton}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {/* Vehicle Categories */}
          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuLabel}>Vehicles</div>
            {vehicleCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className={styles.mobileMenuSubItem}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className={styles.mobileMenuDivider}></div>

          {/* Research Options */}
          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuLabel}>Research</div>
            {researchOptions.map((option, index) => (
              <Link
                key={index}
                href={option.href}
                className={styles.mobileMenuSubItem}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {option.name}
              </Link>
            ))}
          </div>

          <div className={styles.mobileMenuDivider}></div>

          {/* Sell Your Car */}
          <Link href="/user/sellCar" className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
            SELL YOUR CAR
          </Link>

          {isAuthenticated ? (
            /* Authenticated Mobile Menu */
            <>
              <div className={styles.mobileMenuDivider}></div>
              <Link href="/user/profile" className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                My Profile
              </Link>
              <Link href="/user/notifications" className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Notifications {notificationCount > 0 && `(${notificationCount})`}
              </Link>
              <Link href="/user/messages" className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Messages {messageCount > 0 && `(${messageCount})`}
              </Link>
              <Link href="/user/settings" className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                Settings
              </Link>
              <div className={styles.mobileMenuDivider}></div>
              <button onClick={handleLogout} className={`${styles.mobileMenuItem} ${styles.mobileLogout}`}>
                Logout
              </button>
            </>
          ) : (
            /* Non-authenticated Mobile Menu */
            <>
              <div className={styles.mobileMenuDivider}></div>
              <Link href="/signup" className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                SIGN UP
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;