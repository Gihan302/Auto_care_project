'use client'
import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
import Link from 'next/link';
import styles from './page.module.css'; // Import the CSS module

const SoldAdsPage = () => {
  const [soldAds, setSoldAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSoldAds = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/agent/getad');
        // Assuming 'flag' property indicates status, and 2 means sold
        const filteredAds = response.data.filter(ad => ad.flag === 2);
        setSoldAds(filteredAds);
      } catch (err) {
        console.error('Failed to fetch sold ads:', err);
        setError('Failed to load sold advertisements. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoldAds();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading sold advertisements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className={styles.title}>Sold Advertisements</h1>
        {soldAds.length === 0 ? (
          <p className="text-gray-600">You have no sold advertisements yet.</p>
        ) : (
          <div className="space-y-4">
            {soldAds.map((ad) => (
              <div key={ad.id} className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center">
                {ad.images && ad.images.length > 0 && (
                  <img src={ad.images[0]} alt={ad.title} className="w-32 h-32 object-cover rounded-md mr-4 mb-4 sm:mb-0" />
                )}
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900">{ad.title}</h2>
                  <p className="text-gray-700">Price: LKR {ad.price.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm">Posted on: {new Date(ad.datetime).toLocaleDateString()}</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link href={`/advertisement/${ad.id}`} className={styles.viewDetailsButton}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldAdsPage;