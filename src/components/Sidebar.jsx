import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '200px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '2rem',
        borderRight: '1px solid #ccc',
      }}
    >
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem' }}><Link to="/">홈</Link></li>
          <li style={{ marginBottom: '1rem' }}><Link to="/mypage">마이페이지</Link></li>
          <li style={{ marginBottom: '1rem' }}><Link to="/qna">QnA</Link></li>
          <li style={{ marginBottom: '1rem' }}><Link to="/market">장터</Link></li>
          <li><Link to="/chat">채팅</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
