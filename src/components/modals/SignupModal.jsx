import React, { useState, useEffect } from 'react';
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
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
  if (show) {
    resetForm();
  }
}, [show]);

  const resetForm = () => {
  setEmail('');
  setPassword('');
  setName('');
  setNickname('');
  setEmailError('');
  setNicknameError('');
  setErrorMessage('');
  setSuccessMessage('');
  };

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

    if (!email || !password || !name || !nickname) {
    setErrorMessage("모든 항목을 입력해주세요.");
    return;
    }

    setEmailError('');
    setNicknameError('');
    setErrorMessage('');

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
      console.log("전체 에러 객체:", error);

      let errorMsg = '';

      if (typeof error?.error === 'string') {
        errorMsg = error.error.trim();
      } else if (typeof error?.message === 'string') {
        errorMsg = error.message.trim();
      }

      if (errorMsg === "이미 사용 중인 이메일입니다.") {
      setEmailError("이미 사용 중인 이메일입니다.");
    } else if (errorMsg === "이미 사용 중인 닉네임입니다.") {
      setNicknameError("이미 사용 중인 닉네임입니다.");
    } else {
      setErrorMessage(errorMsg || '회원가입 실패');
    }

      setSuccessMessage('');
    }
  };

  return (
    <Modal show={show} onHide={() => {
      resetForm(); 
      onClose();   
    }} centered>
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
              isInvalid={emailError !== ''}
            />
           {emailError && (
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
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
              isInvalid={!!nicknameError}
            />
            {nicknameError && (
        <Form.Control.Feedback type="invalid">
          {nicknameError}
        </Form.Control.Feedback>
      )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleSignup}>
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