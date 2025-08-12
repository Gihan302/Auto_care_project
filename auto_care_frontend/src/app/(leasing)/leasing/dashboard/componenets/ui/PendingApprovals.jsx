import React from 'react';

const PendingApprovals = ({ pendingApprovals }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {approval.customer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{approval.customer.name}</p>
                <p className="text-gray-500 text-xs">{approval.lease}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  approval.priority === 'Urgent'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {approval.priority}
                </span>
                <p className="text-xs text-gray-500 mt-1">{approval.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;