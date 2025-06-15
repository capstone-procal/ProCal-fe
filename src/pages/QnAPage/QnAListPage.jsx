import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Button, Dropdown } from "react-bootstrap";
import QnAWriteModal from "../../components/modals/QnAWriteModal";
import { useNavigate } from "react-router-dom";
import "./QnAListPage.css";
import "../../styles/buttons.css";

function QnAListPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const navigate = useNavigate();

  const CATEGORY_LIST = ["전체", "질문", "자유", "to관리자"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/post");
      setPosts(res.data.posts);
      setFilteredPosts(res.data.posts); 
    } catch (err) {
      alert("글 목록 로딩 실패");
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === "전체") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((p) => p.category === category);
      setFilteredPosts(filtered);
    }
  };

  return (
    <div className="qnalist-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="qnalist-title">Q&A</h2>
        <div className="d-flex align-items-center gap-2">
          <Dropdown onSelect={handleCategorySelect}>
            <Dropdown.Toggle variant="outline-primary" className="write-btn">
              {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {CATEGORY_LIST.map((cat) => (
                <Dropdown.Item key={cat} eventKey={cat}>
                  {cat}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button className="write-btn" onClick={() => setShowWriteModal(true)}>
            ✏️ 글쓰기
          </Button>
        </div>
      </div>

      {filteredPosts.map((post) => (
        <div
          key={post._id}
          className="qnalist-post-item"
          onClick={() => navigate(`/qna/${post._id}`)}
        >
          <h5 className="qnalist-post-title">{post.title}</h5>
          <small className="qnalist-post-category">카테고리: {post.category}</small>
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