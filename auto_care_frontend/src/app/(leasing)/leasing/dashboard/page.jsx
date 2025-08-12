'use client';

import React, { useState } from 'react';
import Header from './components/ui/Header';
import Sidebar from './components/ui/Sidebar';
import StatsCard from './components/ui/StatsCard';
import ActiveLeasingPlans from './components/ui/ActiveLeasingPlans';
import PendingApprovals from './components/ui/PendingApprovals';
import UserActivitiesChart from './components/ui/UserActivitiesChart';
import RecentActivities from './components/ui/RecentActivities';
import './dashboard.module.css';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const stats = [
    {
      title: 'Active Leases',
      value: '247',
      change: '+12% from last month',
      icon: 'Car', // Use string literals for icons
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Approvals',
      value: '18',
      change: '3 urgent reviews',
      icon: 'Clock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+8.2% from last month',
      icon: 'DollarSign',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: '1,429',
      change: '+5.4% from last month',
      icon: 'Users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const activePlans = [
    {
      id: 1,
      customer: { name: 'John Smith', email: 'john@email.com', avatar: 'JS' },
      vehicle: 'BMW X3 2023',
      duration: '36 months',
      monthly: '$899',
      status: 'Active'
    },
    {
      id: 2,
      customer: { name: 'Sarah Johnson', email: 'sarah@email.com', avatar: 'SJ' },
      vehicle: 'Tesla Model Y',
      duration: '24 months',
      monthly: '$1,299',
      status: 'Active'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      customer: { name: 'Mike Wilson', avatar: 'MW' },
      lease: 'Audi A4 Lease',
      priority: 'Urgent',
      time: '2 days ago'
    },
    {
      id: 2,
      customer: { name: 'Emma Davis', avatar: 'ED' },
      lease: 'Honda CR-V Lease',
      priority: 'Normal',
      time: '1 day ago'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'approval',
      title: 'Lease approved for John Smith',
      subtitle: 'BMW X3 2023 • 2 hours ago',
      icon: 'CheckCircle', // Use string literals for icons
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'application',
      title: 'New application submitted',
      subtitle: 'Sarah Johnson - Tesla Model Y • 4 hours ago',
      icon: 'FileText', // Use string literals for icons
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment overdue',
      subtitle: 'Mike Wilson - Audi A4 • 8 hours ago',
      icon: 'AlertTriangle', // Use string literals for icons
      color: 'text-yellow-600'
    }
  ];

  const chartData = [
    { month: 'Jan', logins: 120, applications: 85 },
    { month: 'Feb', logins: 135, applications: 92 },
    { month: 'Mar', logins: 145, applications: 110 },
    { month: 'Apr', logins: 165, applications: 125 },
    { month: 'May', logins: 155, applications: 140 },
    { month: 'Jun', logins: 185, applications: 160 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} lg:${sidebarCollapsed ? 'ml-16' : 'ml-64'} ml-0`}>
        {/* Header */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          setMobileMenuOpen={setMobileMenuOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Leasing Plans */}
            <ActiveLeasingPlans activePlans={activePlans} />

            {/* Pending Approvals */}
            <PendingApprovals pendingApprovals={pendingApprovals} />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* User Activities Chart */}
            <UserActivitiesChart chartData={chartData} />

            {/* Recent Activities */}
            <RecentActivities recentActivities={recentActivities} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;