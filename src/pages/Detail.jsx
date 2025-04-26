import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api'; 

const Detail = () => {
  const { id } = useParams(); 
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get(`/certificate/${id}`);
        setCertificate(res.data.certificate);
      } catch (err) {
        console.error('상세 정보 가져오기 실패:', err);
        setError('자격증 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!certificate) return <div className="p-4">자격증 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{certificate.name}</h2>
      <p className="mb-2"><strong>분류:</strong> {certificate.category.join(', ')}</p>
      <p className="mb-2"><strong>응시 자격:</strong> {certificate.eligibility}</p>
      <p className="mb-2"><strong>합격 기준:</strong> {certificate.passingCriteria}</p>
      <p className="mb-2">
        <strong>공식 사이트:</strong> <a href={certificate.officialSite} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{certificate.officialSite}</a>
      </p>
    </div>
  );
};

export default Detail;
