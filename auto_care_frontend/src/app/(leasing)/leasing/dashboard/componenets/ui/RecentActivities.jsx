import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const RecentActivities = ({ recentActivities }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                activity.type === 'approval' ? 'bg-green-50' :
                activity.type === 'application' ? 'bg-blue-50' : 'bg-yellow-50'
              }`}>
                {activity.icon === 'CheckCircle' && <CheckCircle className={`w-4 h-4 ${activity.color}`} />}
                {activity.icon === 'FileText' && <FileText className={`w-4 h-4 ${activity.color}`} />}
                {activity.icon === 'AlertTriangle' && <AlertTriangle className={`w-4 h-4 ${activity.color}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;