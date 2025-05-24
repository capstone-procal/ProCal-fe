import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import api from '../../utils/api';

const CertificationFormModal = ({ show, onClose, onSaved, initialData }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [passingCriteria, setPassingCriteria] = useState('');
  const [officialSite, setOfficialSite] = useState('');

  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory((initialData.category || []).join(', '));
      setEligibility(initialData.eligibility || '');
      setPassingCriteria(initialData.passingCriteria || '');
      setOfficialSite(initialData.officialSite || '');
      setScheduleList(initialData.schedule?.map(s => ({
        type: s.type || '',
        round: s.round || '',
        applicationStart: s.applicationStart?.slice(0, 10) || '',
        applicationEnd: s.applicationEnd?.slice(0, 10) || '',
        examStart: s.examStart?.slice(0, 10) || '',
        examEnd: s.examEnd?.slice(0, 10) || '',
        resultDate: s.resultDate?.slice(0, 10) || ''
      })) || []);
    } else {
      setName('');
      setCategory('');
      setEligibility('');
      setPassingCriteria('');
      setOfficialSite('');
      setScheduleList([]);
    }
  }, [initialData]);

  const handleScheduleChange = (index, field, value) => {
    const updated = [...scheduleList];
    updated[index][field] = value;
    setScheduleList(updated);
  };

  const addSchedule = () => {
    setScheduleList([...scheduleList, {
      type: '',
      round: '',
      applicationStart: '',
      applicationEnd: '',
      examStart: '',
      examEnd: '',
      resultDate: ''
    }]);
  };

  const removeSchedule = (index) => {
    const updated = scheduleList.filter((_, i) => i !== index);
    setScheduleList(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      category: category.split(',').map(c => c.trim()),
      eligibility,
      passingCriteria,
      officialSite,
      schedule: scheduleList
    };

    try {
      if (initialData) {
        await api.put(`/certificate/${initialData._id}`, payload);
      } else {
        await api.post('/certificate', payload);
      }
      onClose();
      onSaved();
    } catch (err) {
      console.error('저장 실패:', err.response?.data || err.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? '자격증 수정' : '자격증 등록'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>자격증명</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>카테고리 (쉼표로 구분)</Form.Label>
            <Form.Control value={category} onChange={(e) => setCategory(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>응시자격</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>합격기준</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={passingCriteria}
              onChange={(e) => setPassingCriteria(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>공식 사이트</Form.Label>
            <Form.Control value={officialSite} onChange={(e) => setOfficialSite(e.target.value)} />
          </Form.Group>

          <hr />
          <h5 className="mb-3">시험 일정</h5>
          {scheduleList.map((item, idx) => (
            <div key={idx} className="border p-3 mb-3 rounded bg-gray-50">
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>유형</Form.Label>
                    <Form.Control value={item.type} onChange={(e) => handleScheduleChange(idx, 'type', e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>회차</Form.Label>
                    <Form.Control value={item.round} onChange={(e) => handleScheduleChange(idx, 'round', e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>접수 시작일</Form.Label>
                    <Form.Control type="date" value={item.applicationStart} onChange={(e) => handleScheduleChange(idx, 'applicationStart', e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>접수 종료일</Form.Label>
                    <Form.Control type="date" value={item.applicationEnd} onChange={(e) => handleScheduleChange(idx, 'applicationEnd', e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>시험 시작일</Form.Label>
                    <Form.Control type="date" value={item.examStart} onChange={(e) => handleScheduleChange(idx, 'examStart', e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>시험 종료일</Form.Label>
                    <Form.Control type="date" value={item.examEnd} onChange={(e) => handleScheduleChange(idx, 'examEnd', e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2">
                <Form.Label>발표일</Form.Label>
                <Form.Control type="date" value={item.resultDate} onChange={(e) => handleScheduleChange(idx, 'resultDate', e.target.value)} />
              </Form.Group>

              <Button
                variant="danger"
                size="sm"
                onClick={() => removeSchedule(idx)}
                className="mt-2"
              >
                일정 삭제
              </Button>
            </div>
          ))}

          <Button variant="secondary" onClick={addSchedule}>+ 일정 추가</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>저장</Button>
        <Button variant="secondary" onClick={onClose}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CertificationFormModal;