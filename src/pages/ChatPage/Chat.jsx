import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../utils/api";
import ChatDetailModal from "../../components/modals/ChatDetailModal";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");

        const sorted = [...res.data.conversations].sort((a, b) => {
          const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
          const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
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

  return (
    <div className="container mt-4">
      <h3>채팅 목록</h3>
      <ul className="list-group">
        {conversations.map((conv) => {
          const unread = isUnread(conv);
          return (
            <li
              key={conv._id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                unread ? "bg-light fw-bold" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <div
                onClick={() => !selectedRoom && setSelectedRoom(conv)}
                style={{ flex: 1 }}
              >
                <span>{conv.otherUser?.nickname || "익명"}</span>
                <span className="badge bg-secondary ms-2">
                  {conv.marketTitle}
                </span>
                {unread && (
                  <span className="ms-2">🔴</span>
                )}
              </div>
              <button
                className="btn btn-sm btn-danger ms-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(conv._id);
                }}
              >
                <FaTrash />
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
  );
}

export default Chat;