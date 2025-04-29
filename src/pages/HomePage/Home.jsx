import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailModal from '../../components/modals/ExamDetailModal';
import LoginModal from '../../components/modals/LoginModal'; 
import api from '../../utils/api';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvent, setSavedEvent] = useState(null); 
  const [examEvents, setExamEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  const handleEventClick = (info) => {
    const event = {
      title: info.event.title,
      start: info.event.startStr,
      extendedProps: info.event.extendedProps,
    };
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const fetchReminders = async () => {
    try {
      const res = await api.get("/reminder");
      setReminders(res.data.reminders);
    } catch (err) {
      console.error("리마인더 불러오기 실패:", err?.error ?? err);
    }
  };

  const handleBookmark = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setSavedEvent(selectedEvent); 
      setModalOpen(false); 
      setLoginModalOpen(true);
      return;
    }

    try {
      const certificateId = selectedEvent.extendedProps.certificateId;
      const isBookmarked = reminders.some(r => r.certificateId._id === certificateId);

      if (isBookmarked) {
        await api.delete(`/reminder/${certificateId}`);
        alert("찜이 해제되었습니다.");
      } else {
        await api.post("/reminder", { certificateId });
        alert("찜 완료!");
      }

      fetchReminders();
      setModalOpen(false);
    } catch (error) {
      console.error("찜하기 실패:", error);
      alert(error.error || "찜 기능 실패");
    }
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    if (savedEvent) {
      setSelectedEvent(savedEvent); 
      setModalOpen(true); 
      setSavedEvent(null); 
    }
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get("/certificate");
        const certificates = res.data.certificates;
        const events = certificates.flatMap(cert => 
          cert.schedule
            .filter(item => item.examStart && item.examEnd && !isNaN(new Date(item.examEnd)))
            .map(item => ({
              title: `${cert.name} (${item.round} ${item.type})`,
              start: item.examStart,
              end: new Date(new Date(item.examEnd).getTime() + 86400000).toISOString().split("T")[0],
              extendedProps: {
                certificateId: cert._id,
                round: item.round,
                type: item.type,
                officialSite: cert.officialSite,
                eligibility: cert.eligibility,
              }
            }))
        );
        setExamEvents(events);
      } catch (err) {
        console.error("캘린더 로드 실패:", err?.error ?? err);
      }
    };

    fetchCertificates();
    fetchReminders();
  }, []);

  return (
    <div>
      <h1>🏠 자격증 달력 홈</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={examEvents}
        eventClick={handleEventClick}
        height="auto"
      />

      {modalOpen && selectedEvent && (
        <EventDetailModal
          selectedEvent={selectedEvent}
          onClose={handleClose}
          onBookmark={handleBookmark}
          isBookmarked={reminders.some(r => r.certificateId._id === selectedEvent.extendedProps.certificateId)}
        />
      )}

      {loginModalOpen && (
        <LoginModal
          show={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );
};

export default Home;