import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comment/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return alert("내용을 입력해주세요.");
    try {
      await api.post("/comment", { postId, content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      alert(err.message || "댓글 등록 실패");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/comment/${commentId}`);
      fetchComments();
    } catch (err) {
      alert(err.message || "댓글 삭제 실패");
    }
  };

  const handleCommentEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleEditSubmit = async (commentId) => {
    try {
      await api.put(`/comment/${commentId}`, { content: editedContent });
      setEditingCommentId(null);
      setEditedContent("");
      fetchComments();
    } catch (err) {
      alert(err.message || "댓글 수정 실패");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h3>댓글</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.userId.name}</strong>:
            {editingCommentId === comment._id ? (
              <>
                <input
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => handleEditSubmit(comment._id)}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
              </>
            ) : (
              <>
                {comment.content}
                <button onClick={() => handleCommentEdit(comment._id, comment.content)}>수정</button>
                <button onClick={() => handleCommentDelete(comment._id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <textarea
        rows="3"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요"
      /><br />
      <button onClick={handleCommentSubmit}>댓글 등록</button>
    </div>
  );
}

export default CommentList;
