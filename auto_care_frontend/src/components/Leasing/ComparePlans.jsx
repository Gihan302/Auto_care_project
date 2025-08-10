'use client';

import React, { useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';

const ComparePlans = () => {
  const [selectedPlans, setSelectedPlans] = useState([]);

  const plans = [
    {
      id: 1,
      name: "Basic Plan",
      company: "Premium Auto Lease",
      price: "$299/month",
      downPayment: "$3,000 down payment",
      duration: "36 months",
      mileage: "12,000/year",
      maintenance: "Basic",
      isPopular: false
    },
    {
      id: 2,
      name: "Premium Plan",
      company: "Elite Vehicle Leasing",
      price: "$449/month",
      downPayment: "$3,000 down payment",
      duration: "24 months",
      mileage: "15,000/year",
      maintenance: "Full Coverage",
      isPopular: true
    },
    {
      id: 3,
      name: "Economy Plan",
      company: "Budget Car Lease",
      price: "$199/month",
      downPayment: "$1,500 down payment",
      duration: "48 months",
      mileage: "10,000/year",
      maintenance: "Basic",
      isPopular: false
    }
  ];

  const togglePlanSelection = (planId) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  return (
    <div className="bg-white py-12 px-8 rounded-xl shadow-lg border border-[#222725]/20">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#1E201E]">
            Compare Leasing Plans
          </h2>
          <a href="#" className="text-[#1E201E] hover:text-[#222725] font-semibold text-lg transition-colors duration-300">
            + Add to Compare
          </a>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center border-2 border-red-500 p-4">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`border-2 rounded-xl p-8 relative bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-1 min-w-0 border-blue-500 ${
                plan.isPopular 
                  ? 'border-[#1E201E] bg-[#eae3da]/50 shadow-lg' 
                  : 'border-[#222725]/20 hover:border-[#1E201E]/40'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#1E201E] text-[#ECDFCC] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-xl text-[#1E201E] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#222725] font-medium">{plan.company}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedPlans.includes(plan.id)}
                  onChange={() => togglePlanSelection(plan.id)}
                  className="w-6 h-6 text-[#1E201E] border-[#222725] rounded focus:ring-[#1E201E]"
                />
              </div>
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-[#1E201E] mb-2">
                  {plan.price}
                </p>
                <p className="text-sm text-[#222725] font-medium">
                  {plan.downPayment}
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[#222725] font-medium">Lease Duration:</span>
                  <span className="font-bold text-[#1E201E]">{plan.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#222725] font-medium">Mileage Limit:</span>
                  <span className="font-bold text-[#1E201E]">{plan.mileage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#222725] font-medium">Maintenance:</span>
                  <span className="font-bold text-[#1E201E]">{plan.maintenance}</span>
                </div>
              </div>
              
              <button className="w-full bg-[#1E201E] text-[#ECDFCC] py-3 px-6 rounded-lg hover:bg-[#222725] transition-all duration-300 mb-4 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                Select Plan
              </button>
              
              <a 
                href="#" 
                className="flex items-center justify-center gap-2 text-[#1E201E] hover:text-[#222725] text-sm font-medium transition-colors duration-300"
              >
                <MessageCircle size={16} />
                Chat with Agent
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePlans; 