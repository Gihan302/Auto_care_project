'use client'

import { useSidebar } from './ui/SidebarProvider'
import { 
  Home, 
  Users, 
  Car, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react'

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar()

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Manage Users', href: '/manage-users' },
    { icon: Car, label: 'Manage Vehicles', href: '/manage-vehicles' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isOpen ? 'lg:w-16' : 'lg:w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className={`font-bold text-white text-lg ${!isOpen && 'lg:hidden'}`}>
            Admin Panel
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg text-gray-300 
                  hover:text-white hover:bg-gray-800 transition-colors
                  ${item.label === 'Notifications' ? 'bg-gray-800 text-white' : ''}
                `}
              >
                <Icon size={20} />
                <span className={`${!isOpen && 'lg:hidden'}`}>
                  {item.label}
                </span>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <LogOut size={20} />
            <span className={`${!isOpen && 'lg:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default AppSidebar