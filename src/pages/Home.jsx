import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailModal from '../components/modals/ExamDetailModal';
import api from '../utils/api';

// open api
import {
  fetchExamSchedules,
  fetchQualificationDetail
} from "../utils/open.api";

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

  // 마켓 아이템 불러오기
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

  // 시험 일정 및 자격정보 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const examList = await fetchExamSchedules();
        const qualDetail = await fetchQualificationDetail("1320");

        console.log("시험 일정:", examList);
        console.log("자격 상세:", qualDetail); 

        const mappedEvents = examList.map((exam) => ({
          title: exam.description || "시험 일정",
          date: exam.docRegStartDt,
          extendedProps: { ...exam }
        }));

        setExamEvents(mappedEvents);
      } catch (err) {
        console.error("시험 일정 불러오기 실패:", err);
      }
    };

    load();
  }, []);

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