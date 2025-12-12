"use client";

import React from 'react';
import styles from './notifications.module.css';

const NotificationsPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notifications</h1>
      <p className={styles.placeholder}>You have no new notifications.</p>
    </div>
  );
};

export default NotificationsPage;
