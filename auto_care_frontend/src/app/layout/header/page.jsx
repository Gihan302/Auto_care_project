'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from '../layout.module.css'

export default function Header() {
  const [isVehiclesOpen, setVehiclesOpen] = useState(false)
  const [isResearchOpen, setResearchOpen] = useState(false)

  return (
    <header className={styles.headerWrapper}>
      {/* Logo */}
      <div>
        <img src="/logo.png" alt="Auto Care" className={styles.logo} />
      </div>

      {/* Nav Links */}
      <nav className={styles.navbarActive}>
        <div className="relative">
          <button onClick={() => {
            setVehiclesOpen(!isVehiclesOpen)
            setResearchOpen(false)
          }}>
            VEHICLES {isVehiclesOpen ? '▴' : '▾'}
          </button>
          {isVehiclesOpen && (
            <div className={styles.dropdown}>
              <a href="#" className={styles.dropdownItem}>Cars</a>
              <a href="#" className={styles.dropdownItem}>Vans</a>
              <a href="#" className={styles.dropdownItem}>SUVs</a>
              <a href="#" className={styles.dropdownItem}>Trucks</a>
              <a href="#" className={styles.dropdownItem}>Motor Bikes</a>
              <a href="#" className={styles.dropdownItem}>Three wheelers</a>
              <a href="#" className={styles.dropdownItem}>Busses</a>
              <a href="#" className={styles.dropdownItem}>Lories</a>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => {
            setResearchOpen(!isResearchOpen)
            setVehiclesOpen(false)
          }}>
            RESEARCH {isResearchOpen ? '▴' : '▾'}
          </button>
          {isResearchOpen && (
            <div className={styles.dropdown}>
              <a href="#" className={styles.dropdownItem}>Car Reviews</a>
              <a href="#" className={styles.dropdownItem}>Compare Cars</a>
              <a href="#" className={styles.dropdownItem}>Car Finder Quiz</a>
              <a href="#" className={styles.dropdownItem}>Buying Power Calculator</a>
              <a href="#" className={styles.dropdownItem}>Lease Calculator</a>
            </div>
          )}
        </div>

        <a href="#">SELL YOUR CAR</a>
      </nav>

      {/* Search + SignUp */}
      <div className="flex items-center gap-4">
        <div className={styles.searchBox}>
          <FaSearch className="text-white text-sm" />
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>
        <button className="text-sm font-semibold">SIGN UP</button>
      </div>
    </header>
  )
}
