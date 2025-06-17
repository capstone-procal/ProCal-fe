import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import api from "../../utils/api";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";

function MarketWriteModal({ show, onClose, onItemCreated, onItemUpdated, isEdit = false, item = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("판매중");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isEdit && item) {
      setTitle(item.title);
      setDescription(item.description);
      setPrice(item.price);
      setImages(item.images || []);
      setStatus(item.status || "판매중");
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      setStatus("판매중");
    }
  }, [item, isEdit, show]);

  const handleImageUpload = (url) => {
    setImages((prev) => [...prev, url]);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        const res = await api.put(`/market/${item._id}`, {
          title,
          description,
          price,
          images,
          status
        });
        onItemUpdated?.(res.data.item);
      } else {
        const res = await api.post("/market", {
          title,
          description,
          price,
          images,
          status
        });
        onItemCreated?.(res.data.item);
      }
      onClose();
    } catch (err) {
      alert("요청 실패: " + err.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "게시글 수정" : "글쓰기"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="상품명을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품 설명을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>가격</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="숫자만 입력"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>판매 상태</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="판매중">판매중</option>
              <option value="판매완료">판매완료</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이미지</Form.Label>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <CloudinaryUploadWidget uploadImage={handleImageUpload} />
              {images.map((url, idx) => (
                <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                  <Image
                    src={url}
                    thumbnail
                    style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #ddd", borderRadius: "8px" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      borderRadius: "50%",
                      padding: "0 6px",
                      fontSize: "12px",
                      lineHeight: "1"
                    }}
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button variant="secondary" onClick={handleSubmit} disabled={!title || !price}>
          {isEdit ? "수정" : "등록"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MarketWriteModal;