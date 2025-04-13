import React from 'react';

const SearchBanner = () => {
  return (
    <div className="bg-white shadow p-4">
      <input
        type="text"
        placeholder="자격증 검색..."
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default SearchBanner;
