import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, Button } from "react-bootstrap";
import api from "../../utils/api";
import ReviewWriteModal from "../../components/modals/ReviewWriteModal";
import "./Detail.css";

const Detail = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tipReviews, setTipReviews] = useState([]);
  const [reviewReviews, setReviewReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const fetchCertificate = async () => {
    try {
      const res = await api.get(`/certificate/${id}`);
      setCertificate(res.data.certificate);
      const reviewRes = await api.get(`/review/${id}`);
      const allReviews = reviewRes.data.reviews || [];
      const tips = allReviews.filter((r) => r.category === "tip");
      const reviews = allReviews.filter((r) => r.category === "review");
      setTipReviews(tips);
      setReviewReviews(reviews);
    } catch (err) {
      console.error("상세 정보 가져오기 실패:", err);
      setError("자격증 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/review/${reviewId}`);
      alert("삭제 완료!");
      await fetchCertificate();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!certificate)
    return <div className="p-4">자격증 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="detail-container">
      <div className="detail-detail">
        <h2 className="detail-header">{certificate.name}</h2>
        <p className="detail-section">
          <strong>분류:</strong> {certificate.category.join(", ")}
        </p>
        <p className="detail-section">
          <strong>응시 자격:</strong> {certificate.eligibility}
        </p>
        <p className="detail-section">
          <strong>합격 기준:</strong> {certificate.passingCriteria}
        </p>
        <p className="detail-section">
          <strong>공식 사이트:</strong>{" "}
          <a
            href={certificate.officialSite}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "black" }}
          >
            {certificate.officialSite}
          </a>
        </p>
      </div>

      <div className="detail-tabs">
        <Tabs defaultActiveKey="review" id="review-tab" className="mb-3">
          <Tab eventKey="review" title="후기">
            {reviewReviews.length > 0 ? (
              reviewReviews.map((review, idx) => (
                <div key={idx} className="detail-review-box">
                  <p>
                    <strong>작성자:</strong> {review.userId.name}
                  </p>
                  <p>
                    <strong>내용:</strong> {review.content}
                  </p>
                  <p>
                    <strong>난이도:</strong> {review.difficulty} / 5
                  </p>

                  {(review.userId._id === sessionStorage.getItem("userId") ||
                    sessionStorage.getItem("userRole") === "admin") && (
                    <div className="detail-review-buttons">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => {
                          const token = sessionStorage.getItem("token");
                          if (!token) {
                            alert(
                              "로그인이 필요한 기능입니다. 로그인 후 이용해 주세요."
                            );
                            return;
                          }
                          handleEdit(review);
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => {
                          const token = sessionStorage.getItem("token");
                          if (!token) {
                            alert(
                              "로그인이 필요한 기능입니다. 로그인 후 이용해 주세요."
                            );
                            return;
                          }
                          handleDelete(review._id);
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>등록된 후기가 없습니다.</p>
            )}
          </Tab>

          <Tab eventKey="tip" title="TIP">
            {tipReviews.length > 0 ? (
              tipReviews.map((review, idx) => (
                <div key={idx} className="detail-review-box">
                  <p>
                    <strong>작성자:</strong> {review.userId.name}
                  </p>
                  <p>
                    <strong>내용:</strong> {review.content}
                  </p>

                  <div className="detail-review-buttons">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => {
                        const token = sessionStorage.getItem("token");
                        if (!token) {
                          alert(
                            "로그인이 필요한 기능입니다. 로그인 후 이용해 주세요."
                          );
                          return;
                        }
                        handleEdit(review);
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => {
                        const token = sessionStorage.getItem("token");
                        if (!token) {
                          alert(
                            "로그인이 필요한 기능입니다. 로그인 후 이용해 주세요."
                          );
                          return;
                        }
                        handleDelete(review._id);
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>등록된 팁이 없습니다.</p>
            )}
          </Tab>
        </Tabs>
      </div>

      <div className="mt-5">
        <div className="d-flex gap-3">
          <Button
            className="write-btn"
            onClick={() => {
              const token = sessionStorage.getItem("token");
              if (!token) {
                alert("로그인이 필요한 기능입니다. 로그인 후 이용해 주세요.");
                return;
              }
              setShowModal(true);
            }}
          >
            작성하기
          </Button>

          <ReviewWriteModal
            show={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingReview(null);
            }}
            certificateId={id}
            editingReview={editingReview}
            onSuccess={async () => {
              alert("작성 완료!");
              setEditingReview(null);
              await fetchCertificate();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
