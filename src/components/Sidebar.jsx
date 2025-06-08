import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaUser, FaQuestionCircle, FaStore, FaComments,
  FaUserShield, FaSignInAlt, FaSignOutAlt, FaBars
} from 'react-icons/fa';
import "./Sidebar.css"

const Sidebar = ({ userRole, isLoggedIn, onLogout, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <nav>
          <ul>
            <li><FaHome /><Link to="/">홈</Link></li>
            <li><FaUser /><Link to="/mypage">마이페이지</Link></li>
            <li><FaQuestionCircle /><Link to="/qna">QnA</Link></li>
            <li><FaStore /><Link to="/market">장터</Link></li>
            <li><FaComments /><Link to="/chat">채팅</Link></li>
            {userRole === 'admin' && (
              <li><FaUserShield /><Link to="/admin">관리자페이지</Link></li>
            )}
            {!isLoggedIn ? (
              <li><FaSignInAlt />
                <button onClick={onLoginClick}>로그인</button>
              </li>
            ) : (
              <li><FaSignOutAlt />
                <button onClick={onLogout}>로그아웃</button>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;