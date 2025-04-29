import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; 

const SearchBanner = () => {
  const [query, setQuery] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const navigate = useNavigate();

  // 처음에 모든 자격증 데이터 불러오기
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificate');
        setCertificates(res.data.certificates);
      } catch (error) {
        console.error('자격증 데이터 가져오기 실패:', error);
      }
    };
    fetchCertificates();
  }, []);

  // 입력값이 변할 때마다 필터링
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredCertificates([]);
      return;
    }
    const filtered = certificates.filter(cert =>
      cert.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCertificates(filtered);
  }, [query, certificates]);

  const handleCertificateClick = (certificateId) => {
    navigate(`/certificate/${certificateId}`); // 상세페이지로 이동
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.3rem',
        marginLeft: '200px', 
        boxSizing: 'border-box',
      }}
    >

      <input
        type="text"
        placeholder="자격증 검색..."
        className="w-full p-2 border rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* 검색 결과 표시 */}
      {query && (
        <div className="mt-2 bg-gray-100 p-2 rounded">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map(cert => (
              <div
                key={cert._id}
                className="p-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleCertificateClick(cert._id)}
              >
                {cert.name}
              </div>
            ))
          ) : (
            <div className="p-1 text-gray-500">
              시험 관련 데이터가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBanner;
