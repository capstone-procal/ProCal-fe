import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../utils/api";
import ChatDetailModal from "../../components/modals/ChatDetailModal";
import "./Chat.css";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");

        const sorted = [...res.data.conversations].sort((a, b) => {
          const timeA = new Date(
            a.lastMessage?.createdAt || a.updatedAt || 0
          ).getTime();
          const timeB = new Date(
            b.lastMessage?.createdAt || b.updatedAt || 0
          ).getTime();
          return timeB - timeA;
        });

        setConversations(sorted);
      } catch (err) {
        console.error("채팅 목록 불러오기 실패", err);
      }
    };

    fetchConversations();
  }, []);

  const handleDelete = async (roomId) => {
    if (!window.confirm("이 채팅방을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/chat/room/${roomId}`);
      setConversations((prev) => prev.filter((room) => room._id !== roomId));
      if (selectedRoom && selectedRoom._id === roomId) {
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error("삭제 실패", err);
      alert("채팅방 삭제 중 오류가 발생했습니다.");
    }
  };

  const isUnread = (conv) => {
    const lastMsg = conv.lastMessage;
    if (!lastMsg) return false;
    return !lastMsg.isRead && String(lastMsg.senderId) !== userId;
  };

  const markAsRead = async (roomId) => {
    //jiyun
    try {
      await api.patch(`/chat/room/${roomId}/read`);
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === roomId && conv.lastMessage
            ? {
                ...conv,
                lastMessage: { ...conv.lastMessage, isRead: true },
              }
            : conv
        )
      );
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }
  };

return (
  <div className="Main-container chat">
    <div className="chat-card">
      <h1 className="chat-title">채팅 목록</h1>
      <ul className="chat-list">
        {conversations.map((conv) => {
          const unread = isUnread(conv);
          return (
            <li
              key={conv._id}
              className="chat-list-item"
              onClick={() => { 
                  if (!selectedRoom) {
                    setSelectedRoom(conv);
                    markAsRead(conv._id); 
                  }
                }}

              style={{ cursor: "pointer", fontWeight: unread ? "bold" : "normal" }}
            >
              <div className="chat-user">
                <span>{conv.otherUser?.nickname || "익명"}</span>
                <span className="chat-badge">{conv.marketTitle}</span>
                {unread && (
                  <span>🔴</span>
                )}
              </div>
              <button
                className="chat-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(conv._id);
                }}
              >
                <FaTrash/>
              </button>
            </li>
          );
        })}
      </ul>

      {selectedRoom && (
        <ChatDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  </div>  
  );
}

export default Chat;