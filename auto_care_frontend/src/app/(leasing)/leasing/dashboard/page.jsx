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
        const response = await api.get("/lcompany/myplans");
        
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
            {/* --- FIX 2: Update table headers to match LPlan model --- */}
            <tr>
              <th>Ad Title</th>
              <th>Plan Amount (LKR)</th>
              <th>Installments</th>
              <th>Interest Rate (%)</th>
              <th>Monthly Payment (LKR)</th>
              <th>Description</th>
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
              // --- FIX 3: Render correct data from the LPlan object ---
              // Note: We access the linked advertisement's title
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.advertisement?.title || 'N/A'}</td>
                  <td>{plan.planAmount.toLocaleString()}</td>
                  <td>{plan.noOfInstallments}</td>
                  <td>{plan.interest}%</td>
                  <td>{plan.instAmount.toLocaleString()}</td>
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

export default LeasingDashboardPage;