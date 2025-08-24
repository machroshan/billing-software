import React from 'react';
import { ShoppingCart, User, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: { name: string; role: string };
}

export default function Header({ currentView, onViewChange, user }: HeaderProps) {
  const navItems = [
    { id: 'pos', label: 'POS', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Settings },
    { id: 'reports', label: 'Reports', icon: User }
  ];

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">RetailPro</h1>
            <span className="text-blue-200">Billing & Inventory Management</span>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === id
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-blue-200 capitalize">{user.role}</div>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}