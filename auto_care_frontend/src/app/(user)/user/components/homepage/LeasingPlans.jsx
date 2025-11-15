"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/axios";
import styles from "./LeasingPlans.module.css";

export default function LeasingPlans({ showAll = false }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/leasing-plans/public/all");
        setPlans(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Please log in to view leasing plans.");
        } else {
          setError("Failed to fetch leasing plans.");
        }
        console.error("Error fetching leasing plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const plansToShow = showAll ? plans : plans.slice(0, 4);

  return (
    <div id="leasing-plans" className={styles.container}>
      <h2 className={styles.title}>Leasing Plans</h2>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.plansGrid}>
        {plansToShow.map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            <h3>{plan.description}</h3>
            <p>Amount: ${plan.planAmount}</p>
            <p>Installments: {plan.noOfInstallments}</p>
            <p>Interest: {plan.interest}%</p>
            <p className={styles.monthlyPayment}>
              Monthly: ${plan.instAmount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      {!showAll && (
        <div className={styles.viewAllContainer}>
          <Link href="/user/LeasingPlans" className={styles.viewAllButton}>
            View All Plans
          </Link>
        </div>
      )}
    </div>
  );
}
