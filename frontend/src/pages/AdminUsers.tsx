import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import { fetchAllUsers } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers()
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#fafbfc' }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: '36px 36px 0 36px' }}>
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>User Management</div>
            {loading ? (
              <div style={{ color: '#888' }}>Loading users...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: 8 }}>ID</th>
                    <th style={{ padding: 8 }}>Name</th>
                    <th style={{ padding: 8 }}>Email</th>
                    <th style={{ padding: 8 }}>Role</th>
                    <th style={{ padding: 8 }}>Status</th>
                    <th style={{ padding: 8 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #f3f3f3' }}>
                      <td style={{ padding: 8 }}>{user._id}</td>
                      <td style={{ padding: 8 }}>{user.name}</td>
                      <td style={{ padding: 8 }}>{user.email}</td>
                      <td style={{ padding: 8 }}>{user.role}</td>
                      <td style={{ padding: 8, color: user.status === 'Active' ? '#10b981' : '#fbbf24', fontWeight: 600 }}>{user.status || 'Active'}</td>
                      <td style={{ padding: 8 }}>
                        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                        <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminUsers; 