import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../utils/api";

function QnAWriteModal({ show, onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("질문");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await api.post("/post", { title, category, content });
      alert("게시글이 등록되었습니다.");
      onPostCreated?.(res.data.post); 
      setTitle("");
      setCategory("질문");
      setContent("");
      onClose();
    } catch (err) {
      alert(err.message || "게시글 등록 실패");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Q&A 글쓰기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>카테고리</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="질문">질문</option>
              <option value="자유">자유</option>
              <option value="to관리자">to관리자</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!title || !content}>
          등록
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QnAWriteModal;