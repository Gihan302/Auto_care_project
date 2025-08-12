import React from 'react';

const UserActivitiesChart = ({ chartData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">User Activities</h2>
      </div>
      <div className="p-6">
        <div className="h-64 flex items-end justify-center gap-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="relative h-32 w-8 bg-gray-100 rounded-t">
                <div
                  className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${(data.logins / 200) * 100}%` }}
                />
                <div
                  className="absolute bottom-0 w-full bg-green-500 rounded-t transition-all duration-500 opacity-70"
                  style={{ height: `${(data.applications / 200) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Logins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Applications</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivitiesChart;