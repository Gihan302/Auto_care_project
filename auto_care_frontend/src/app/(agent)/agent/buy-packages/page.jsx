"use client"
import React, { useState, useEffect } from 'react';
import axios from '../../../../utils/axios';
import { getToken } from '../../../../utils/useLocalStorage';
import styles from './buy-packages.module.css';

import { useRouter } from 'next/navigation'; // Import useRouter

const BuyPackagesPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize useRouter

    // Mock data for demonstration
    const mockPackages = [
        {
            pkgId: 1,
            name: "Basic Plan",
            price: 19.99,
            description: "Essential features for new agents.",
            maxAd: 5,
            duration: 30
        },
        {
            pkgId: 2,
            name: "Pro Plan",
            price: 49.99,
            description: "Advanced features for growing businesses.",
            maxAd: 20,
            duration: 90
        },
        {
            pkgId: 3,
            name: "Premium Plan",
            price: 99.99,
            description: "Unlock all features for maximum impact.",
            maxAd: 100,
            duration: 180
        }
    ];

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/packages', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && response.data.length > 0) {
                    setPackages(response.data);
                } else {
                    setPackages(mockPackages); // Display mock data if no real packages
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch packages, displaying mock data.');
                setPackages(mockPackages); // Display mock data on error
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleBuyPackage = async (packageId) => {
        if (window.confirm('Are you sure you want to buy this package?')) {
            // Check if it's a mock package ID
            const isMockPackage = mockPackages.some(pkg => pkg.pkgId === packageId);

            if (isMockPackage && !packages.some(p => p.pkgId === packageId)) { // It's a mock and not a real one
                // Simulate success for mock packages
                alert('Mock Package purchased successfully!');
                router.push('/agent/dashboard');
                return; // Exit function after simulation
            }

            try {
                const token = getToken();
                // Send an empty object as the request body as confirmed earlier
                await axios.post(`/agent/packagepurchase/${packageId}`, {}, { 
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                router.push('/agent/dashboard'); // Redirect to dashboard
            } catch (err) {
                setError('Failed to purchase package');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    // Do not return error div immediately, as we display mock data on error
    // if (error) return <div>Error: {error}</div>; 

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Buy Packages</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message */}
            <div className={styles.packagesGrid}>
                {packages.map((pkg, index) => (
                    <div key={pkg.pkgId ?? index} className={styles.packageCard}>
                        <h2 className={styles.packageTitle}>{pkg.packageName}</h2>
                        <p className={styles.packagePrice}>${pkg.price}</p>
                        <p className={styles.packageDescription}>{pkg.description || 'No description available.'}</p>
                        <ul className={styles.packageFeatures}>
                            <li>{pkg.maxAd} Ads</li>
                            <li>{pkg.duration || 'N/A'} Days</li>
                        </ul>
                        <button onClick={() => handleBuyPackage(pkg.pkgId)} className={styles.buyButton}>
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyPackagesPage;