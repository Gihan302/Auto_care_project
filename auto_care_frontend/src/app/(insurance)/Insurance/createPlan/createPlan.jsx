"use client";

import { useState, useEffect } from "react";
import styles from "./createPlan.module.css";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";

export default function CreateInsurancePlanPage() {
  const router = useRouter();
  const [planName, setPlanName] = useState("");
  const [coverage, setCoverage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const response = await api.post("/api/insurance-plans", {
        planName,
        coverage,
        price,
        description,
      });

      if (response.status === 200) {
        setMessage("✅ Plan created successfully!");
        setPlanName("");
        setCoverage("");
        setPrice("");
        setDescription("");
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
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverage">Coverage</label>
            <input
              id="coverage"
              type="text"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
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
}
