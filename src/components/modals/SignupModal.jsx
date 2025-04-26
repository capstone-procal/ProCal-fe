import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

function SignupModal({ show, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (inputEmail) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(inputEmail);
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);

    if (!validateEmail(input)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
  };

  const handleSignup = async () => {
    if (emailError) {
      return;
    }

    try {
      const response = await api.post('/user', {
        email,
        password,
        name,
        nickname
      });

      console.log('회원가입 성공:', response.data);

      setSuccessMessage('회원가입 성공! 로그인 해주세요.');
      setErrorMessage('');

      setTimeout(() => {
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrorMessage(error.response?.data?.error || '회원가입 실패');
      setSuccessMessage('');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form>
          <Form.Group controlId="signupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="이메일 입력" 
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!emailError}
            />
            {emailError && (
              <Form.Text className="text-danger">
                {emailError}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="signupPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="비밀번호 입력" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="signupName" className="mt-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="이름 입력" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="signupNickname" className="mt-3">
            <Form.Label>Nickname</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="닉네임 입력" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSignup}>
          Sign Up
        </Button>
        <Button variant="secondary" onClick={onSwitchToLogin}>
          Back to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignupModal;