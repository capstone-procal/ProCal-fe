import React from "react";
import { Modal, Button } from "react-bootstrap";

function MarketDetailModal({ show, onHide, item }) {
  if (!item) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{item.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>작성자:</strong> {item.author || "익명"}</p>
        <p><strong>내용:</strong></p>
        <p>{item.content}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MarketDetailModal;
