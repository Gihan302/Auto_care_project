'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/axios';
import Image from 'next/image';

const AdvertisementPage = () => {
  const params = useParams();
  const { id } = params;
  const [ad, setAd] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchAd = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/advertisement/getAdById/${id}`);
          setAd(response.data);
        } catch (err) {
          console.error('Failed to fetch advertisement:', err);
          setError('Failed to load advertisement. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAd();
    }
  }, [id]);

  useEffect(() => {
    if (ad) {
      const fetchImages = async () => {
        const imagePromises = [1, 2, 3, 4, 5].map(index =>
          api.get(`/advertisement/getimage/${ad.id}/${index}`).catch(() => null)
        );
        const responses = await Promise.all(imagePromises);
        const imageUrls = responses
          .filter(res => res && res.data)
          .map(res => res.data);
        setImages(imageUrls);
        if (imageUrls.length > 0) {
          setMainImage(imageUrls[0]);
        }
      };
      fetchImages();
    }
  }, [ad]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading advertisement...</p>
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

  if (!ad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Advertisement not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{ad.adTitle}</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-6">LKR {ad.price.toLocaleString()}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {mainImage && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image src={mainImage} alt="Main advertisement view" layout="fill" objectFit="cover" />
                </div>
              )}
              <div className="flex space-x-2 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer" onClick={() => setMainImage(img)}>
                    <Image src={img} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="font-medium text-gray-600">Manufacturer:</p><p className="text-gray-900">{ad.manufacturer}</p></div>
                  <div><p className="font-medium text-gray-600">Model:</p><p className="text-gray-900">{ad.model}</p></div>
                  <div><p className="font-medium text-gray-600">Year:</p><p className="text-gray-900">{ad.m_year}</p></div>
                  <div><p className="font-medium text-gray-600">Condition:</p><p className="text-gray-900">{ad.v_condition}</p></div>
                  <div><p className="font-medium text-gray-600">Mileage:</p><p className="text-gray-900">{ad.mileage} km</p></div>
                  <div><p className="font-medium text-gray-600">Transmission:</p><p className="text-gray-900">{ad.transmission}</p></div>
                  <div><p className="font-medium text-gray-600">Fuel Type:</p><p className="text-gray-900">{ad.fuel_type}</p></div>
                  <div><p className="font-medium text-gray-600">Engine (cc):</p><p className="text-gray-900">{ad.e_capacity}</p></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Seller Information</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-600">Name:</span> {ad.name}</p>
                  <p><span className="font-medium text-gray-600">Location:</span> {ad.location}</p>
                  <p><span className="font-medium text-gray-600">Contact:</span> {ad.t_number}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Description</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{ad.description}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdvertisementPage;
