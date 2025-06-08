import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../../utils/api";

function ChatDetailModal({ room, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${room._id}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("메시지 불러오기 실패", err);
      }
    };
    fetchMessages();
  }, [room._id]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await api.post("/chat/message", {
        roomId: room._id,
        text: newMsg,
      });
      setMessages([...messages, res.data.message]);
      setNewMsg("");
    } catch (err) {
      console.error("메시지 전송 실패", err);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{room.otherUser?.nickname}님과의 채팅</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="chat-box mb-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {messages.map((msg) => (
            <div key={msg._id} className={`mb-2 ${msg.isMine ? "text-end" : ""}`}>
              <small><strong>{msg.senderId.nickname}</strong></small>
              <p className="mb-0">{msg.text}</p>
            </div>
          ))}
        </div>
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요..."
          />
          <Button onClick={handleSend} variant="primary" className="ms-2">전송</Button>
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
}

export default ChatDetailModal;