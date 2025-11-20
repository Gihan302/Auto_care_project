'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function AgentProfilePage() {
  const [agentData, setAgentData] = useState({
    name: 'Agent John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    company: 'AutoCare Agents',
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Agent Profile</h1>
      <div className={styles.profileCard}>
        <div className={styles.profileItem}>
          <span className={styles.label}>Name:</span>
          <span className={styles.value}>{agentData.name}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{agentData.email}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Phone:</span>
          <span className={styles.value}>{agentData.phone}</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Company:</span>
          <span className={styles.value}>{agentData.company}</span>
        </div>
        <button className={styles.editButton}>Edit Profile</button>
      </div>
    </div>
  )
}
