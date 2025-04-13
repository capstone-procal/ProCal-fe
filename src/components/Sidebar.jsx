import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <nav>
        <ul>
          <li>홈</li>
          <li>상세페이지</li>
          <li>마이페이지</li>
          <li>QnA</li>
          <li>장터</li>
          <li>채팅</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
