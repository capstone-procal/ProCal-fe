import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

function QnA() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("질문");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/post", { title, category, content });
      alert("게시글이 등록되었습니다.");
      navigate("/qna");
    } catch (err) {
      alert(err.message || "게시글 등록 실패");
    }
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="질문">질문</option>
          <option value="자유">자유</option>
          <option value="to관리자">to관리자</option>
        </select><br />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        /><br />

        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default QnA;