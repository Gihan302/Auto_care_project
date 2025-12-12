'use client'

import { useState, useEffect } from 'react'
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
import { useRouter } from 'next/navigation'
import api from '@/utils/axios'
import { getToken } from '@/utils/useLocalStorage'

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function StatsCards({ agentStats, loading }) {
  // Define default structure for stats to merge with fetched data
  const baseStats = [
    { title: "Total Ads", icon: Archive, color: "text-blue-500", bgColor: "bg-blue-50", value: "0", change: "+0", changeType: "neutral", key: "totalAds" },
    { title: "Active Ads", icon: Eye, color: "text-green-500", bgColor: "bg-green-50", value: "0", change: "+0", changeType: "neutral", key: "activeAds" },
    { title: "Sold Ads", icon: CheckCircle, color: "text-yellow-500", bgColor: "bg-yellow-50", value: "0", change: "+0", changeType: "neutral", key: "soldAds" },
    { title: "Package Usage", icon: Package, color: "text-red-500", bgColor: "bg-red-50", value: "0/0", change: "N/A", changeType: "neutral", key: "packageUsage" }
  ];

  const displayStats = baseStats.map(stat => {
    if (loading) {
      return { ...stat, value: "...", change: "..." };
    }
    switch (stat.key) {
      case "totalAds":
        return { ...stat, value: agentStats.totalAds?.toString() || "0" };
      case "activeAds":
        return { ...stat, value: agentStats.activeAds?.toString() || "0" };
      case "soldAds":
        return { ...stat, value: agentStats.soldAds?.toString() || "0" };
      case "packageUsage":
        return { ...stat, value: agentStats.packageUsage || "0/0", change: agentStats.packageDaysLeft || "N/A" };
      default:
        return stat;
    }
  });

  return (
    <div className={styles.statsGrid}>
      {displayStats.map((stat, index) => (
        <div 
          key={stat.title}
          className={`${styles.statCard} ${styles[`statCard${index + 1}`]}`}
        >
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${stat.bgColor} ${stat.color}`}>
              <stat.icon className={styles.icon} />
            </div>
            {stat.change && (
              <div className={`${styles.statChange} ${
                stat.changeType === 'positive' ? styles.changePositive : stat.changeType === 'negative' ? styles.changeNegative : styles.changeNeutral
              }`}>
                {stat.change}
              </div>
            )}
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

function RecentActivity({ activities }) {
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
                <div className={`${styles.activityAvatar} ${activity.avatarColor}`}>
                  {activity.initials}
                </div>
                <div className={styles.activityText}>
                  <p className={styles.activityDescription}>
                    <span className={styles.userName}>{activity.user}</span> {activity.action}
                  </p>
                  <p className={styles.activityTime}>
                    <Clock className={styles.clockIcon} />
                    <span>{timeAgo(activity.time)}</span>
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
  const router = useRouter();
  const actions = [
    { title: "Create Ad", icon: FilePlus, color: "blue", href: "/agent/create-ad" },
    { title: "View Messages", icon: MessageSquare, color: "green", href: "/agent/messages" },
    { title: "Buy Packages", icon: Package, color: "yellow", href: "/agent/buy-packages" },
  ]

  return (
    <div className={styles.quickActionsCard}>
      <h3 className={styles.cardTitle}>Quick Actions</h3>
      <div className={styles.actionsGrid}>
        {actions.map((action) => (
          <button
            key={action.title}
            className={`${styles.actionButton} ${styles[`action${action.color}`]}`}
            onClick={() => router.push(action.href)}
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
  const [activities, setActivities] = useState([])
  const [activityLoading, setActivityLoading] = useState(true)
  const [agentStats, setAgentStats] = useState({})
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = getToken()
        const response = await api.get('/agent/recent-activity', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setActivities(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setActivityLoading(false)
      }
    }
    fetchActivities()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken()
        const response = await api.get('/agent/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAgentStats(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

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
      <StatsCards agentStats={agentStats} loading={statsLoading} />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Activity */}
      {activityLoading ? <p>Loading activities...</p> : <RecentActivity activities={activities} />}
    </div>
  )
}
