import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Form, Button, ListGroup } from "react-bootstrap";
import "./CommentList.css"

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comment/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err.message);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post("/comment", {
        postId,
        content: newComment,
      });
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
    } catch (err) {
      alert(err.message || "댓글 작성 실패");
    }
  };

  return (
    <div className="commentlist-container">
      <h5 className="commentlist-title">댓글</h5>

      <Form className="commentlist-form">
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="commentlist-submit-btn">
          <Button size="sm" onClick={handleCommentSubmit}>
            등록
          </Button>
        </div>
      </Form>

      <ListGroup>
        {comments.map((comment) => (
          <ListGroup.Item key={comment._id} className="commentlist-item">
            <div className="commentlist-content">{comment.content}</div>
            <small className="commentlist-author">작성자: {comment.userId?.name || "익명"}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default CommentList;