import React from 'react';
import Sidebar from '../components/Sidebar';
import SearchBanner from '../components/SearchBanner';

const MainLayout = ({ children, userRole, isLoggedIn, onLogout, onLoginClick }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-52 min-w-[200px] h-full bg-gray-100 border-r border-gray-300">
        <Sidebar userRole={userRole} isLoggedIn={isLoggedIn} onLogout={onLogout} onLoginClick={onLoginClick} />
      </aside>

      <div className="flex flex-col flex-1">
        <SearchBanner />
        <main className="flex-1 overflow-y-auto p-4" style={{ marginLeft: '200px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;