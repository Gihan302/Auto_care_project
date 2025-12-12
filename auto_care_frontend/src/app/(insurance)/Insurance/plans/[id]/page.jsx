"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./viewPlan.module.css";
import api from "@/utils/axios";

const ViewPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get(`/insurance-plans/${id}`);
        setPlan(response.data);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setMessage("⚠️ Failed to load plan data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlan();
    }
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading plan...</div>;
  if (!plan) return <div className={styles.error}>{message}</div>;

  return (
    <div className={styles.viewPlanContainer}>
      <div className={styles.viewPlanCard}>
        <h2 className={styles.viewPlanTitle}>{plan.planName}</h2>
        
        <div className={styles.detailGroup}>
          <h3 className={styles.detailLabel}>Description</h3>
          <p className={styles.detailValue}>{plan.description}</p>
        </div>

        <div className={styles.detailGroup}>
          <h3 className={styles.detailLabel}>Coverage Details</h3>
          <p className={styles.detailValue}>{plan.coverage}</p>
        </div>

        <div className={styles.detailGroup}>
          <h3 className={styles.detailLabel}>Price (per year)</h3>
          <p className={styles.detailValue}>${plan.price}</p>
        </div>

        <div className={styles.formActions}>
          <button
            className={`${styles.button} ${styles.backButton}`}
            onClick={() => router.push("/Insurance/managePlans")}
          >
            Back to Manage Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPlanPage;
