'use client';

import styles from '../layout.module.css'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function Header() {
  const [isVehiclesOpen, setVehiclesOpen] = useState(false)
  const [isResearchOpen, setResearchOpen] = useState(false)

  return (
    <header className={styles.headerWrapper}>
      <div>
        <img src="/logo.png" alt="Auto Care" className={styles.logo} />
      </div>

      <nav className={`${styles.navbar} md:flex`}>
        <div className="relative">
          <button onClick={() => setVehiclesOpen(!isVehiclesOpen)}>VEHICLES ▾</button>
          {isVehiclesOpen && (
            <div className={styles.dropdown}>
              <a href="#" className={styles.dropdownItem}>New Cars</a>
              <a href="#" className={styles.dropdownItem}>Used Cars</a>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setResearchOpen(!isResearchOpen)}>RESEARCH ▾</button>
          {isResearchOpen && (
            <div className={styles.dropdown}>
              <a href="#" className={styles.dropdownItem}>Loan Tips</a>
              <a href="#" className={styles.dropdownItem}>Car Reviews</a>
            </div>
          )}
        </div>
        <a href="#">SELL YOUR CAR</a>
      </nav>

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
