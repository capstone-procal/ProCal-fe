import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailModal from '../components/modals/ExamDetailModal';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      start: info.event.startStr,
      extendedProps: info.event.extendedProps,
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏠 자격증 달력 홈</h1>
      <p>이곳에서 자격증 일정을 확인할 수 있습니다.</p>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={[
          {
            title: '접수 시작',
            date: '2025-02-15',
            description: '접수 시작일',
            extendedProps: {
              url: 'https://www.q-net.or.kr', // 👉 사이트 주소
            }
          },
        ]}
        eventClick={handleEventClick}
        height="auto"
      />

      {modalOpen && selectedEvent && (
        <EventDetailModal selectedEvent={selectedEvent} onClose={handleClose}/>
      )}
    </div>
  );
};

export default Home;
