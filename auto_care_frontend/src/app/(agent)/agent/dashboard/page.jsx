'use client'

import { useState } from 'react'
import {
  FilePlus,
  MessageSquare,
  Package,
  Eye,
  CheckCircle,
  Archive,
  Clock
} from "lucide-react"
import styles from './page.module.css'

const stats = [
  {
    title: "Total Ads",
    value: "58",
    icon: Archive,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    change: "+5",
    changeType: "positive"
  },
  {
    title: "Active Ads",
    value: "42",
    icon: Eye,
    color: "text-green-500",
    bgColor: "bg-green-50",
    change: "+2",
    changeType: "positive"
  },
  {
    title: "Sold Ads",
    value: "16",
    icon: CheckCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    change: "+3",
    changeType: "positive"
  },
  {
    title: "Package Usage",
    value: "25/50",
    icon: Package,
    color: "text-red-500",
    bgColor: "bg-red-50",
    change: "15 days left",
    changeType: "neutral"
  }
]

const activities = [
  {
    id: 1,
    user: "Buyer123",
    action: "sent an inquiry on 'Toyota Camry 2020'",
    time: "1 hour ago",
    status: "New Message",
    initials: "B",
    avatar: "bg-blue-500"
  },
  {
    id: 2,
    user: "You",
    action: "marked 'Honda Civic 2018' as sold",
    time: "3 hours ago",
    status: "Sold",
    initials: "Y",
    avatar: "bg-green-500"
  },
  {
    id: 3,
    user: "You",
    action: "created a new ad for 'Ford Mustang 2022'",
    time: "5 hours ago",
    status: "Active",
    initials: "Y",
    avatar: "bg-purple-500"
  },
  {
    id: 4,
    user: "Buyer456",
    action: "sent an inquiry on 'Ford Mustang 2022'",
    time: "2 hours ago",
    status: "New Message",
    initials: "B",
    avatar: "bg-pink-500"
  },
  {
    id: 5,
    user: "You",
    action: "purchased 'Pro Agent' package",
    time: "1 day ago",
    status: "Completed",
    initials: "Y",
    avatar: "bg-orange-500"
  }
]

function StatsCards() {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div 
          key={stat.title}
          className={`${styles.statCard} ${styles[`statCard${index + 1}`]}`}
        >
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${stat.bgColor} ${stat.color}`}>
              <stat.icon className={styles.icon} />
            </div>
            <div className={`${styles.statChange} ${
              stat.changeType === 'positive' ? styles.changePositive : stat.changeType === 'negative' ? styles.changeNegative : styles.changeNeutral
            }`}>
              {stat.change}
            </div>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statTitle}>{stat.title}</p>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function RecentActivity() {
  const getStatusClass = (status) => {
    switch (status) {
      case "New Message":
        return styles.statusPending
      case "Sold":
      case "Completed":
      case "Active":
        return styles.statusApproved
      default:
        return styles.statusDefault
    }
  }

  return (
    <div className={styles.activityCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderContent}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <button className={styles.viewAllButton}>
            View All
          </button>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.activityList}>
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`${styles.activityItem} ${styles[`activityItem${index + 1}`]}`}
            >
              <div className={styles.activityLeft}>
                <div className={`${styles.activityAvatar} ${activity.avatar}`}>
                  {activity.initials}
                </div>
                <div className={styles.activityText}>
                  <p className={styles.activityDescription}>
                    <span className={styles.userName}>{activity.user}</span> {activity.action}
                  </p>
                  <p className={styles.activityTime}>
                    <Clock className={styles.clockIcon} />
                    <span>{activity.time}</span>
                  </p>
                </div>
              </div>
              <span className={`${styles.statusBadge} ${getStatusClass(activity.status)}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuickActions() {
  const actions = [
    { title: "Create Ad", icon: FilePlus, color: "blue" },
    { title: "View Messages", icon: MessageSquare, color: "green" },
    { title: "Buy Packages", icon: Package, color: "yellow" },
  ]

  return (
    <div className={styles.quickActionsCard}>
      <h3 className={styles.cardTitle}>Quick Actions</h3>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <button
            key={action.title}
            className={`${styles.actionButton} ${styles[`action${action.color}`]}`}
          >
            <action.icon className={styles.actionIcon} />
            <span className={styles.actionText}>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeText}>
            <h2 className={styles.welcomeTitle}>Good morning, Agent! 👋</h2>
            <p className={styles.welcomeSubtitle}>Here's what's happening with your listings today.</p>
          </div>
          <div className={styles.dateSection}>
            <p className={styles.dateLabel}>Today</p>
            <p className={styles.dateValue}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
