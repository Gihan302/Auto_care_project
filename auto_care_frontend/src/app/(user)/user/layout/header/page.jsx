'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import styles from '../layout.module.css';
import Image from 'next/image';



const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const vehicleCategories = [
    { name: 'Cars', href: '/user/carListing' },
    { name: 'Vans', href: '/vehicles/vans' },
    { name: 'SUVs', href: '/vehicles/suvs' },
    { name: 'Trucks', href: '/vehicles/trucks' },
    { name: 'Motor Bikes', href: '/vehicles/motorbikes' },
    { name: 'Three Wheelers', href: '/vehicles/three-wheelers' },
    { name: 'Busses', href: '/vehicles/busses' },
    { name: 'Lorries', href: '/vehicles/lorries' },
  ];

  const researchOptions = [
    { name: 'Car Reviews', href: '/research/reviews' },
    { name: 'Compare Cars', href: '/user/research/compare' },
    { name: 'Car Finder Quiz', href: '/research/quiz' },
    { name: 'Buying Power Calculator', href: '/user/research/buyingPower' },
    { name: 'Lease Calculator', href: '/user/research/leaseCalculator' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
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
          <Link href="/sell" className={styles.navItem}>
            SELL YOUR CAR
          </Link>
        </nav>

        {/* Search + Sign Up */}
        <div className={styles.searchSignupWrapper}>
          <form className={styles.searchContainer}>
            <input type="text" placeholder="Search" className={styles.searchInput} />
            <Search className={styles.searchIcon} size={16} />
          </form>

          <Link href="/signup" className={styles.signupBtn}>
            SIGN UP
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.mobileMenuButton}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;