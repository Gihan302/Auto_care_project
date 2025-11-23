"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
// Reuse existing styles from managePlans or create a new one if needed
import styles from '../../../../(insurance)/Insurance/managePlans/managePlans.module.css'; 

// Define an interface for the application data
interface InsuranceApplication {
  id: number;
  planId: number;
  planName: string;
  applicantName: string;
  email: string;
  phone: string;
  status: string; // e.g., 'Pending', 'Approved', 'Rejected'
  submittedAt: string;
  // Add more fields as per your backend model
}

export default function InsuranceApplicationsPage() {
  const [applications, setApplications] = useState<InsuranceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/insurance-applications/company"); 
        
        const appsData = Array.isArray(response.data) ? response.data : [];
        setApplications(appsData);
      } catch (err) {
        setError("Failed to fetch applications. Please ensure you are logged in as an insurance company.");
        console.error("Error fetching insurance applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Placeholder for status update function
  const handleUpdateStatus = async (appId: number, newStatus: string) => {
    // Implement API call to update application status
    console.log(`Updating application ${appId} to status: ${newStatus}`);
    // Example: await api.put(`/insurance-applications/${appId}/status`, { status: newStatus });
    // After successful update, refresh the applications list
  };

  return (
    <div className={styles.container}>
      <h1>Manage Insurance Applications</h1>
      <p>View and manage all submitted insurance applications for your company.</p>

      <div className={styles.tableWrapper}>
        <h2>Submitted Applications</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Plan Name</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={styles.loading}>Loading applications...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className={styles.error}>{error}</td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>No insurance applications found.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.planName}</td>
                  <td>{app.applicantName}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className={styles.messageButton} // Reusing messageButton style
                      onClick={() => handleUpdateStatus(app.id, 'Approved')}
                      disabled={app.status === 'Approved'}
                      style={{ marginRight: '5px' }}
                    >
                      Approve
                    </button>
                    <button 
                      className={styles.viewAllButton} // Reusing viewAllButton style
                      onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                      disabled={app.status === 'Rejected'}
                    >
                      Reject
                    </button>
                    {/* Add a link to view full application details if needed */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
