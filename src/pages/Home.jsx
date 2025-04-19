import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailModal from '../components/modals/ExamDetailModal';
import api from '../utils/api';

import {
  fetchQualificationList,
  fetchQualificationDetail,
} from '../utils/open.api';


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

  useEffect(() => {
    const loadQualificationData = async () => {
      try {
        const list = await fetchQualificationList();
        console.log("📚 자격 목록:", list);

        if (list.length > 0) {
          const jmCd = list[0].jmCd;
          const detail = await fetchQualificationDetail(jmCd);
          console.log(`📘 '${jmCd}' 상세정보:`, detail);
        }
      } catch (err) {
        console.error("❌ 자격 정보 불러오기 실패:", err);
      }
    };

    loadQualificationData();
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