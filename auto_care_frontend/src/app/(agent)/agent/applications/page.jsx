'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import api from '@/utils/axios'

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // This endpoint needs to be created.
        // It should fetch all applications (leasing and insurance) for the current agent.
        const response = await api.get('/agent/applications')
        setApplications(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Applications</h1>
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Income</th>
              <th>Employment Status</th>
              <th>Application Type</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.fullName}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.address}</td>
                <td>{app.income}</td>
                <td>{app.employmentStatus}</td>
                <td>{app.applicationType}</td>
                <td>{app.adTitle}</td>
                <td>{app.status}</td>
                <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
