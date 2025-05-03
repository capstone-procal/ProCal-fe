import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import CommentList from "./components/CommentList";

function QnADetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("질문");
  const [content, setContent] = useState("");

  useEffect(() => {
    api.get(`/post/detail/${postId}`)
      .then(res => {
        setPost(res.data.post);
        setTitle(res.data.post.title);
        setCategory(res.data.post.category);
        setContent(res.data.post.content);
      })
      .catch(err => alert(err.message || "게시글을 불러올 수 없습니다."));
  }, [postId]);

  const handleUpdate = async () => {
    try {
      await api.put(`/post/${postId}`, { title, category, content });
      alert("수정되었습니다.");
      setEditMode(false);
    } catch (err) {
      alert(err.message || "수정 실패");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await api.delete(`/post/${postId}`);
      alert("삭제되었습니다.");
      navigate("/qna");
    } catch (err) {
      alert(err.message || "삭제 실패");
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <div>
      {editMode ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} /><br />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="질문">질문</option>
            <option value="자유">자유</option>
            <option value="to관리자">to관리자</option>
          </select><br />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} /><br />
          <button onClick={handleUpdate}>저장</button>
          <button onClick={() => setEditMode(false)}>취소</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p><strong>카테고리:</strong> {post.category}</p>
          <p>{post.content}</p>
          <p><em>작성자: {post.userId.name}</em></p>
          <button onClick={() => setEditMode(true)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </>
      )}

      <hr />
      <CommentList postId={postId} />
    </div>
  );
}

export default QnADetailPage;
