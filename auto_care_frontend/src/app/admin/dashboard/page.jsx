'use client'

import { useState } from 'react'
import {
  Users,
  Car,
  DollarSign,
  Clock
} from "lucide-react"
import Sidebar from '../layout'
import Header from '../layout'
import styles from './page.module.css'

const stats = [
  {
    title: "Total Users",
    value: "12,458",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Vehicles Listed",
    value: "8,932",
    icon: Car,
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  {
    title: "Active Loans",
    value: "1,245",
    icon: DollarSign,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10"
  },
  {
    title: "Pending Approvals",
    value: "89",
    icon: Clock,
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  }
]

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "applied for a loan",
    time: "2 hours ago",
    status: "Pending",
    initials: "JD"
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "listed a new vehicle",
    time: "4 hours ago",
    status: "Approved",
    initials: "SS"
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "updated insurance details",
    time: "6 hours ago",
    status: "Completed",
    initials: "MJ"
  },
  {
    id: 4,
    user: "Emily Brown",
    action: "submitted vehicle inspection",
    time: "8 hours ago",
    status: "Under Review",
    initials: "EB"
  },
  {
    id: 5,
    user: "David Wilson",
    action: "requested loan modification",
    time: "1 day ago",
    status: "Rejected",
    initials: "DW"
  }
]

function StatsCards() {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div 
          key={stat.title}
          className={styles.statCard}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={styles.statContent}>
            <div className={styles.statText}>
              <p className={styles.statTitle}>{stat.title}</p>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
            <div className={`${styles.statIcon} ${styles[stat.bgColor]}`}>
              <stat.icon className={`${styles.icon} ${styles[stat.color]}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RecentActivity() {
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return styles.statusPending
      case "Approved":
      case "Completed":
        return styles.statusApproved
      case "Under Review":
        return styles.statusReview
      case "Rejected":
        return styles.statusRejected
      default:
        return styles.statusDefault
    }
  }

  return (
    <div className={styles.activityCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Recent Activity</h3>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.activityList}>
          {activities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityLeft}>
                <div className={styles.activityAvatar}>
                  {activity.initials}
                </div>
                <div className={styles.activityText}>
                  <p className={styles.activityDescription}>
                    <span className={styles.userName}>{activity.user}</span> {activity.action}
                  </p>
                  <p className={styles.activityTime}>{activity.time}</p>
                </div>
              </div>
              <div className={`${styles.statusBadge} ${getStatusClass(activity.status)}`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className={styles.container}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className={`${styles.main} ${isCollapsed ? styles.mainExpanded : ''}`}>
        <Header setIsMobileOpen={setIsMobileOpen} />
        
        <div className={styles.content}>
          <StatsCards />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}