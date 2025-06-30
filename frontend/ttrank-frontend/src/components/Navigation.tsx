import { useState } from 'react';

interface NavigationProps {
  currentView: 'athletes' | 'events';
  onViewChange: (view: 'athletes' | 'events') => void;
  userInitials: string;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  userInitials, 
  onLogout 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'athletes', label: 'Atletas', view: 'athletes' as const },
    { id: 'events', label: 'Meus Eventos', view: 'events' as const },
  ];

  return (
    <nav className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏓</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">TTRank</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.view)}
                className={`text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-neutral-900 border-b-2 border-primary-400 pb-1'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 bg-primary-400 text-neutral-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-500 transition-colors"
          >
            <span>Olá, {userInitials}</span>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
              <button
                onClick={() => {
                  onLogout();
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 flex space-x-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.view)}
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              currentView === item.view
                ? 'bg-primary-100 text-primary-800'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;