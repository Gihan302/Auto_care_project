'use client'

import { useState } from 'react'
import styles from './page.module.css'

const plans = [
  {
    id: 1,
    name: 'Basic',
    price: '1,000 LKR',
    features: ['5 Ads', '30 Days Validity'],
  },
  {
    id: 2,
    name: 'Standard',
    price: '2,500 LKR',
    features: ['15 Ads', '45 Days Validity'],
  },
  {
    id: 3,
    name: 'Premium',
    price: '5,000 LKR',
    features: ['50 Ads', '60 Days Validity'],
  },
]

export default function PlansPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Leasing and Insurance Plans</h1>
      <div className={styles.planList}>
        {plans.map((plan) => (
          <div key={plan.id} className={styles.planItem}>
            <h2 className={styles.planName}>{plan.name}</h2>
            <p className={styles.planPrice}>{plan.price}</p>
            <ul className={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button className={styles.selectButton}>Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  )
}
