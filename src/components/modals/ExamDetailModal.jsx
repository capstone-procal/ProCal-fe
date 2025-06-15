import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from "../../utils/api";
import { Link } from 'react-router-dom';
import LoginModal from "../../components/modals/LoginModal";
import "../../styles/buttons.css"

const EventDetailModal = ({ selectedEvent, onClose }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reminderId, setReminderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingBookmark, setPendingBookmark] = useState(false);

  useEffect(() => {
    if (!selectedEvent) return;

    const checkBookmark = async () => {
      try {
        const res = await api.get('/reminder');
        const match = res.data.reminders.find(
          (r) => r.certificateId._id === selectedEvent.extendedProps.certificateId
        );
        if (match) {
          setIsBookmarked(true);
          setReminderId(match._id);
        } else {
          setIsBookmarked(false);
          setReminderId(null);
        }
      } catch (err) {
        console.error('찜 여부 확인 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    checkBookmark();
  }, [selectedEvent]);

  const handleBookmarkToggle = async () => {
    if (!selectedEvent) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      setLoginModalOpen(true);
      setPendingBookmark(true);
      return;
    }

    try {
      if (isBookmarked && reminderId) {
        await api.delete(`/reminder/${reminderId}`);
        setIsBookmarked(false);
        setReminderId(null);
      } else {
        const res = await api.post('/reminder', {
          certificateId: selectedEvent.extendedProps.certificateId,
        });
        setIsBookmarked(true);
        setReminderId(res.data.reminder._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || '찜하기/해제 실패');
    }
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    if (pendingBookmark) {
      setPendingBookmark(false);
      // 로그인 세션 반영 시간 확보 후 실행
      setTimeout(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
          handleBookmarkToggle();
        } else {
          alert("로그인 세션이 적용되지 않았습니다. 다시 시도해주세요.");
        }
      }, 100);
    }
  };

  if (!selectedEvent || loading) return null;

  return (
    <>
      <Modal show={true} onHide={onClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ marginBottom: '20px' }}>
            <p><strong>🗓️ 시험일자:</strong> {selectedEvent.start}</p>
            <p><strong>🎯 라운드:</strong> {selectedEvent.extendedProps.round}</p>
            <p><strong>📝 유형:</strong> {selectedEvent.extendedProps.type}</p>
            <p><strong>📄 응시자격:</strong> {selectedEvent.extendedProps.eligibility}</p>
            <a href={selectedEvent.extendedProps.officialSite} target="_blank" rel="noopener noreferrer">
              🔗 공식 사이트 바로가기
            </a>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Button variant={isBookmarked ? "danger" : "primary"} onClick={handleBookmarkToggle}>
              {isBookmarked ? "찜 해제" : "찜하기"}
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Link to={`/certificate/${selectedEvent.extendedProps.certificateId}`}>
            <Button variant="info" onClick={onClose} style={{ marginRight: '10px' }}>
              상세페이지 보기
            </Button>
          </Link>
          <Button variant="secondary" onClick={onClose}>닫기</Button>
        </Modal.Footer>
      </Modal>

      {loginModalOpen && (
        <LoginModal
          show={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default EventDetailModal;
