'use client';

import React from 'react';
import { Star } from 'lucide-react';

const FeaturedCompanies = () => {
  const companies = [
    {
      name: "Premium Auto Lease",
      rating: 4.5,
      reviews: 324,
      description: "Competitive rates with flexible terms and excellent customer service.",
      logo: "LOGO"
    },
    {
      name: "Elite Vehicle Leasing",
      rating: 4.8,
      reviews: 188,
      description: "Luxury vehicles with premium service and maintenance packages.",
      logo: "LOGO"
    },
    {
      name: "Budget Car Lease",
      rating: 4.2,
      reviews: 250,
      description: "Affordable leasing options with transparent pricing and no hidden fees.",
      logo: "LOGO"
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
          Featured Leasing Companies
        </h2>
        <p className="text-lg text-[#222725] mb-12 max-w-2xl mx-auto">
          Discover trusted leasing companies with excellent customer reviews
        </p>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {companies.map((company, index) => (
            <div key={index} className="border-2 border-[#222725]/20 rounded-xl p-8 hover:shadow-xl transition-all duration-300 bg-white hover:border-[#1E201E]/40 transform hover:-translate-y-2 flex-1 min-w-0">
              <div className="text-center mb-6">
                <div className="bg-[#eae3da] w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-[#1E201E] font-bold text-lg mb-4 shadow-md">
                  {company.logo}
                </div>
                <h3 className="font-bold text-xl text-[#1E201E] mb-3">
                  {company.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(company.rating)}
                </div>
                <p className="text-sm text-[#222725] font-medium">
                  ({company.reviews} reviews)
                </p>
              </div>
              
              <p className="text-[#222725] text-base mb-6 text-center leading-relaxed">
                {company.description}
              </p>
              
              <button className="w-full bg-[#1E201E] text-[#ECDFCC] py-3 px-6 rounded-lg hover:bg-[#222725] transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                View Plans
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCompanies; 