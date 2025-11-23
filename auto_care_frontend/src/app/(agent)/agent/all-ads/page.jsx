'use client'
import React, { useState, useEffect } from 'react';
import api from '@/utils/axios';
import Link from 'next/link';

const AllAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAds = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/advertisement/getallads');
        setAds(response.data);
      } catch (err) {
        console.error('Failed to fetch all ads:', err);
        setError('Failed to load advertisements. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAds();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading all advertisements...</p>
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Vehicle Advertisements</h1>
        {ads.length === 0 ? (
          <p className="text-gray-600">There are no advertisements to display.</p>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{ad.title}</h2>
                  <p className="text-gray-700">Price: LKR {ad.price.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm">Posted on: {new Date(ad.datetime).toLocaleDateString()}</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link href={`/advertisement/${ad.id}`} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
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

export default AllAdsPage;