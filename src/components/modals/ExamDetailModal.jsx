import React, { useState, useEffect } from 'react';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap';
import api from "../../utils/api"

const EventDetailModal = ({ selectedEvent, onClose, onBookmark, isBookmarked }) => {
  const [reviews, setReviews] = useState([]);
  const [tipReviews, setTipReviews] = useState([]);
  const [reviewReviews, setReviewReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 모달이 열릴 때 해당 자격증 리뷰 가져오기
  useEffect(() => {
    if (!selectedEvent) return;

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/review/certificate/${selectedEvent.extendedProps.certificateId}`);
        const allReviews = res.data.reviews || [];

        // '후기', 'TIP' 구분
        const tip = allReviews.filter(r => r.category === "TIP");
        const review = allReviews.filter(r => r.category === "후기");

        setReviews(allReviews);
        setTipReviews(tip);
        setReviewReviews(review);
      } catch (err) {
        console.error("리뷰 가져오기 실패:", err?.error ?? err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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

        {/* 리뷰/팁 탭 */}
        <Tabs defaultActiveKey="review" id="review-tab" className="mb-3">
          <Tab eventKey="review" title="후기">
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <>
                {reviewReviews.length > 0 ? (
                  reviewReviews.map((review, idx) => (
                    <div key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                      <p><strong>작성자:</strong> {review.userId.name}</p>
                      <p><strong>내용:</strong> {review.content}</p>
                      <p><strong>난이도:</strong> {review.difficulty} / 5</p>
                    </div>
                  ))
                ) : (
                  <p>등록된 후기가 없습니다.</p>
                )}
              </>
            )}
          </Tab>

          <Tab eventKey="tip" title="TIP">
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <>
                {tipReviews.length > 0 ? (
                  tipReviews.map((review, idx) => (
                    <div key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                      <p><strong>작성자:</strong> {review.userId.name}</p>
                      <p><strong>내용:</strong> {review.content}</p>
                    </div>
                  ))
                ) : (
                  <p>등록된 팁이 없습니다.</p>
                )}
              </>
            )}
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailModal;