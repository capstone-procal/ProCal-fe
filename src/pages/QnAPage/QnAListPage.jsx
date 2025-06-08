import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Button } from "react-bootstrap";
import QnAWriteModal from "../../components/modals/QnAWriteModal";
import { useNavigate } from "react-router-dom";
import "./QnAListPage.css"

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
    <div className="qnalist-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="qnalist-title">Q&A</h2>
        <Button
          className="qnalist-write-btn"
          onClick={() => setShowWriteModal(true)}
        >
          ✏️ 글쓰기
        </Button>
      </div>

      {posts.map((post) => (
        <div
          key={post._id}
          className="qnalist-post-item"
          onClick={() => navigate(`/qna/${post._id}`)}
        >
          <h5 className="qnalist-post-title">{post.title}</h5>
          <small className="qnalist-post-category">
            카테고리: {post.category}
          </small>
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