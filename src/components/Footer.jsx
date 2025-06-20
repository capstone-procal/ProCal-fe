import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p className="footer-text">© 2025 Procal. All rights reserved.</p>
        <div className="footer-links">
            <a href="https://github.com/capstone-procal/ProCal-fe">♡FRONTEND♡</a>
            <a href="https://github.com/capstone-procal/ProCal-be">♡BACKEND♡</a>
        </div>
        <div className="footer-details">
          <p><strong>주식회사 프로컬컴퍼니</strong></p>
          <p>주소: 서울시 구로구 연동로 320 | 대표이사: 나도모름</p>
          <p>전자우편주소: abcdefg@icloud.com | 전화번호: 1234-5678</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
