import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole, isLoggedIn, onLogout, onLoginClick }) => {
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
          <li style={{ marginBottom: '1rem' }}><Link to="/chat">채팅</Link></li>
          {userRole === 'admin' && (
            <li style={{ marginBottom: '1rem' }}><Link to="/admin">관리자페이지</Link></li>
          )}
          {!isLoggedIn ? (
            <li>
              <button
                onClick={onLoginClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'blue',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                로그인
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'blue',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                로그아웃
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;