import React from 'react';
import Sidebar from '../components/Sidebar';
import SearchBanner from '../components/SearchBanner';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <SearchBanner />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 
