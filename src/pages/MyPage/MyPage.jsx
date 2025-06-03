import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Container, Row, Col, Card, Image, Button, ListGroup, Dropdown } from 'react-bootstrap';
import EditProfileModal from '../../components/modals/EditProfileModal';

const AVAILABLE_COLORS = ['#54b5e2', '#eeb5ec', '#fa7f12', '#f6e705', '#1aba25'];

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [myExams, setMyExams] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const userRes = await api.get('/user/me');
      setUserInfo(userRes.data);

      const reminderRes = await api.get('/reminder');
      const mappedExams = reminderRes.data.reminders.map((r) => ({
        reminderId: r._id,
        name: r.certificateId.name,
        date: r.certificateId.schedule[0]?.examStart,
        color: r.color || '#f8f9fa',
      }));
      setMyExams(mappedExams);
    } catch (err) {
      console.error('마이페이지 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (reminderId) => {
    if (!window.confirm('해당 시험을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/reminder/${reminderId}`);
      setMyExams((prev) => prev.filter((exam) => exam.reminderId !== reminderId));
    } catch (err) {
      alert(err.message || '삭제 실패');
    }
  };

  const handleColorChange = async (reminderId, color) => {
    try {
      await api.put(`/reminder/${reminderId}`, { color });
      setMyExams((prev) =>
        prev.map((exam) =>
          exam.reminderId === reminderId ? { ...exam, color } : exam
        )
      );
    } catch (err) {
      alert(err.message || '색상 변경 실패');
    }
  };

  const getDday = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diff = target - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `D-${days}` : '시험 종료';
  };

  if (!userInfo) return <Container className="py-5">로딩 중...</Container>;

  return (
    <Container className="py-4">
      <Card className="text-white bg-secondary mb-4 text-center">
        <Card.Body>
          <Card.Title>{userInfo.name}님의 마이페이지</Card.Title>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={4} className="text-center">
          <Image
            src={userInfo.profileImage || '/default-profile.png'}
            roundedCircle
            fluid
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>
                회원정보
                <Button variant="link" onClick={() => setEditModalOpen(true)}>
                  수정
                </Button>
              </Card.Title>
              <Card.Text>
                <strong>이름</strong>: {userInfo.name}
              </Card.Text>
              <Card.Text>
                <strong>닉네임</strong>: {userInfo.nickname}
              </Card.Text>
              <Card.Text>
                <strong>이메일</strong>: {userInfo.email}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>나의 시험</Card.Header>
        <ListGroup variant="flush">
          {myExams.length > 0 ? (
            myExams.map((exam) => (
              <ListGroup.Item
                key={exam.reminderId}
                style={{
                  backgroundColor: exam.color,
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{exam.name} - {getDday(exam.date)}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-dark"
                      size="sm"
                      style={{
                        backgroundColor: exam.color,
                        color: 'black',
                        borderColor: 'gray',
                      }}
                    >
                      색상
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {AVAILABLE_COLORS.map((color) => (
                        <Dropdown.Item
                          key={color}
                          onClick={() => handleColorChange(exam.reminderId, color)}
                          active={exam.color === color}
                        >
                          <div
                            style={{
                              backgroundColor: color,
                              height: '20px',
                              borderRadius: '4px',
                              border: exam.color === color ? '2px solid #000' : '1px solid #ccc',
                            }}
                            title={`색상: ${color}`}
                          />
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(exam.reminderId)}
                  >
                    삭제
                  </Button>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>등록된 시험이 없습니다.</ListGroup.Item>
          )}
        </ListGroup>
      </Card>

      <EditProfileModal
        show={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userInfo={userInfo}
        onUpdate={fetchData}
      />
    </Container>
  );
};

export default MyPage;
