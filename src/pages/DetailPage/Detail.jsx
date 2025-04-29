import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, Button } from 'react-bootstrap';
import api from '../../utils/api'; 
import ReviewWriteModal from '../../components/modals/ReviewWriteModal'; 

const Detail = () => {
  const { id } = useParams(); 
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tipReviews, setTipReviews] = useState([]);
  const [reviewReviews, setReviewReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get(`/certificate/${id}`);
        setCertificate(res.data.certificate);

        // 후기/팁 가져오기
        const reviewRes = await api.get(`/certificate/${id}`);
        const allReviews = reviewRes.data.reviews || [];
        const tips = allReviews.filter(r => r.category === "TIP");
        const reviews = allReviews.filter(r => r.category === "후기");
        setTipReviews(tips);
        setReviewReviews(reviews);

      } catch (err) {
        console.error('상세 정보 가져오기 실패:', err);
        setError('자격증 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!certificate) return <div className="p-4">자격증 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{certificate.name}</h2>
      <p className="mb-2"><strong>분류:</strong> {certificate.category.join(', ')}</p>
      <p className="mb-2"><strong>응시 자격:</strong> {certificate.eligibility}</p>
      <p className="mb-2"><strong>합격 기준:</strong> {certificate.passingCriteria}</p>
      <p className="mb-2">
        <strong>공식 사이트:</strong> <a href={certificate.officialSite} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{certificate.officialSite}</a>
      </p>

      {/* 후기/팁 탭 추가 */}
      <div className="mt-8">
        <Tabs defaultActiveKey="review" id="review-tab" className="mb-3">
          <Tab eventKey="review" title="후기">
            {reviewReviews.length > 0 ? (
              reviewReviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-300 py-2">
                  <p><strong>작성자:</strong> {review.userId.name}</p>
                  <p><strong>내용:</strong> {review.content}</p>
                  <p><strong>난이도:</strong> {review.difficulty} / 5</p>
                </div>
              ))
            ) : (
              <p>등록된 후기가 없습니다.</p>
            )}
          </Tab>

          <Tab eventKey="tip" title="TIP">
            {tipReviews.length > 0 ? (
              tipReviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-300 py-2">
                  <p><strong>작성자:</strong> {review.userId.name}</p>
                  <p><strong>내용:</strong> {review.content}</p>
                </div>
              ))
            ) : (
              <p>등록된 팁이 없습니다.</p>
            )}
          </Tab>
        </Tabs>
      </div>

      {/* 후기/TIP 작성 버튼 */}
      <div className="mt-5">
        <div className="d-flex gap-3">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            작성하기
          </Button>

          <ReviewWriteModal
            show={showModal}
            onClose={() => setShowModal(false)}
            certificateId={id}
            onSuccess={() => {
              alert('작성 완료!');
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default Detail;
