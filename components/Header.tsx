import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems: { id: View; label: string }[] = [
    { id: 'map', label: 'Mapa de Mesas' },
    { id: 'admin', label: 'Administración' },
    { id: 'reports', label: 'Reportes' },
  ];

  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-violet-500";
  const activeClasses = "bg-violet-600 text-white shadow-lg";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
             <h1 className="text-2xl font-bold text-white">RestauManage</h1>
          </div>
          <nav className="hidden md:flex md:space-x-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`${baseClasses} ${currentView === item.id ? activeClasses : inactiveClasses}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;