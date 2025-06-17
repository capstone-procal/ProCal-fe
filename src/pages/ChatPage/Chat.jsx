import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import api from "../../utils/api";
import ChatDetailModal from "../../components/modals/ChatDetailModal";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { roomId } = useParams();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");
        setConversations(res.data.conversations);

        if (roomId) {
          const found = res.data.conversations.find((room) => room._id === roomId);
          if (found) setSelectedRoom(found);
        }
      } catch (err) {
        console.error("채팅 목록 불러오기 실패", err);
      }
    };
    fetchConversations();
  }, [roomId]);

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

  return (
    <div className="container mt-4">
      <h3>채팅 목록</h3>
      <ul className="list-group">
        {conversations.map((conv) => (
          <li
            key={conv._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <div onClick={() => setSelectedRoom(conv)} style={{ flex: 1 }}>
              <span>{conv.otherUser?.nickname || "익명"}</span>
              <span className="badge bg-secondary ms-2">{conv.marketTitle}</span>
            </div>
            <button
              className="write-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(conv._id);
              }}
            >
              <FaTrash />
            </button>
          </li>
        ))}
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