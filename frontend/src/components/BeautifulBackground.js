import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BeautifulBackground = ({ children }) => {
  const { theme } = useTheme();

  const backgroundClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/30'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <div className={`min-h-screen ${backgroundClasses} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs for dark theme */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-40 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-40 right-40 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-3000"></div>
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(to right, transparent 24px, rgba(255,255,255,0.03) 24px)`,
                backgroundSize: '48px 48px'
              }}
            ></div>
          </>
        )}
        
        {/* Floating shapes for light theme */}
        {theme === 'light' && (
          <>
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute top-32 right-16 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl animate-bounce delay-1000"></div>
            <div className="absolute bottom-16 left-32 w-28 h-28 bg-indigo-200/20 rounded-full blur-2xl animate-bounce delay-2000"></div>
            <div className="absolute bottom-32 right-32 w-36 h-36 bg-pink-200/15 rounded-full blur-2xl animate-bounce delay-3000"></div>
            
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(to right, transparent 24px, rgba(0,0,0,0.02) 24px)`,
                backgroundSize: '48px 48px'
              }}
            ></div>
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BeautifulBackground;
