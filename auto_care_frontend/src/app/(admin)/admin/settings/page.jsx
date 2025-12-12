"use client"
import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axios';
import { getToken } from '../../../../utils/useLocalStorage';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        siteName: '',
        adminEmail: '',
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/admin/settings', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSettings(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch settings');
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSaveSettings = async () => {
        try {
            const token = getToken();
            await axios.post('/admin/settings', settings, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Settings saved successfully!');
        } catch (err) {
            setError('Failed to save settings');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>

                <div className="mb-4">
                    <label htmlFor="siteName" className="block text-gray-700 font-medium mb-2">Site Name</label>
                    <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={settings.siteName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="adminEmail" className="block text-gray-700 font-medium mb-2">Admin Email</label>
                    <input
                        type="email"
                        id="adminEmail"
                        name="adminEmail"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={settings.adminEmail}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="maintenanceMode"
                        name="maintenanceMode"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={settings.maintenanceMode}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-gray-700">Enable Maintenance Mode</label>
                </div>

                <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={handleSaveSettings}
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
