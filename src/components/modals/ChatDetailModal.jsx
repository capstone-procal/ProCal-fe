import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../utils/api";
import "./ChatDetailModal.css";

function ChatDetailModal({ room, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef(null);
  const userId = sessionStorage.getItem("userId");

  const [isSending, setIsSending] = useState(false); //jiyun

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/messages/${room._id}`);
      const markedMessages = res.data.messages.map((msg) => ({
        ...msg,
        isMine: String(msg.senderId?._id ?? msg.senderId) === userId,
      }));
      setMessages(markedMessages);
    } catch (err) {
      console.error("메시지 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [room._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => { //jiyun
    if (!newMsg.trim() || isSending) return;
    setIsSending(true);
    try {
      await api.post("/chat/message", {
        roomId: room._id,
        text: newMsg,
      });
      setNewMsg("");
      fetchMessages();
    } catch (err) {
      console.error("메시지 전송 실패", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{room.otherUser?.nickname}님과의 채팅</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="chat-box mb-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`d-flex flex-column ${
                msg.isMine ? "align-items-end" : "align-items-start"
              }`}
            >
              <div className={`chat-bubble ${msg.isMine ? "mine" : "other"}`}>
                <span className="sender">{msg.senderId.nickname}</span>
                <div>{msg.text}</div>
              </div>
              <div
                className="time"
                style={{
                  fontSize: "0.75rem",
                  color: "#888",
                  marginTop: "2px",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.repeat) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요..."
          />
          <Button onClick={handleSend} variant="secondary" className="ms-2">
            전송
          </Button>
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
}

export default ChatDetailModal;
