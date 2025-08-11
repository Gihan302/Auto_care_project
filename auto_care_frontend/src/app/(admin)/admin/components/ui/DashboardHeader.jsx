'use client'

import { Bell, Search, User, Menu } from 'lucide-react'
import { useSidebar } from './ui/SidebarProvider'

const DashboardHeader = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <button className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full text-gray-600 hover:bg-gray-400">
              <User size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader