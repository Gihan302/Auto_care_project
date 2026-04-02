"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function CreateNewPlanPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "Health",
    premium: "",
    coverage: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Plan Data:", formData);

    // Here you could send data to backend API
    alert("Plan created successfully!");
    router.push("/manage-plans");
  };

  return (
    <div className={styles.container}>
      <h1>Create New Plan</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Plan Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter plan name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Plan Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Health">Health</option>
            <option value="Life">Life</option>
            <option value="Auto">Auto</option>
            <option value="Travel">Travel</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="premium">Premium</label>
          <input
            type="text"
            id="premium"
            name="premium"
            placeholder="$1200/year"
            value={formData.premium}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="coverage">Coverage</label>
          <input
            type="text"
            id="coverage"
            name="coverage"
            placeholder="$100,000"
            value={formData.coverage}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitBtn}>
            Create Plan
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => router.push("/manage-plans")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
