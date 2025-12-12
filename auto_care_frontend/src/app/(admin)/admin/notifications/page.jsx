'use client'

import { useState } from "react"
import { Bell, Car, FileText, Building2, Shield, Users, CheckCircle, XCircle, Eye, Trash2, Plus } from "lucide-react"
import styles from './page.module.css'

const Notifications = () => {
  const [filterType, setFilterType] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "vehicle_listing",
      title: "New Vehicle Listing",
      message: "John Doe has listed a 2023 Toyota Camry for $28,500",
      timestamp: "2 minutes ago",
      isRead: false,
      priority: "normal",
      icon: Car,
      actionRequired: false
    },
    {
      id: 2,
      type: "company_registration",
      title: "Company Registration Request",
      message: "SafeDrive Insurance has requested to join as an insurance provider",
      timestamp: "15 minutes ago",
      isRead: false,
      priority: "high",
      icon: Shield,
      actionRequired: true
    },
    {
      id: 3,
      type: "loan_application",
      title: "New Loan Application",
      message: "Sarah Wilson applied for a $20,000 loan for Honda Civic",
      timestamp: "1 hour ago",
      isRead: false,
      priority: "normal",
      icon: FileText,
      actionRequired: true
    },
    {
      id: 4,
      type: "role_request",
      title: "Role Change Request",
      message: "Mike Johnson requested upgrade to Leasing Company role",
      timestamp: "2 hours ago",
      isRead: true,
      priority: "normal",
      icon: Users,
      actionRequired: true
    },
    {
      id: 5,
      type: "company_registration",
      title: "Company Registration Request",
      message: "QuickLease Corp has requested to join as a leasing provider",
      timestamp: "3 hours ago",
      isRead: false,
      priority: "high",
      icon: Building2,
      actionRequired: true
    },
    {
      id: 6,
      type: "vehicle_listing",
      title: "Vehicle Listing Updated",
      message: "Emily Brown updated the price for her 2022 Honda Civic",
      timestamp: "5 hours ago",
      isRead: true,
      priority: "low",
      icon: Car,
      actionRequired: false
    },
    {
      id: 7,
      type: "loan_application",
      title: "Loan Application Status",
      message: "David Lee's loan application has been automatically approved",
      timestamp: "1 day ago",
      isRead: true,
      priority: "normal",
      icon: FileText,
      actionRequired: false
    }
  ]

  const getNotificationIcon = (type) => {
    const icons = {
      vehicle_listing: Car,
      company_registration: Building2,
      loan_application: FileText,
      role_request: Users,
      insurance: Shield
    }
    return icons[type] || Bell
  }

  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case "high": return styles.priorityHigh
      case "normal": return styles.priorityNormal
      case "low": return styles.priorityLow
      default: return styles.priorityDefault
    }
  }

  const getIconColorClass = (priority) => {
    switch(priority) {
      case "high": return styles.iconHigh
      case "normal": return styles.iconNormal
      case "low": return styles.iconLow
      default: return styles.iconDefault
    }
  }

  const getIconBackgroundClass = (priority) => {
    switch(priority) {
      case "high": return styles.iconBgHigh
      case "normal": return styles.iconBgNormal
      case "low": return styles.iconBgLow
      default: return styles.iconBgDefault
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === "all") return true
    if (filterType === "unread") return !notification.isRead
    if (filterType === "action_required") return notification.actionRequired && !notification.isRead
    return notification.type === filterType
  })

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>Manage and monitor all notifications</p>
          </div>
          <button className={styles.addButton}>
            <Plus className={styles.addIcon} />
            Add New Notification
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Bell />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{notifications.length}</div>
              <div className={styles.statLabel}>Total Notifications</div>
              <div className={styles.statChange}>+12% from last month</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Eye />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{notifications.length - unreadCount}</div>
              <div className={styles.statLabel}>Read Notifications</div>
              <div className={styles.statChange}>+8% from last month</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Shield />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{unreadCount}</div>
              <div className={styles.statLabel}>Unread</div>
              <div className={styles.statChange}>+5% increase</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{actionRequiredCount}</div>
              <div className={styles.statLabel}>Action Required</div>
              <div className={styles.statChange}>+15% options</div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Search & Filter</h3>
          </div>
          <div className={styles.filterControls}>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Search notifications by title, type, or message..."
                className={styles.searchInput}
              />
            </div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Types</option>
              <option value="unread">Unread Only</option>
              <option value="action_required">Action Required</option>
              <option value="vehicle_listing">Vehicle Listings</option>
              <option value="loan_application">Loan Applications</option>
              <option value="company_registration">Company Registrations</option>
              <option value="role_request">Role Requests</option>
            </select>
            <select className={styles.filterSelect}>
              <option>All Priorities</option>
              <option>High Priority</option>
              <option>Normal Priority</option>
              <option>Low Priority</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className={styles.notificationsList}>
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type)
            return (
              <div 
                key={notification.id} 
                className={`${styles.notificationCard} ${
                  !notification.isRead ? styles.unreadCard : ''
                }`}
              >
                <div className={styles.notificationContent}>
                  <div className={styles.notificationBody}>
                    <div className={`${styles.iconContainer} ${getIconBackgroundClass(notification.priority)}`}>
                      <IconComponent className={`${styles.notificationIcon} ${getIconColorClass(notification.priority)}`} />
                    </div>

                    <div className={styles.notificationDetails}>
                      <div className={styles.titleRow}>
                        <h3 className={`${styles.notificationTitle} ${
                          !notification.isRead ? styles.unreadTitle : styles.readTitle
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className={styles.unreadIndicator}></div>
                        )}
                        <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        {notification.actionRequired && (
                          <span className={styles.actionRequiredBadge}>
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className={styles.notificationMessage}>{notification.message}</p>
                      <p className={styles.notificationTimestamp}>{notification.timestamp}</p>
                    </div>
                  </div>

                  <div className={styles.notificationActions}>
                    {notification.actionRequired && !notification.isRead && (
                      <div className={styles.actionButtons}>
                        <button className={styles.approveButton}>
                          <CheckCircle className={styles.actionButtonIcon} />
                        </button>
                        <button className={styles.rejectButton}>
                          <XCircle className={styles.actionButtonIcon} />
                        </button>
                      </div>
                    )}
                    <button className={styles.viewButton}>
                      <Eye className={styles.actionButtonIcon} />
                    </button>
                    <button className={styles.deleteButton}>
                      <Trash2 className={styles.actionButtonIcon} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreButton}>
            Load More Notifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notifications