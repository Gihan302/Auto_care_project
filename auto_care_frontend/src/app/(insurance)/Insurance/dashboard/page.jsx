"use client";

import React, { useState, useEffect } from 'react';
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

      <div className={styles.tableWrapper}>
        <h2>Current Offer Plans</h2>
        <table className={styles.table}>
          <thead>
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
                <td colSpan="6" className={styles.empty}>No insurance plans found.</td>
              </tr>
            ) : (
              // Render data from the IPlan object
              // Note: We use plan.planAmt (from IPlan) instead of plan.planAmount
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.advertisement?.title || 'N/A'}</td>
                  <td>{plan.planAmt.toLocaleString()}</td>
                  <td>{plan.noOfInstallments}</td>
                  <td>{plan.interest}%</td>
                  <td>{plan.instAmt.toLocaleString()}</td>
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