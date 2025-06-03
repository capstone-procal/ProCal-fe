import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../utils/api'; 
import "./SearchBanner.css"

const SearchBanner = () => {
  const [query, setQuery] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const navigate = useNavigate();

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
    navigate(`/certificate/${certificateId}`); 
  };

  return ( 
    <div className="searchbanner-wrapper">
      <div className="searchbanner-box">
        <div className="searchbanner-container">
          <FaSearch className="searchbanner-icon" />
          <input
            type="text"
            placeholder="자격증 검색..."
            className="searchbanner-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {query && (
          <div className="searchbanner-dropdown">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map(cert => (
                <div
                  key={cert._id}
                  className="searchbanner-item"
                  onClick={() => handleCertificateClick(cert._id)}
                >
                  {cert.name}
                </div>
              ))
            ) : (
              <div className="searchbanner-item" style={{ color: '#888' }}>
                시험 관련 데이터가 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBanner;
