import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventDetailModal from '../../components/modals/ExamDetailModal';
import LoginModal from '../../components/modals/LoginModal';
import api from '../../utils/api';
import "./Home.css"

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedEvent, setSavedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]); 
  const [examEvents, setExamEvents] = useState([]); 
  const [reminders, setReminders] = useState([]);
  const [visibleTypes, setVisibleTypes] = useState({
    application: true,
    exam: true,
    result: true
  });
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem("token");

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

  const filterEvents = (events, types, onlyBookmarked = false) => {
    return events.filter(event =>
      types[event.type] &&
      (!onlyBookmarked || reminders.some(r => r.certificateId._id === event.extendedProps.certificateId))
    );
  };

  const fetchCertificates = async (reminderList = []) => {
    try {
      const res = await api.get("/certificate");
      const certificates = res.data.certificates;

      const colorMap = reminderList.reduce((acc, r) => {
        acc[r.certificateId._id] = r.color;
        return acc;
      }, {});

      const events = certificates.flatMap(cert =>
        cert.schedule
          .filter(item => item.examStart || item.applicationStart || item.resultDate)
          .flatMap(item => {
            const baseProps = {
              certificateId: cert._id,
              round: item.round,
              type: item.type,
              officialSite: cert.officialSite,
              eligibility: cert.eligibility,
            };

            const events = [];

            if (item.applicationStart) {
              events.push({
                title: `${cert.name} (${item.round}) 접수 시작`,
                start: new Date(item.applicationStart).toISOString().split("T")[0],
                color: colorMap[cert._id],
                type: "application",
                extendedProps: baseProps,
              });
            }
            if (item.applicationEnd) {
              events.push({
                title: `${cert.name} (${item.round}) 접수 마감`,
                start: new Date(item.applicationEnd).toISOString().split("T")[0],
                color: colorMap[cert._id],
                type: "application",
                extendedProps: baseProps,
              });
            }
            if (item.examStart) {
              events.push({
                title: `${cert.name} (${item.round} ${item.type} 시험 시작)`,
                start: new Date(item.examStart).toISOString().split("T")[0],
                color: colorMap[cert._id],
                type: "exam",
                extendedProps: baseProps,
              });
            }
            if (item.examEnd) {
              events.push({
                title: `${cert.name} (${item.round} ${item.type} 시험 종료)`,
                start: new Date(item.examEnd).toISOString().split("T")[0],
                color: colorMap[cert._id],
                type: "exam",
                extendedProps: baseProps,
              });
            }
            if (item.resultDate) {
              events.push({
                title: `${cert.name} (${item.round}) 결과 발표`,
                start: new Date(item.resultDate).toISOString().split("T")[0],
                color: colorMap[cert._id],
                type: "result",
                extendedProps: baseProps,
              });
            }

            return events;
          })
      );

      setAllEvents(events);
      setExamEvents(filterEvents(events, visibleTypes, showOnlyBookmarked));
    } catch (err) {
      console.error("캘린더 로드 실패:", err?.error ?? err);
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

      await loadInitialData();
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
    loadInitialData();
  };

  const loadInitialData = async () => {
    let reminderList = [];
    if (isLoggedIn) {
      try {
        const res = await api.get("/reminder");
        reminderList = res.data.reminders;
        setReminders(reminderList);
      } catch (e) {
        console.error("reminder 불러오기 실패", e);
      }
    }
    await fetchCertificates(reminderList);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setExamEvents(filterEvents(allEvents, visibleTypes, showOnlyBookmarked));
  }, [visibleTypes, showOnlyBookmarked]);

  return (
    <div>
      <h1>🏠 자격증 달력 홈</h1>

      <div className="filter-buttons">
        <label>
          <input
            type="checkbox"
            checked={visibleTypes.application}
            onChange={() =>
              setVisibleTypes(prev => ({ ...prev, application: !prev.application }))
            }
          />
          접수 일정
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleTypes.exam}
            onChange={() =>
              setVisibleTypes(prev => ({ ...prev, exam: !prev.exam }))
            }
          />
          시험 일정
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleTypes.result}
            onChange={() =>
              setVisibleTypes(prev => ({ ...prev, result: !prev.result }))
            }
          />
          결과 발표
        </label>
        <label>
          <input
            type="checkbox"
            checked={showOnlyBookmarked}
            onChange={() => setShowOnlyBookmarked(prev => !prev)}
          />
          찜한 자격증만 보기
        </label>
      </div>

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
