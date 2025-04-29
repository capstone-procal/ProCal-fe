import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../utils/api';

const ReviewWriteModal = ({ show, onClose, certificateId, onSuccess }) => {
  const [category, setCategory] = useState('후기');
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState(3);

  const handleSubmit = async () => {
    try {
      const body = {
        certificateId,
        category,
        content,
        difficulty: category === '후기' ? difficulty : undefined,
      };

      await api.post('/review', body);
      onSuccess?.(); // 성공 콜백
      onClose();
    } catch (err) {
      console.error('리뷰 등록 실패:', err);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>후기/TIP 작성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reviewCategory" className="mb-3">
            <Form.Label>구분</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="후기">후기</option>
              <option value="TIP">TIP</option>
            </Form.Select>
          </Form.Group>

          {category === '후기' && (
            <Form.Group controlId="difficulty" className="mb-3">
              <Form.Label>난이도 (1~5)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={5}
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
              />
            </Form.Group>
          )}

          <Form.Group controlId="reviewContent" className="mb-3">
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
        <Button variant="secondary" onClick={onClose}>취소</Button>
        <Button variant="primary" onClick={handleSubmit}>등록</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewWriteModal;
