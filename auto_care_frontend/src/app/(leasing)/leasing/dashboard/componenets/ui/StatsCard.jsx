import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
          {/* Use the icon prop to render the appropriate icon */}
          {stat.icon === 'Car' && <Car className={`w-6 h-6 ${stat.color}`} />}
          {stat.icon === 'Clock' && <Clock className={`w-6 h-6 ${stat.color}`} />}
          {stat.icon === 'DollarSign' && <DollarSign className={`w-6 h-6 ${stat.color}`} />}
          {stat.icon === 'Users' && <Users className={`w-6 h-6 ${stat.color}`} />}
        </div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
        <p className="text-xs text-gray-500">{stat.change}</p>
      </div>
    </div>
  );
};

export default StatsCard;