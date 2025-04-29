import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './components/EditProfileModal';
import "./css/MyPage.css";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [myExams, setMyExams] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const userRes = await api.get('/user/me');
      setUserInfo(userRes.data);

      const reminderRes = await api.get('/reminder');
      const mappedExams = reminderRes.data.reminders.map((r) => ({
        name: r.certificateId.name,
        date: r.certificateId.schedule[0]?.examStart,
      }));
      setMyExams(mappedExams);
    } catch (err) {
      console.error("마이페이지 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDday = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diff = target - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `D-${days}` : '시험 종료';
  };

  const getColorByExamName = (name) => {
    if (name.includes('토익')) return '#ffe6e6';
    if (name.includes('오픽')) return '#fff7cc';
    if (name.includes('전기기사')) return '#ccffe6';
    return '#f0f0f0';
  };

  if (!userInfo) return <p>로딩 중...</p>;

  return (
    <div className="mypage-container">
      <header className="mypage-header">
        <h2>{userInfo.name}님의 마이페이지</h2>
      </header>

      <section className="profile-section">
        <div className="profile-image-wrapper">
          <img
            src={userInfo.profileImage || "/default-profile.png"}
            alt="프로필"
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <h3>
            회원정보
            <span className="edit-text" onClick={() => setEditModalOpen(true)}>
              수정하기
            </span>
          </h3>
          <p><strong>이름</strong>: {userInfo.name}</p>
          <p><strong>닉네임</strong>: {userInfo.nickname}</p>
          <p><strong>이메일</strong>: {userInfo.email}</p>
        </div>
      </section>

      <section className="exam-section">
        <h3>나의 시험 <span className="edit-text" onClick={() => navigate('/edit-exams')}>수정하기</span></h3>
        <div className="exam-list">
          {myExams.length > 0 ? (
            myExams.map((exam, idx) => (
              <div
                key={idx}
                className="exam-item"
                style={{ backgroundColor: getColorByExamName(exam.name) }}
              >
                {exam.name} {getDday(exam.date)}
              </div>
            ))
          ) : (
            <p>등록된 시험이 없습니다.</p>
          )}
        </div>
      </section>

      <EditProfileModal
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userInfo={userInfo}
        onUpdate={fetchData}
      />
    </div>
  );
};

export default MyPage;