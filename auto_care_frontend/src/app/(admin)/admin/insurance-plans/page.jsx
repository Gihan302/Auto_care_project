"use client";

import { useState, useEffect } from "react";
import styles from "../../../(insurance)/Insurance/managePlans/managePlans.module.css";
import { api } from "@/utils/axios";

export default function AdminManagePlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/admin/insurance-plans");
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>All Insurance Plans</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Description</th>
              <th>Coverage</th>
              <th>Price</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles.loading}>Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className={styles.error}>{error}</td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.empty}>No plans found.</td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.planName}</td>
                  <td>{plan.description}</td>
                  <td>{plan.coverage}</td>
                  <td>{plan.price}</td>
                  <td>{plan.user.cName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {plans.length === 0 && (
          <p className={styles.empty}>No plans found.</p>
        )}
      </div>
    </div>
  );
}
