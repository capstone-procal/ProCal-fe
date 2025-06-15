import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../../utils/api';
import './EditProfileModal.css';
import "../../styles/buttons.css"
import CloudinaryUploadWidget from '../../utils/CloudinaryUploadWidget';

const EditProfileModal = ({ show, onClose, userInfo, onUpdate }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setNickname(userInfo.nickname);
      setEmail(userInfo.email);
      setProfileImage(userInfo.profileImage || '');
    }
  }, [userInfo]);

  const handleSave = async () => {
    if (!name.trim()) return alert("이름을 입력해주세요.");
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");
    if (!email.trim()) return alert("이메일을 입력해주세요.");

    try {
      setSaving(true);
      await api.put('/user/update', {
        name,
        nickname,
        email,
        password: password || undefined,  // 비밀번호를 입력 안 했으면 undefined로 보내서 무시
        profileImage,
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('회원정보 업데이트 실패', error);
      alert(error.response?.data?.error || '회원정보 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = (url) => {
    setProfileImage(url);
    setUploadError('');
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>회원정보 수정</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mt-2">
            <Form.Label>이름</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>비밀번호 (변경 시 입력)</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="변경하지 않을 경우 비워두세요"
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>프로필 사진</Form.Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CloudinaryUploadWidget uploadImage={handleUploadImage} />
              {profileImage ? (
                <img src={profileImage} alt="프로필" className="preview-image" />
              ) : (
                <div className="preview-placeholder">미리보기 없음</div>
              )}
            </div>
            {uploadError && <Alert variant="danger" className="mt-2">{uploadError}</Alert>}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button className='write-btn' onClick={onClose} disabled={saving}>
          취소
        </Button>
        <Button className='write-btn' onClick={handleSave} disabled={saving}>
          {saving ? <Spinner size="sm" animation="border" /> : "저장"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;