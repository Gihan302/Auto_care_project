"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../createPlan/createPlan.module.css";
import api from "@/utils/axios";
import { useRouter, useParams } from "next/navigation";

const EditPlanPage = () => {
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [coverage, setCoverage] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get(`/api/insurance-plans/${id}`);
        const plan = response.data;
        setPlanName(plan.planName);
        setDescription(plan.description);
        setCoverage(plan.coverage);
        setPrice(plan.price);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setMessage("⚠️ Failed to fetch plan details.");
      }
    };

    if (id) {
      fetchPlan();
    }
  }, [id]);

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.put(`/api/insurance-plans/${id}`, {
        planName,
        description,
        coverage,
        price,
      });

      if (response.status === 200) {
        setMessage("✅ Plan updated successfully!");
        setTimeout(() => {
          router.push("/Insurance/managePlans");
        }, 2000);
      } else {
        setMessage("⚠️ Failed to update plan.");
      }
    } catch (err) {
      console.error("Error updating plan:", err);
      setMessage(
        err.response?.data?.message ||
          "⚠️ An error occurred while updating the plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPlanContainer}>
      <div className={styles.createPlanCard}>
        <h2 className={styles.createPlanTitle}>Edit Insurance Plan</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleUpdatePlan}>
          <div className={styles.formGroup}>
            <label htmlFor="planName">Plan Name</label>
            <input
              id="planName"
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.inputField}
              rows="3"
              required
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverage">Coverage Details</label>
            <textarea
              id="coverage"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              className={styles.inputField}
              rows="5"
              required
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price (per year)</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={`${styles.button} ${styles.createButton}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanPage;