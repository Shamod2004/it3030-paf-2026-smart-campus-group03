import React from 'react';
import { Home, Database, Calendar, Ticket, Bell, UserCircle, Building2, Menu, X } from 'lucide-react';

const Sidebar = ({ activeItem = 'tickets', onMenuClick, isCollapsed = false, onToggleCollapse, onSwitchRole }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Database, label: 'Resources', id: 'resources' },
    { icon: Calendar, label: 'Bookings', id: 'bookings' },
    { icon: Ticket, label: 'Tickets', id: 'tickets' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: UserCircle, label: 'Profile', id: 'profile' }
  ];

  const handleMenuItemClick = (itemId) => {
    if (onMenuClick) {
      onMenuClick(itemId);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0 lg:static lg:inset-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-60'}
        w-64 bg-gray-50 h-full flex flex-col border-r border-gray-200
      `}>
        {/* Header */}
        <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-3 border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                {/* Logo Icon */}
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">Smart Campus</h1>
                  <p className="text-xs font-bold text-gray-900 leading-tight">Operation Hub</p>
                </div>
              </div>
            )}
            
            {/* Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="lg:flex hidden items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`
                w-full flex items-center px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all duration-200
                ${activeItem === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Switch Role */}
        {!isCollapsed && onSwitchRole && (
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={onSwitchRole}
              className="w-full text-xs text-gray-400 hover:text-blue-600 transition-colors text-left"
            >
              Switch to Student View →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
