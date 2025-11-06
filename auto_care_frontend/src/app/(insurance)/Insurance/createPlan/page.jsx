"use client";

import React, { useState, useEffect } from "react";
import styles from "./createPlan.module.css";
import apiClient from "@/utils/axios";
import { useRouter } from "next/navigation";

const CreatePlanPage = () => {
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [coverage, setCoverage] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.roles) {
      const userRoles = user.roles.map(role => role.name || role);
      if (userRoles.includes('ROLE_ICOMPANY')) {
        setIsAuthorized(true);
      } else {
        router.push('/signin');
      }
    } else {
      router.push('/signin');
    }
  }, [router]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/api/insurance-plans", {
        planName,
        description,
        coverage,
        price,
      });

      if (response.status === 201) {
        setMessage("✅ Plan created successfully!");
        // Clear form
        setPlanName("");
        setDescription("");
        setCoverage("");
        setPrice("");
        // Redirect to manage plans page after a short delay
        setTimeout(() => {
          router.push("/Insurance/managePlans");
        }, 2000);
      } else {
        setMessage("⚠️ Failed to create plan.");
      }
    } catch (err) {
      console.error("Error creating plan:", err);
      setMessage(
        err.response?.data?.message ||
          "⚠️ An error occurred while creating the plan."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return <div>Loading...</div>; // Or a proper loader component
  }

  return (
    <div className={styles.createPlanContainer}>
      <div className={styles.createPlanCard}>
        <h2 className={styles.createPlanTitle}>Create New Insurance Plan</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleCreatePlan}>
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
              {loading ? "Creating..." : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanPage;
