"use client"
import React, { useState, useEffect } from 'react';
import axios from '../../../../../utils/axios';
import { getToken } from '../../../../../utils/useLocalStorage';
import styles from '../page.module.css';

const ManageApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/insurance-applications/company', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setApplications(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch insurance applications');
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleApprove = async (appId) => {
        try {
            const token = getToken();
            await axios.put(`/insurance-applications/${appId}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setApplications(applications.map(app =>
                app.id === appId ? { ...app, status: 'APPROVED' } : app
            ));
        } catch (err) {
            setError('Failed to approve application');
        }
    };

    const handleReject = async (appId) => {
        try {
            const token = getToken();
            await axios.put(`/insurance-applications/${appId}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setApplications(applications.map(app =>
                app.id === appId ? { ...app, status: 'REJECTED' } : app
            ));
        } catch (err) {
            setError('Failed to reject application');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.dashboard}>
            <h1 className="text-3xl font-bold mb-6">Manage Insurance Applications</h1>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{app.user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{app.insurancePlan.planName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {app.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => handleApprove(app.id)} className="text-green-600 hover:text-green-900">Approve</button>
                                            <button onClick={() => handleReject(app.id)} className="text-red-600 hover:text-red-900 ml-4">Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageApplicationsPage;
