import React from 'react';
import { Filter, Download } from 'lucide-react';

const ActiveLeasingPlans = ({ activePlans }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Leasing Plans</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Monthly</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activePlans.map((plan) => (
                <tr key={plan.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {plan.customer.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{plan.customer.name}</p>
                        <p className="text-gray-500 text-xs">{plan.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-900">{plan.vehicle}</td>
                  <td className="py-4 text-gray-600">{plan.duration}</td>
                  <td className="py-4 font-medium text-gray-900">{plan.monthly}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {plan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveLeasingPlans;