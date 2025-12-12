"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import api from '@/utils/axios';
// We can reuse the same styles from the other dashboard
import styles from '../../../(insurance)/Insurance/managePlans/managePlans.module.css'; 

const InsuranceDashboardPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Call the new endpoint for the insurance company
        const response = await api.get("/icompany/myplans");
        
        const plansData = Array.isArray(response.data) ? response.data : [];
        setPlans(plansData);
      } catch (err) {
        setError("Failed to fetch plans. Are you logged in?");
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Insurance Company Dashboard</h1>
      <p>Welcome to your insurance company dashboard!</p>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Link href="/Insurance/dashboard/applications" className={styles.viewAllButton}>
          Manage Applications
        </Link>
        <Link href="/Insurance/managePlans" className={styles.viewAllButton}>
          Manage Plans
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <h2>Current Offer Plans</h2>
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
                  <td>{plan.price.toLocaleString()}</td>
                  <td>{plan.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsuranceDashboardPage;