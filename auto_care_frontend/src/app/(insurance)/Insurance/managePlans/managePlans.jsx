"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function ManagePlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic Health Plan",
      type: "Health",
      premium: "$1,200/year",
      coverage: "$100,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Premium Life Plan",
      type: "Life",
      premium: "$3,500/year",
      coverage: "$500,000",
      status: "Active",
    },
    {
      id: 3,
      name: "Auto Protect",
      type: "Auto",
      premium: "$900/year",
      coverage: "$50,000",
      status: "Inactive",
    },
  ]);

  const deletePlan = (id) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Manage Plans</h1>
        <button
          className={styles.addButton}
          onClick={() => router.push("/Insurance/newPlan")}
        >
          <Plus className={styles.addIcon} /> Create New Plan
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Type</th>
              <th>Premium</th>
              <th>Coverage</th>
              <th>Status</th>
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.name}</td>
                <td>{plan.type}</td>
                <td>{plan.premium}</td>
                <td>{plan.coverage}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      plan.status === "Active"
                        ? styles.active
                        : styles.inactive
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => router.push(`/plans/${plan.id}`)}
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => router.push(`/plans/edit/${plan.id}`)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deletePlan(plan.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {plans.length === 0 && (
          <p className={styles.empty}>No plans found.</p>
        )}
      </div>
    </div>
  );
}
