import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useTheme } from '../utils/ThemeContext';
import { useKeyMapping } from '../utils/KeyMappingContext';
import { clearUserProgress } from '../data/problemsData';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { keyMapping, setKeyMapping } = useKeyMapping();

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Settings
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-8">

            {/* Color Theme Card */}
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-3">Color Theme</h2>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Select your preferred color theme for the application.
              </p>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="form-radio h-5 w-5 text-blue-600 bg-gray-200 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2">Light ☀️</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className={`form-radio h-5 w-5 text-indigo-600 ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'} focus:ring-indigo-500`}
                  />
                  <span className="ml-2">Dark 🌙</span>
                </label>
              </div>
            </div>

            {/* Key Mapping Card */}
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-3">Editor Key Mapping</h2>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose your preferred key bindings for the code editor.
              </p>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="keyMapping"
                    value="default"
                    checked={keyMapping === 'default'}
                    onChange={() => setKeyMapping('default')}
                    className={`form-radio h-5 w-5 text-blue-600 ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'} focus:ring-blue-500`}
                  />
                  <span className="ml-2">Default</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="keyMapping"
                    value="vim"
                    checked={keyMapping === 'vim'}
                    onChange={() => setKeyMapping('vim')}
                    className={`form-radio h-5 w-5 text-indigo-600 ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'} focus:ring-indigo-500`}
                  />
                  <span className="ml-2">Vim</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="keyMapping"
                    value="emacs"
                    checked={keyMapping === 'emacs'}
                    onChange={() => setKeyMapping('emacs')}
                    className={`form-radio h-5 w-5 text-purple-600 ${theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'} focus:ring-purple-500`}
                  />
                  <span className="ml-2">Emacs</span>
                </label>
              </div>
            </div>

            {/* Clear History Card */}
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-3">Clear Submission History</h2>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                This will permanently delete all your submission records and reset your progress.
              </p>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all your submission history and saved code? This action cannot be undone.')) {
                    clearUserProgress();
                    alert('Your history has been cleared.');
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Clear All Data
              </button>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
