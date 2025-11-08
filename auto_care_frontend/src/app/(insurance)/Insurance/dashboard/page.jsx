


'use client'



import { useState, useEffect } from 'react'

import {

  Users,

  Car,

  DollarSign,

  Clock,

  ShieldCheck,

  FileText,

  Bell,

  TrendingUp

} from "lucide-react"

import styles from './page.module.css'

import api from '@/utils/axios';



const stats = [

  {

    title: "Total Policies",

    value: "5,820",

    icon: ShieldCheck,

    color: "text-blue-500",

    bgColor: "bg-blue-50",

    change: "+5%",

    changeType: "positive"

  },

  {

    title: "New Claims",

    value: "125",

    icon: FileText,

    color: "text-yellow-500",

    bgColor: "bg-yellow-50",

    change: "+10%",

    changeType: "positive"

  },

  {

    title: "Pending Approvals",

    value: "42",

    icon: Clock,

    color: "text-red-500",

    bgColor: "bg-red-50",

    change: "+3",

    changeType: "positive"

  },

  {

    title: "Revenue",

    value: "$1.2M",

    icon: DollarSign,

    color: "text-green-500",

    bgColor: "bg-green-50",

    change: "+8%",

    changeType: "positive"

  }

]



const activities = [

  {

    id: 1,

    user: "Alice Johnson",

    action: "filed a new claim",

    time: "1 hour ago",

    status: "Pending",

    initials: "AJ",

    avatar: "bg-blue-500"

  },

  {

    id: 2,

    user: "Robert Brown",

    action: "renewed their policy",

    time: "3 hours ago",

    status: "Completed",

    initials: "RB",

    avatar: "bg-green-500"

  },

  {

    id: 3,

    user: "Cathy Williams",

    action: "requested a quote",

    time: "5 hours ago",

    status: "Under Review",

    initials: "CW",

    avatar: "bg-purple-500"

  },

  {

    id: 4,

    user: "David Miller",

    action: "claim was approved",

    time: "1 day ago",

    status: "Approved",

    initials: "DM",

    avatar: "bg-pink-500"

  },

  {

    id: 5,

    user: "Emily Davis",

    action: "updated their contact information",

    time: "2 days ago",

    status: "Completed",

    initials: "ED",

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

    { title: "New Policy", icon: ShieldCheck, color: "blue" },

    { title: "Process Claim", icon: FileText, color: "green" },

    { title: "Send Alert", icon: Bell, color: "yellow" },

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



function InsurancePlansDisplay() {

  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    const fetchPlans = async () => {

      const response = await api.get("/api/insurance-plans");

        setPlans(response.data);

      } catch (err) {

        setError("Failed to fetch plans.");

        console.error("Error fetching plans:", err);

      } finally {

        setLoading(false);

      }

    };



    fetchPlans();

  }, []);



  return (

    <div className={styles.plansCard}>

      <h3 className={styles.cardTitle}>Current Insurance Plans</h3>

      <div className={styles.tableWrapper}>

        <table className={styles.table}>

          <thead>

            <tr>

              <th>Plan Name</th>

              <th>Coverage</th>

              <th>Price</th>

              <th>Description</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="4" className={styles.loading}>Loading plans...</td>

              </tr>

            ) : error ? (

              <tr>

                <td colSpan="4" className={styles.error}>{error}</td>

              </tr>

            ) : plans.length === 0 ? (

              <tr>

                <td colSpan="4" className={styles.empty}>No insurance plans found.</td>

              </tr>

            ) : (

              plans.map((plan) => (

                <tr key={plan.id}>

                  <td>{plan.planName}</td>

                  <td>{plan.coverage}</td>

                  <td>{plan.price}</td>

                  <td>{plan.description}</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}



export default function InsuranceDashboardPage() {

  return (

    <div className={styles.dashboard}>

      <div className={styles.welcomeSection}>

        <div className={styles.welcomeContent}>

          <div className={styles.welcomeText}>

            <h2 className={styles.welcomeTitle}>Good morning! 👋</h2>

            <p className={styles.welcomeSubtitle}>Here's an overview of your insurance company's performance today.</p>

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



      <StatsCards />

      

      <QuickActions />

      

      <RecentActivity />



      <InsurancePlansDisplay />

    </div>

  )

}
