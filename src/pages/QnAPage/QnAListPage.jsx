import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Button } from "react-bootstrap";
import QnAWriteModal from "../../components/modals/QnAWriteModal";
import { useNavigate } from "react-router-dom";

function QnAListPage() {
  const [posts, setPosts] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/post");
      setPosts(res.data.posts);
    } catch (err) {
      alert("글 목록 로딩 실패");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Q&A</h2>
        <Button onClick={() => setShowWriteModal(true)}>✏️ 글쓰기</Button>
      </div>

      {posts.map((post) => (
        <div
          key={post._id}
          className="mb-3 border-bottom pb-2"
          onClick={() => navigate(`/qna/${post._id}`)}
          style={{ cursor: "pointer" }}
        >
          <h5 className="mb-1">{post.title}</h5>
          <small className="text-muted">카테고리: {post.category}</small>
        </div>
      ))}

      <QnAWriteModal
        show={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  );
}

export default QnAListPage;