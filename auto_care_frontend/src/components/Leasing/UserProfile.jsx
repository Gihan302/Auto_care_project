'use client';

import React from 'react';
import { User, Heart } from 'lucide-react';

const UserProfile = () => {
  const savedPlans = [
    {
      id: 1,
      name: "Premium Plan - Elite Vehicle",
      company: "Elite Vehicle Leasing"
    },
    {
      id: 2,
      name: "Basic Plan - Premium Auto",
      company: "Premium Auto Lease"
    }
  ];

  return (
    <div className="bg-white py-8 px-6 rounded-xl shadow-lg border border-[#222725]/20 h-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1E201E] mb-6 text-center">
          Your Profile
        </h2>
        
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="w-12 h-12 bg-[#eae3da] rounded-full flex items-center justify-center shadow-md">
            <User size={24} className="text-[#1E201E]" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-[#1E201E]">John Smith</p>
            <p className="text-sm text-[#222725] font-medium">john.smith@email.com</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-bold text-lg text-[#1E201E] mb-4 text-center">
            Saved Plans ({savedPlans.length})
          </h3>
          <div className="space-y-4">
            {savedPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-4 border-2 border-[#222725]/20 rounded-lg bg-white hover:border-[#1E201E]/40 transition-all duration-300">
                <div>
                  <p className="font-bold text-[#1E201E]">{plan.name}</p>
                  <p className="text-sm text-[#222725] font-medium">{plan.company}</p>
                </div>
                <Heart size={18} className="text-red-500 fill-red-500" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-[#eae3da] text-[#1E201E] py-3 px-6 rounded-lg hover:bg-[#d4c9b8] transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 