import React, { useState, useEffect } from 'react';

const EventDetailModal = ({ selectedEvent, onClose }) => {
  // 댓글 입력 상태
  const [commentInput, setCommentInput] = useState('');

  // 댓글 리스트 상태 (로컬)
  const [localComments, setLocalComments] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null); // 수정 중인 댓글의 인덱스
  const [editText, setEditText] = useState('');           // 현재 입력 중인 수정 텍스트

  // selectedEvent가 바뀔 때마다 댓글 초기화
  useEffect(() => {
    if (selectedEvent) {
      setLocalComments(selectedEvent.extendedProps?.comments || []);
    }
  }, [selectedEvent]);

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (commentInput.trim() === '') return;
    setLocalComments([...localComments, commentInput.trim()]);
    setCommentInput('');
  };

  // 댓글 수정 핸들러
  const handleStartEdit=(index)=>{
    setEditingIndex(index);
    setEditText(localComments[index]);
  }

  // 댓글 수정 저장 핸들러
  const handleSaveEdit = () => {
    const updated = [...localComments];
    updated[editingIndex] = editText;
    setLocalComments(updated);
    setEditingIndex(null);
    setEditText('');
  };  

  // 댓글 삭제 핸들러
  const handleDeleteComment = (indexToRemove) => {
    const updated = localComments.filter((_, idx) => idx !== indexToRemove);
    setLocalComments(updated);
  };

  if (!selectedEvent) return null;

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.modal}>
        {/* 사이트 바로가기 */}
        {selectedEvent.extendedProps?.url && (
          <a
            href={selectedEvent.extendedProps.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '10px', color: 'blue' }}
          >
            🔗 사이트 바로가기
          </a>
        )}

        {/* 기본 정보 */}
        <h2>{selectedEvent.title}</h2>
        <p><strong>날짜:</strong> {selectedEvent.start}</p>
        <p><strong>설명:</strong> {selectedEvent.extendedProps?.description || '없음'}</p>

        {/* 댓글 리스트 */}
        <div style={{ marginTop: '20px' }}>
          <h3>💬 시험 후기 & 팁</h3>
          {localComments.length > 0 ? (
            <ul>
              {localComments.map((comment, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                        {editingIndex === index ? (
                            <>
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            />
                            <button onClick={handleSaveEdit}>
                            저장
                            </button>
                            <button
                            onClick={() => {
                                setEditingIndex(null);
                                setEditText('');
                            }}
                            >
                            취소
                            </button>
                            </>
                             ) : (
                            <>  
                            {comment}
                            <button
                            onClick={() => handleStartEdit(index)}
                            >
                            수정
                            </button>
                            <button
                                onClick={() => handleDeleteComment(index)}
                            >
                            삭제
                            </button>
                            </>
                            )}
                            </li>

              ))}
            </ul>
          ) : (
            <p>아직 등록된 후기가 없어요.</p>
          )}
        </div>

        {/* 댓글 입력창 */}
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="후기나 팁을 입력하세요"
            style={{ width: '80%', padding: '6px' }}
          />
          <button onClick={handleAddComment} style={{ marginLeft: '10px' }}>추가</button>
        </div>

        {/* 닫기 버튼 */}
        <button onClick={onClose} style={{ marginTop: '20px' }}>닫기</button>
      </div>
    </div>
  );
};

// 모달 스타일 정의
const modalStyle = {
  overlay: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    minWidth: '300px',
  }
};

export default EventDetailModal;
