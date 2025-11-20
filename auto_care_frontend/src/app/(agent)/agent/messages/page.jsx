'use client'

import { useState } from 'react'
import styles from './page.module.css'

const messages = [
  {
    id: 1,
    sender: 'Buyer123',
    message: 'Is the Toyota Camry still available?',
    ad: 'Toyota Camry 2020',
    time: '2 hours ago',
  },
  {
    id: 2,
    sender: 'Buyer456',
    message: 'I am interested in the Ford Mustang. Can we negotiate the price?',
    ad: 'Ford Mustang 2022',
    time: '5 hours ago',
  },
]

export default function MessagesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Messages</h1>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <div key={message.id} className={styles.messageItem}>
            <div className={styles.messageHeader}>
              <span className={styles.sender}>{message.sender}</span>
              <span className={styles.time}>{message.time}</span>
            </div>
            <div className={styles.ad}>RE: {message.ad}</div>
            <p className={styles.messageContent}>{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
