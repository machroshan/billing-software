import React from 'react';
import { ShoppingCart, Package, BarChart3, FileText, Settings, User, Home } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: { name: string; role: string };
}

export default function Header({ currentView, onViewChange, user }: HeaderProps) {
  const navItems = [
    { id: 'pos', label: 'Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Purchase', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 border-b border-yellow-500">
      {/* Menu Bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-2 py-1">
        <div className="flex items-center space-x-6 text-sm">
          <span className="font-medium">File</span>
          <span className="font-medium">Edit</span>
          <span className="font-medium">View</span>
          <span className="font-medium">Purchase</span>
          <span className="font-medium">Inventory</span>
          <span className="font-medium">Accounts</span>
          <span className="font-medium">General</span>
          <span className="font-medium">Reports</span>
          <span className="font-medium">Tools</span>
          <span className="font-medium">Alert</span>
          <span className="font-medium">Help</span>
          <span className="font-medium">Exit</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Toolbar Icons */}
            <button className="p-1 hover:bg-yellow-500 rounded">
              <FileText size={16} />
            </button>
            <button className="p-1 hover:bg-yellow-500 rounded">
              <Settings size={16} />
            </button>
            <div className="w-px h-6 bg-gray-400 mx-2"></div>
            <button className="p-1 hover:bg-yellow-500 rounded">
              <Home size={16} />
            </button>
            <div className="w-px h-6 bg-gray-400 mx-2"></div>
            
            {/* Navigation Buttons */}
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium ${
                  currentView === id
                    ? 'bg-yellow-500 text-black shadow-inner'
                    : 'hover:bg-yellow-500 text-black'
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right text-sm">
              <div className="font-medium text-black">{user.name}</div>
              <div className="text-xs text-gray-700 capitalize">{user.role}</div>
            </div>
            <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}