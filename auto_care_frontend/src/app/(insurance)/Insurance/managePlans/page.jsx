"use client"
import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axios';
import { getToken } from '../../../../utils/useLocalStorage';
import styles from './managePlans.module.css';

const ManagePlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/insurance-plans', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPlans(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch insurance plans');
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleDeletePlan = async (planId) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                const token = getToken();
                await axios.delete(`/insurance-plans/${planId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPlans(plans.filter(p => p.id !== planId));
            } catch (err) {
                setError('Failed to delete insurance plan');
            }
        }
    };

    const handleEditPlan = (plan) => {
        console.log("Edit button clicked for plan:", plan);
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleUpdatePlan = async (e) => {
        e.preventDefault();
        if (!selectedPlan) return;

        try {
            const token = getToken();
            const response = await axios.put(`/insurance-plans/${selectedPlan.id}`, {
                planName: selectedPlan.planName,
                coverage: selectedPlan.coverage,
                price: String(selectedPlan.price), // Assuming price is a string in the request
                description: selectedPlan.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setPlans(plans.map(p => p.id === selectedPlan.id ? selectedPlan : p));
                setIsModalOpen(false);
                setSelectedPlan(null);
            }
        } catch (err) {
            setError('Failed to update insurance plan');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Manage Insurance Plans</h1>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">Plan Name</th>
                            <th scope="col">Coverage</th>
                            <th scope="col">Premium</th>
                            <th scope="col">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.id}>
                                <td>{plan.planName}</td>
                                <td>{plan.coverage}</td>
                                <td>${plan.price}</td>
                                <td className={styles.actionButtons}>
                                    <button onClick={() => handleEditPlan(plan)} className={styles.editButton}>Edit</button>
                                    <button onClick={() => handleDeletePlan(plan.id)} className={styles.deleteButton}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedPlan && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleUpdatePlan} className={styles.modalForm}>
                            <div className={styles.modalBody}>
                                <h3 className={styles.modalTitle}>Edit Insurance Plan</h3>
                                <div className="mt-2">
                                    <div className={styles.formGroup}>
                                        <label htmlFor="planName" className={styles.formLabel}>Plan Name</label>
                                        <input type="text" name="planName" id="planName" value={selectedPlan.planName} onChange={(e) => setSelectedPlan({ ...selectedPlan, planName: e.target.value })} className={styles.formInput} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="coverage" className={styles.formLabel}>Coverage</label>
                                        <input type="text" name="coverage" id="coverage" value={selectedPlan.coverage} onChange={(e) => setSelectedPlan({ ...selectedPlan, coverage: e.target.value })} className={styles.formInput} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="price" className={styles.formLabel}>Premium</label>
                                        <input type="text" name="price" id="price" value={selectedPlan.price} onChange={(e) => setSelectedPlan({ ...selectedPlan, price: e.target.value })} className={styles.formInput} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="description" className={styles.formLabel}>Description</label>
                                        <textarea name="description" id="description" value={selectedPlan.description} onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })} className={styles.formTextarea}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="submit" className={styles.saveButton}>
                                    Save
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlansPage;
