import React, { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import api from "../../utils/api";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";

function MarketWriteModal({ show, onClose, onItemCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await api.post("/market", {
        title,
        description,
        price,
        image,
      });

      onItemCreated(res.data.item);

      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      onClose();
    } catch (err) {
      alert("등록 실패: " + err.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>글쓰기</Modal.Title>
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
            <Form.Label>이미지</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <CloudinaryUploadWidget uploadImage={setImage} />
              {image && (
                <Image src={image} thumbnail style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              )}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!title || !price}>
          등록
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MarketWriteModal;