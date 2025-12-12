'use client'

import { useState } from 'react'
import {
  Users,
  Car,
  DollarSign,
  Clock
} from "lucide-react"
import styles from './page.module.css'

const stats = [
  {
    title: "Total Users",
    value: "12,458",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    change: "+12%",
    changeType: "positive"
  },
  {
    title: "Vehicles Listed",
    value: "8,932",
    icon: Car,
    color: "text-green-500",
    bgColor: "bg-green-50",
    change: "+8%",
    changeType: "positive"
  },
  {
    title: "Active Loans",
    value: "1,245",
    icon: DollarSign,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    change: "+3%",
    changeType: "positive"
  },
  {
    title: "Pending Approvals",
    value: "89",
    icon: Clock,
    color: "text-red-500",
    bgColor: "bg-red-50",
    change: "-5%",
    changeType: "negative"
  }
]

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "applied for a loan",
    time: "2 hours ago",
    status: "Pending",
    initials: "JD",
    avatar: "bg-blue-500"
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "listed a new vehicle",
    time: "4 hours ago",
    status: "Approved",
    initials: "SS",
    avatar: "bg-green-500"
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "updated insurance details",
    time: "6 hours ago",
    status: "Completed",
    initials: "MJ",
    avatar: "bg-purple-500"
  },
  {
    id: 4,
    user: "Emily Brown",
    action: "submitted vehicle inspection",
    time: "8 hours ago",
    status: "Under Review",
    initials: "EB",
    avatar: "bg-pink-500"
  },
  {
    id: 5,
    user: "David Wilson",
    action: "requested loan modification",
    time: "1 day ago",
    status: "Rejected",
    initials: "DW",
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
            <div className={`${styles.statIcon} ${styles[stat.bgColor]} ${styles[stat.color]}`}>
              <stat.icon className={styles.icon} />
            </div>
            <div className={`${styles.statChange} ${
              stat.changeType === 'positive' ? styles.changePositive : styles.changeNegative
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

  const getAvatarClass = (avatar) => {
    const colorMap = {
      'bg-blue-500': styles.avatarBlue,
      'bg-green-500': styles.avatarGreen,
      'bg-purple-500': styles.avatarPurple,
      'bg-pink-500': styles.avatarPink,
      'bg-orange-500': styles.avatarOrange
    }
    return colorMap[avatar] || styles.avatarDefault
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
                <div className={`${styles.activityAvatar} ${getAvatarClass(activity.avatar)}`}>
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
    { title: "Add New User", icon: Users, color: "blue" },
    { title: "List Vehicle", icon: Car, color: "green" },
    { title: "Process Loan", icon: DollarSign, color: "yellow" },
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
            <h2 className={styles.welcomeTitle}>Good morning, Admin! 👋</h2>
            <p className={styles.welcomeSubtitle}>Here's what's happening with your auto care platform today.</p>
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