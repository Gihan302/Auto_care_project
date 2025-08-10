'use client';

import React from 'react';
import { Star, User } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      text: "Excellent service from Premium Auto Lease. The process was smooth and the agent was very helpful throughout."
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4.5,
      text: "Great platform for comparing different leasing options. Found the perfect deal for my budget."
    },
    {
      id: 3,
      name: "Lola Brown",
      rating: 4,
      text: "The chat feature made it easy to get answers quickly. Highly recommend this platform!"
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-white py-12 px-8 rounded-xl shadow-lg border border-[#222725]/20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#1E201E] mb-4">
          Customer Reviews
        </h2>
        <p className="text-lg text-[#222725] mb-12 max-w-2xl mx-auto">
          See what our customers say about their leasing experience
        </p>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {reviews.map((review) => (
            <div key={review.id} className="border-2 border-[#222725]/20 rounded-xl p-8 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-6 justify-center">
                <div className="w-12 h-12 bg-[#eae3da] rounded-full flex items-center justify-center shadow-md">
                  <User size={24} className="text-[#1E201E]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-[#1E201E]">{review.name}</p>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              
              <p className="text-[#222725] text-base leading-relaxed text-center italic">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews; 