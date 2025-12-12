'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import api from '@/utils/axios'
import ApplicationModal from './ApplicationModal'
import { FileText, CheckCircle, XCircle } from 'lucide-react'

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [sortColumn, setSortColumn] = useState('submittedAt')
  const [sortDirection, setSortDirection] = useState('desc')

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await api.get('/insurance-applications/company', {
        params: {
          status: filterStatus,
          search: searchTerm,
          page,
          sort: `${sortColumn},${sortDirection}`,
        },
      })
      setApplications(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchApplications()
    }, 500) // Debounce search requests

    return () => {
      clearTimeout(handler)
    }
  }, [filterStatus, searchTerm, page, sortColumn, sortDirection])

  const handleApprove = async (id) => {
    setUpdatingId(id)
    try {
      await api.post(`/insurance-applications/${id}/approve`)
      fetchApplications()
    } catch (error) {
      console.error(error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (id) => {
    setUpdatingId(id)
    try {
      await api.post(`/insurance-applications/${id}/reject`)
      fetchApplications()
    } catch (error) {
      console.error(error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const getSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ▲' : ' ▼'
    }
    return ''
  }

  const handleClearFilters = () => {
    setFilterStatus('')
    setSearchTerm('')
    setPage(0)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Applications</h1>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.filter}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button onClick={handleClearFilters} className={styles.clearButton}>
            Clear
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    App ID{getSortIndicator('id')}
                  </th>
                  <th onClick={() => handleSort('applicantName')}>
                    Applicant Name{getSortIndicator('applicantName')}
                  </th>
                  <th onClick={() => handleSort('email')}>
                    Email{getSortIndicator('email')}
                  </th>
                  <th>Phone</th>
                  <th>Plan Name</th>
                  <th onClick={() => handleSort('submittedAt')}>
                    Submitted{getSortIndicator('submittedAt')}
                  </th>
                  <th onClick={() => handleSort('status')}>
                    Status{getSortIndicator('status')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.applicantName}</td>
                    <td>{app.email}</td>
                    <td>{app.phone}</td>
                    <td>{app.planName}</td>
                    <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[app.status.toLowerCase()]
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className={styles.viewButton}
                      >
                        <FileText size={16} /> View
                      </button>
                      {app.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className={styles.approveButton}
                            disabled={updatingId === app.id}
                          >
                            <CheckCircle size={16} />{' '}
                            {updatingId === app.id ? 'Wait...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className={styles.rejectButton}
                            disabled={updatingId === app.id}
                          >
                            <XCircle size={16} />{' '}
                            {updatingId === app.id ? 'Wait...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <button onClick={() => setPage(page - 1)} disabled={page === 0}>
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  )
}
