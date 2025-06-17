import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';

function LoginModal({ show, onClose, onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (show) {
      setEmail('');
      setPassword('');
      setErrorMessage('');
      setEmailError('');
    }
  }, [show]);

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

  const handleLogin = async () => {
    if (emailError || !email || !password) return;

    try {
      const response = await api.post('/auth/login', { email, password });

      const { token, userId, userEmail, role } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('userEmail', userEmail);
      sessionStorage.setItem('userRole', role);

      console.log('로그인 성공:', { token, userId, role });

      setErrorMessage('');
      onClose();
      onLoginSuccess(role);
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage(
        error.response?.data?.error ||
        error.message ||
        '로그인 실패'
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!emailError}
              onKeyDown={handleKeyDown}
            />
            {emailError && (
              <Form.Text className="text-danger">
                {emailError}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleLogin}
          disabled={!email || !password || !!emailError}
        >
          Login
        </Button>
        <Button variant="secondary" onClick={onSwitchToSignup}>
          Sign Up
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;