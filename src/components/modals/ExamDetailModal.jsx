import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from "../../utils/api"
import { Link } from 'react-router-dom';

const EventDetailModal = ({ selectedEvent, onClose, onBookmark, isBookmarked }) => {
  const [loading, setLoading] = useState(true);

  // 모달이 열릴 때 해당 자격증 리뷰 가져오기
  useEffect(() => {
    if (!selectedEvent) return;
  }, [selectedEvent]);

  if (!selectedEvent) return null;

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedEvent.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* 자격증 기본 정보 */}
        <div style={{ marginBottom: '20px' }}>
          <p><strong>🗓️ 시험일자:</strong> {selectedEvent.start}</p>
          <p><strong>🎯 라운드:</strong> {selectedEvent.extendedProps.round}</p>
          <p><strong>📝 유형:</strong> {selectedEvent.extendedProps.type}</p>
          <p><strong>📄 응시자격:</strong> {selectedEvent.extendedProps.eligibility}</p>
          <a href={selectedEvent.extendedProps.officialSite} target="_blank" rel="noopener noreferrer">
            🔗 공식 사이트 바로가기
          </a>
        </div>

        {/* 찜하기 버튼 */}
        <div style={{ marginBottom: '20px' }}>
          <Button variant={isBookmarked ? "danger" : "primary"} onClick={onBookmark}>
            {isBookmarked ? "찜 해제" : "찜하기"}
          </Button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {/* 상세페이지 이동 버튼 */}
        <Link to={`/certificate/${selectedEvent.extendedProps.certificateId}`}>
          <Button variant="info" onClick={onClose} style={{ marginRight: '10px' }}>
            상세페이지 보기
          </Button>
        </Link>

        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailModal;