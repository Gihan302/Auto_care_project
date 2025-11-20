"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
import styles from '../../../(insurance)/Insurance/managePlans/managePlans.module.css'; // Reusing styles

const LeasingDashboardPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // --- FIX 1: Call the new, correct endpoint ---
        const response = await api.get("/leasing-plans");
        
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
      <h1>Leasing Company Dashboard</h1>
      <p>Welcome to your leasing company dashboard!</p>

      <div className={styles.tableWrapper}>
        <h2>Current Offer Plans</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Vehicle Type</th>
              <th>Lease Term</th>
              <th>Interest Rate</th>
              <th>Down Payment</th>
              <th>Monthly Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.loading}>Loading plans...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className={styles.error}>{error}</td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.empty}>No leasing plans found.</td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.planName}</td>
                  <td>{plan.vehicleType}</td>
                  <td>{plan.leaseTerm}</td>
                  <td>{plan.interestRate}%</td>
                  <td>{plan.downPayment}%</td>
                  <td>{plan.monthlyPayment}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeasingDashboardPage;