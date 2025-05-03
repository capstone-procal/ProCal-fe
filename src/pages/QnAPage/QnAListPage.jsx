import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

function QnAListPage() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/post");
        setPosts(res.data.posts);
        setFiltered(res.data.posts); 
      } catch (err) {
        alert(err.message || "게시글을 불러올 수 없습니다.");
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (categoryFilter === "") {
      setFiltered(posts);
    } else {
      setFiltered(posts.filter(post => post.category === categoryFilter));
    }
  }, [categoryFilter, posts]);

  return (
    <div>
      <h2>Q&A 게시판</h2>
      <div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">전체</option>
          <option value="질문">질문</option>
          <option value="자유">자유</option>
          <option value="to관리자">to관리자</option>
        </select>
        <button onClick={() => navigate("/qna/write")}>글쓰기</button>
      </div>
      <ul>
        {filtered.map((post) => (
          <li
            key={post._id}
            onClick={() => navigate(`/qna/${post._id}`)}
            style={{ cursor: "pointer", borderBottom: "1px solid #ddd", padding: "10px" }}
          >
            <strong>[{post.category}]</strong> {post.title} - {post.userId?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QnAListPage;