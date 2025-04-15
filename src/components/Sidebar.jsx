import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside>
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/mypage">마이페이지</Link></li>
          <li><Link to="/qna">QnA</Link></li>
          <li><Link to="/market">장터</Link></li>
          <li><Link to="/chat">채팅</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
