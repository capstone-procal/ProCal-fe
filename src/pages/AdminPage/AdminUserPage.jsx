import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './AdminPage.css';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all');
      setUsers(res.data.users);
    } catch (err) {
      console.error('유저 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">유저 관리</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserPage;
