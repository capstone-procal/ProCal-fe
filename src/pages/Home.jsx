import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailModal from '../components/modals/ExamDetailModal';
import api from '../utils/api';
//import { fetchExamEvents } from '../utils/openApi'; 

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [examEvents, setExamEvents] = useState([]);
  const [items, setItems] = useState([]);

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
//market
  useEffect(() => {
    const fetchMarketItems = async () => {
      try {
        const res = await api.get("/market");
        setItems(res.data.items);
        console.log("마켓 데이터:", res.data.items);
      } catch (err) {
        console.error("마켓 fail:", err);
      }
    };

    fetchMarketItems();
  }, []);
//cal
  useEffect(() => {
  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificate");
      const certificates = res.data.certificates;

      const events = certificates.flatMap((cert) =>
        cert.schedule
          .filter(item => item.examStart && item.examEnd && !isNaN(new Date(item.examEnd)))
          .map((item) => ({
          title: `${cert.name} (${item.round} ${item.type})`,
          start: item.examStart,
          end: new Date(new Date(item.examEnd).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 캘린더는 end 미포함이라 +1일 필요함
          extendedProps: {
            certificateId: cert._id,
            round: item.round,
            type: item.type,
            officialSite: cert.officialSite,
            eligibility: cert.eligibility
          }
        }))
      );

      setExamEvents(events);
      console.log("cal", events);
    } catch (err) {
      console.error("cla fail:", err);
    }
  };

  fetchCertificates();
}, []);

  // useEffect(() => {
  //   const loadExamEvents = async () => {
  //     const events = await fetchExamEvents(); 
  //     setExamEvents(events);
  //   };

  //   loadExamEvents();
  // }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏠 자격증 달력 홈</h1>
      <p>이곳에서 자격증 일정을 확인할 수 있습니다.</p>

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
        />
      )}
    </div>
  );
};

export default Home;