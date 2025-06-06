import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import CertificationFormModal from '../../components/modals/CertificationFormModal';
import './AdminPage.css';

const ITEMS_PER_PAGE = 4;

const AdminPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCertifications = async () => {
    try {
      const res = await api.get('/certificate/all');
      setCertifications(res.data.certificates);
    } catch (error) {
      console.error('자격증 불러오기 실패:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await api.delete(`/certificate/${id}`);
        fetchCertifications();
      } catch (error) {
        console.error('삭제 실패:', error.response?.data || error.message);
      }
    }
  };

  const totalPages = Math.ceil(certifications.length / ITEMS_PER_PAGE);
  const currentItems = certifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
   <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">자격증 일정 관리</h2>

        <button
          className="admin-register-btn"
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
        >
          새 자격증 일정 등록
        </button>

        <table className="admin-table">
          <thead>
            <tr>
              <th>자격증명</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((cert) => (
              <tr key={cert._id}>
                <td>{cert.name}</td>
                <td>
                  <button
                    className="admin-action-btn"
                    onClick={() => {
                      setSelected(cert);
                      setShowModal(true);
                    }}
                  >
                    수정
                  </button>
                </td>
                <td>
                  <button
                    className="admin-action-btn"
                    onClick={() => handleDelete(cert._id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <CertificationFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSaved={fetchCertifications}
          initialData={selected}
        />
      </div>
   </div>
  );
};

export default AdminPage;