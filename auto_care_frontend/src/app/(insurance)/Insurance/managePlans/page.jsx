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
            <h1 className="text-3xl font-bold mb-6">Manage Insurance Plans</h1>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {plans.map((plan) => (
                            <tr key={plan.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{plan.planName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{plan.coverage}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${plan.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEditPlan(plan)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => handleDeletePlan(plan.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedPlan && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleUpdatePlan}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Insurance Plan</h3>
                                    <div className="mt-2">
                                        <div className="mb-4">
                                            <label htmlFor="planName" className="block text-sm font-medium text-gray-700">Plan Name</label>
                                            <input type="text" name="planName" id="planName" value={selectedPlan.planName} onChange={(e) => setSelectedPlan({ ...selectedPlan, planName: e.target.value })} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="coverage" className="block text-sm font-medium text-gray-700">Coverage</label>
                                            <input type="text" name="coverage" id="coverage" value={selectedPlan.coverage} onChange={(e) => setSelectedPlan({ ...selectedPlan, coverage: e.target.value })} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Premium</label>
                                            <input type="text" name="price" id="price" value={selectedPlan.price} onChange={(e) => setSelectedPlan({ ...selectedPlan, price: e.target.value })} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea name="description" id="description" value={selectedPlan.description} onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlansPage;
