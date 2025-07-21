import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../utils/ThemeContext';

// NavLink component for navigation items
interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isActive = location.pathname === to || 
    (to === '/' && location.pathname.startsWith('/problems/'));
  
  return (
    <Link 
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive 
        ? (theme === 'dark' 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-200 text-gray-800')
        : (theme === 'dark' 
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800')}`}
    >
      {label}
    </Link>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <header className={`border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold">LunchCode</h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <NavLink to="/" label="Problems" />
              <NavLink to="/progress" label="Progress" />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className={`border-t mt-auto py-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} LunchCode - A Problem Solved over a Lunch Break</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
