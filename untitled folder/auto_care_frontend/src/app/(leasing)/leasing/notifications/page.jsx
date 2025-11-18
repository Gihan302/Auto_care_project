'use client';

import { useState } from 'react';
import { Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';

const mockNotifications = [
  { id: 1, type: 'success', message: 'Leasing plan "LP-001" has been approved.', time: '2 hours ago', read: false },
  { id: 2, type: 'error', message: 'Failed to process payment for plan "LP-002".', time: '1 day ago', read: false },
  { id: 3, type: 'warning', message: 'Your subscription is expiring in 3 days.', time: '2 days ago', read: true },
  { id: 4, type: 'info', message: 'A new user has applied for a leasing plan.', time: '3 days ago', read: true },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className={`${styles.icon} ${styles.success}`} />;
    case 'error':
      return <XCircle className={`${styles.icon} ${styles.error}`} />;
    case 'warning':
      return <AlertTriangle className={`${styles.icon} ${styles.warning}`} />;
    default:
      return <Bell className={`${styles.icon} ${styles.info}`} />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        {unreadCount > 0 && (
          <span className={styles.unreadBadge}>{unreadCount} Unread</span>
        )}
      </div>
      <div className={styles.notificationList}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${styles.notificationItem} ${notification.read ? styles.read : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className={styles.iconWrapper}>
              <NotificationIcon type={notification.type} />
            </div>
            <div className={styles.content}>
              <p className={styles.message}>{notification.message}</p>
              <span className={styles.time}>{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
