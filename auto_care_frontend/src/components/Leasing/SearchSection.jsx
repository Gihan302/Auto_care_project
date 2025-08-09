'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const SearchSection = () => {
  return (
    <div className="bg-white py-12 px-8 rounded-xl shadow-lg border border-[#222725]/20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="centereed">
        <h1 className="text-4xl font-bold text-[#1E201E] mb-4">
          Find Your Perfect Vehicle Lease
        </h1>
        <p className="text-xl text-[#222725] mb-8 max-w-2xl mx-auto">
          Compare plans from top leasing companies and get the best deal.
        </p>
        
        {/* Search Bar */}
        <div className="flex gap-4 mb-8 justify-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by location or company"
              className="w-full px-6 py-4 border-2 border-[#222725]/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1E201E]/20 focus:border-[#1E201E] bg-white text-[#1E201E] placeholder-[#222725]/60"
            />
          </div>
          <button className="bg-[#1E201E] text-[#ECDFCC] px-8 py-4 rounded-xl hover:bg-[#222725] transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Search size={20} />
            Search
          </button>
        </div>    
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 flex-wrap justify-center">
          <select className="px-6 py-3 border-2 border-[#222725]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E201E]/20 focus:border-[#1E201E] bg-white text-[#1E201E] font-medium">
            <option>All Companies</option>
          </select>
          <select className="px-6 py-3 border-2 border-[#222725]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E201E]/20 focus:border-[#1E201E] bg-white text-[#1E201E] font-medium">
            <option>Lease Duration</option>
          </select>
          <select className="px-6 py-3 border-2 border-[#222725]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E201E]/20 focus:border-[#1E201E] bg-white text-[#1E201E] font-medium">
            <option>Monthly Payment</option>
          </select>
          <button className="px-6 py-3 border-2 border-[#222725]/30 rounded-lg hover:bg-[#eae3da] transition-all duration-300 flex items-center gap-2 bg-white text-[#1E201E] font-medium hover:border-[#1E201E]">
            More Filters
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection; 