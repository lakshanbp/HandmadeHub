import React from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';

const dashboardCards = [
  { title: 'Total Users', value: '1,200', sub: '+5%', color: '#3b82f6', icon: '👤' },
  { title: 'Total Orders', value: '3,200', sub: '+8%', color: '#10b981', icon: '🛍️' },
  { title: 'Total Sales', value: '159,000', sub: '+12%', color: '#fbbf24', icon: '💲' },
  { title: 'Total Products', value: '540', sub: '+3%', color: '#ef4444', icon: '📦' },
];

const recentUsers = [
  { id: 'U001', name: 'Alice Smith', email: 'alice@email.com', role: 'customer', status: 'Active' },
  { id: 'U002', name: 'Bob Lee', email: 'bob@email.com', role: 'artisan', status: 'Active' },
  { id: 'U003', name: 'Carol King', email: 'carol@email.com', role: 'customer', status: 'Pending' },
];

const AdminDashboard: React.FC = () => (
  <>
    <Navbar />
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafbfc' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '36px 36px 0 36px' }}>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          {dashboardCards.map(card => (
            <div key={card.title} style={{ background: card.color, color: '#fff', borderRadius: 16, flex: 1, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
              <div style={{ fontSize: 15, opacity: 0.9 }}>{card.sub}</div>
            </div>
          ))}
          <div style={{ background: '#2563eb', color: '#fff', borderRadius: 16, flex: 1, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Admin Quick Actions</div>
            <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, marginBottom: 8, cursor: 'pointer' }}>Download Reports</button>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Export analytics and data</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 2, background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Recent Users</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: 8 }}>ID</th>
                  <th style={{ padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Email</th>
                  <th style={{ padding: 8 }}>Role</th>
                  <th style={{ padding: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f3f3f3' }}>
                    <td style={{ padding: 8 }}>{user.id}</td>
                    <td style={{ padding: 8 }}>{user.name}</td>
                    <td style={{ padding: 8 }}>{user.email}</td>
                    <td style={{ padding: 8 }}>{user.role}</td>
                    <td style={{ padding: 8, color: user.status === 'Active' ? '#10b981' : '#fbbf24', fontWeight: 600 }}>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>System Status</div>
            <div style={{ color: '#10b981', fontWeight: 600, fontSize: 16 }}>All systems operational</div>
          </div>
        </div>
      </main>
    </div>
  </>
);

export default AdminDashboard; 