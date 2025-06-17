import React, { useState,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../utils/api';

const ReviewWriteModal = ({ show, onClose, certificateId, onSuccess, editingReview }) => {
  const [category, setCategory] = useState('review');
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState(3);

  useEffect(() => {
    if (editingReview) {
      setCategory(editingReview.category);
      setContent(editingReview.content);
      setDifficulty(editingReview.difficulty);
    } else {
      setCategory('review');
      setContent('');
      setDifficulty(3);
    }
  }, [editingReview, show]);

  const handleSubmit = async () => {
    const body = {
      certificateId,
      category,
      content,
      difficulty,
    };

    console.log("보낼 body:", body);

    try {
      if (editingReview) {
        await api.put(`/review/${editingReview._id}`, body);
      } else {
        await api.post('/review', body);
      }
      onSuccess?.();
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
              <option value="review">후기</option>
              <option value="tip">TIP</option>
            </Form.Select>
          </Form.Group>

         
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
      <Button variant="secondary" onClick={handleSubmit}>
        {editingReview ? '수정' : '등록'}
      </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewWriteModal;
