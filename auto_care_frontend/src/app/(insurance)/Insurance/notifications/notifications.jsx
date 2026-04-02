"use client";

import { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import styles from "./page.module.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Policy Renewal Successful",
      message: "Your health insurance policy has been renewed.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "alert",
      title: "Payment Overdue",
      message: "Your car insurance payment is overdue by 3 days.",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "New Policy Available",
      message: "Check out our new home insurance coverage options.",
      time: "3 days ago",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className={`${styles.icon} ${styles.success}`} />;
      case "alert":
        return <AlertTriangle className={`${styles.icon} ${styles.alert}`} />;
      default:
        return <Info className={`${styles.icon} ${styles.info}`} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Bell className={styles.headerIcon} />
        <h1>Notifications</h1>
      </div>

      <div className={styles.list}>
        {notifications.length === 0 && (
          <p className={styles.empty}>No notifications found</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`${styles.notification} ${n.read ? styles.read : ""}`}
          >
            <div className={styles.iconWrapper}>{getIcon(n.type)}</div>
            <div className={styles.content}>
              <h3>{n.title}</h3>
              <p>{n.message}</p>
              <span className={styles.time}>{n.time}</span>
            </div>
            <div className={styles.actions}>
              {!n.read && (
                <button
                  className={styles.markRead}
                  onClick={() => markAsRead(n.id)}
                >
                  Mark as read
                </button>
              )}
              <button
                className={styles.delete}
                onClick={() => deleteNotification(n.id)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

