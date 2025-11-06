"use client";

import React, { useState } from "react";
import styles from "../../../(insurance)/Insurance/createPlan/createPlan.module.css";
import apiClient from "@/utils/axios";
import { useRouter } from "next/navigation";

const CreateLeasingPlanPage = () => {
  const [planName, setPlanName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/api/leasing-plans", {
        planName,
        vehicleType,
        leaseTerm,
        interestRate,
        monthlyPayment,
        description,
      });

      if (response.status === 200) {
        setMessage("✅ Plan created successfully!");
        // Clear form
        setPlanName("");
        setVehicleType("");
        setLeaseTerm("");
        setInterestRate("");
        setMonthlyPayment("");
        setDescription("");
        // Redirect to manage plans page after a short delay
        setTimeout(() => {
          router.push("/leasing/manage-plans");
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
        <h2 className={styles.createPlanTitle}>Create New Leasing Plan</h2>
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
            <label htmlFor="vehicleType">Vehicle Type</label>
            <input
              id="vehicleType"
              type="text"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="leaseTerm">Lease Term (months)</label>
            <input
              id="leaseTerm"
              type="number"
              value={leaseTerm}
              onChange={(e) => setLeaseTerm(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="monthlyPayment">Monthly Payment</label>
            <input
              id="monthlyPayment"
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
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
};

export default CreateLeasingPlanPage;
