import React from "react";
import { Modal, Image, Row, Col, Carousel, Button } from "react-bootstrap";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

function MarketDetailModal({ show, onHide, item, currentUserId, onEditClick, onDelete }) {
  const navigate = useNavigate();
  if (!item) return null;

  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : ["/default-image.png"];

  const user = typeof item.userId === "object" ? item.userId : {};

  const role = sessionStorage.getItem("userRole");
  const isAdmin = role === "admin";
  const isOwner = currentUserId && user._id === currentUserId;
  const canEdit = isOwner || isAdmin;

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await api.delete(`/market/${item._id}`);
        alert("삭제되었습니다.");
        onDelete?.();
        onHide();
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleChat = async () => {
    try {
      const res = await api.post("/chat/room", {
        opponentId: user._id,
        marketId: item._id,
      });
      const roomId = res.data.room._id;
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      alert("채팅 시작에 실패했습니다.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{item.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Carousel fade>
              {images.map((url, idx) => (
                <Carousel.Item key={idx}>
                  <Image
                    src={url}
                    alt={`image-${idx}`}
                    fluid
                    rounded
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <Image
                src={user.profileImage || "/default-profile.png"}
                roundedCircle
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <strong>{user.nickname || "익명 사용자"}</strong>
            </div>

            <p><strong>설명:</strong> {item.description}</p>
            <p><strong>가격:</strong> {typeof item.price === "number" ? item.price.toLocaleString() + "원" : "가격 미정"}</p>
            <p><strong>상태:</strong> {item.status}</p>

            <div className="d-flex gap-2 mt-4">
              {!isOwner && (
                <Button variant="secondary" onClick={handleChat}>
                  채팅
                </Button>
              )}
              {canEdit && (
                <>
                  <Button className="write-btn" onClick={onEditClick}>
                    수정
                  </Button>
                  <Button className="write-btn" onClick={handleDelete}>
                    삭제
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default MarketDetailModal;