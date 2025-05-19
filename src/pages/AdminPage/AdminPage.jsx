import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import CertificationFormModal from '../../components/modals/CertificationFormModal';

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">자격증 일정 관리</h2>

      <button
        onClick={() => {
          setSelected(null);
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        새 자격증 일정 등록
      </button>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">자격증명</th>
            <th className="p-2 border">수정</th>
            <th className="p-2 border">삭제</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((cert) => (
            <tr key={cert._id}>
              <td className="p-2 border">{cert.name}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => {
                    setSelected(cert);
                    setShowModal(true);
                  }}
                  className="text-blue-600"
                >
                  수정
                </button>
              </td>
              <td className="p-2 border text-center">
                <button onClick={() => handleDelete(cert._id)} className="text-red-600">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
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
  );
};

export default AdminPage;