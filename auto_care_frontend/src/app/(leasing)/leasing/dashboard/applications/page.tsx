"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
import styles from './page.module.css';
import { CheckCircle, XCircle } from 'lucide-react'; // Import icons

interface LeasingApplication {
  id: number;
  planId: number;
  planName: string;
  applicantName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: string;
}

export default function LeasingApplicationsPage() {
  const [applications, setApplications] = useState<LeasingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // --- States for controls ---
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // Removed page and totalPages state as API is not paginated

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/leasing-applications/company", {
        params: {
          status: filterStatus,
          search: searchTerm,
          // Removed page parameter
        },
      });
      console.log("API Response:", response.data);
      
      // API returns a direct array
      setApplications(response.data || []);
      // No totalPages to set
    } catch (err) {
      setError("Failed to fetch applications. Please ensure you are logged in as a leasing company.");
      console.error("Error fetching leasing applications:", err);
      setApplications([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchApplications();
    }, 500); // Debounce search requests

    return () => clearTimeout(handler);
  }, [filterStatus, searchTerm]); // Removed page from dependency array

  const handleUpdateStatus = async (appId: number, newStatus: 'Approved' | 'Rejected') => {
    setUpdatingId(appId);
    try {
      if (newStatus === 'Approved') {
        await api.post(`/leasing-applications/${appId}/approve`);
      } else if (newStatus === 'Rejected') {
        await api.post(`/leasing-applications/${appId}/reject`);
      }
      fetchApplications(); // Refresh data after update
    } catch (err) {
      console.error(`Error updating application ${appId} to status: ${newStatus}`, err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearFilters = () => {
    setFilterStatus('');
    setSearchTerm('');
    // No page to reset
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Leasing Applications</h1>
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
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Plan Name</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.id}</td>
                      <td>{app.planName}</td>
                      <td>{app.applicantName}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`${styles.status} ${styles[app.status.toLowerCase()] || ''}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className={styles.actions}>
                        {app.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Approved')}
                              className={styles.approveButton}
                              disabled={updatingId === app.id}
                            >
                              <CheckCircle size={16} />
                              {updatingId === app.id ? 'Wait...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                              className={styles.rejectButton}
                              disabled={updatingId === app.id}
                            >
                              <XCircle size={16} />
                              {updatingId === app.id ? 'Wait...' : 'Reject'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination controls removed */}
        </>
      )}
    </div>
  );
}
