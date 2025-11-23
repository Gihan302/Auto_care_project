'use client'

import { useState } from 'react'
import styles from './page.module.css'

const packages = [
  {
    id: 1,
    name: 'Bronze Package',
    price: '500 LKR',
    ads: 5,
  },
  {
    id: 2,
    name: 'Silver Package',
    price: '1,000 LKR',
    ads: 15,
  },
  {
    id: 3,
    name: 'Gold Package',
    price: '2,000 LKR',
    ads: 50,
  },
]

export default function BuyPackagesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Buy Advertisement Packages</h1>
      <div className={styles.packageList}>
        {packages.map((pkg) => (
          <div key={pkg.id} className={styles.packageItem}>
            <h2 className={styles.packageName}>{pkg.name}</h2>
            <p className={styles.packagePrice}>{pkg.price}</p>
            <p className={styles.packageAds}>{pkg.ads} Ads</p>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}
