import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import CommentList from "../../components/lists/CommentList";
import { Container, Form, Button, Card } from "react-bootstrap";
import "./QnADetailPage.css"

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

  if (!post) return <Container className="py-4">로딩 중...</Container>;

  return (
    <Container className="py-4">
      {editMode ? (
        <Card className="p-4">
          <h3 className="mb-4">게시글 수정</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>카테고리</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="질문">질문</option>
                <option value="자유">자유</option>
                <option value="to관리자">to관리자</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                저장
              </Button>
            </div>
          </Form>
        </Card>
      ) : (
        <Card className="qnadetail-card">
          <h2 className="qnadetail-title">{post.title}</h2>
          <p className="qnadetail-category">
            <strong>카테고리:</strong> {post.category}
          </p>
          <p className="qnadetail-content">{post.content}</p>
          <p className="qnadetail-author">
            <em>작성자: {post.userId.name}</em>
          </p>
          <div className="qnadetail-button-group">
            <Button variant="outline-primary" onClick={() => setEditMode(true)}>
              수정
            </Button>
            <Button variant="outline-danger" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </Card>
      )}

      <hr className="my-5" />

      <CommentList postId={postId} />
    </Container>
  );
}

export default QnADetailPage;