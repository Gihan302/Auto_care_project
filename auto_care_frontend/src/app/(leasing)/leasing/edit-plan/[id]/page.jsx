"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../../(insurance)/Insurance/createPlan/createPlan.module.css";
import apiClient from "@/utils/axiosConfig";
import { useRouter, useParams } from "next/navigation";

const EditLeasingPlanPage = () => {
  const [planName, setPlanName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await apiClient.get(`/api/leasing-plans/${id}`);
        const plan = response.data;
        setPlanName(plan.planName);
        setVehicleType(plan.vehicleType);
        setLeaseTerm(plan.leaseTerm);
        setInterestRate(plan.interestRate);
        setMonthlyPayment(plan.monthlyPayment);
        setDescription(plan.description);
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
      const response = await apiClient.put(`/api/leasing-plans/${id}`, {
        planName,
        vehicleType,
        leaseTerm,
        interestRate,
        monthlyPayment,
        description,
      });

      if (response.status === 200) {
        setMessage("✅ Plan updated successfully!");
        setTimeout(() => {
          router.push("/leasing/manage-plans");
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
        <h2 className={styles.createPlanTitle}>Edit Leasing Plan</h2>
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
              {loading ? "Updating..." : "Update Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeasingPlanPage;
