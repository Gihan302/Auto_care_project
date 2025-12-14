'use client'

import styles from './page.module.css'

export default function PackageUsagePage() {
  const usage = {
    packageName: 'Gold Package',
    adsRemaining: 25,
    totalAds: 50,
    expiryDate: '2025-12-31',
  }

  const percentage = (usage.adsRemaining / usage.totalAds) * 100

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Package Usage</h1>
      <div className={styles.usageCard}>
        <h2 className={styles.packageName}>{usage.packageName}</h2>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className={styles.usageStats}>
          <p>
            {usage.adsRemaining} / {usage.totalAds} Ads Remaining
          </p>
          <p>Expires on: {usage.expiryDate}</p>
        </div>
      </div>
    </div>
  )
}
