import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBox, FaClipboardList, FaUserTie, FaSignOutAlt, FaBoxOpen } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  role: string;
  name: string;
  exp: number;
  artisanStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

const AdminSidebar: React.FC<{ onHideSidebar?: () => void }> = ({ onHideSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  let isArtisan = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      isArtisan = decoded.role === 'artisan' && decoded.artisanStatus === 'approved';
    }
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-title">Admin Panel</div>
        <div className="admin-sidebar-user">Admin User</div>
      </div>
      <nav className="admin-sidebar-nav">
        <a href="/admin" className={`admin-sidebar-link${location.pathname === '/admin' ? ' active' : ''}`}>
          {FaTachometerAlt({})}
          <span>Dashboard</span>
        </a>
        <a href="/admin/users" className={`admin-sidebar-link${location.pathname === '/admin/users' ? ' active' : ''}`}>
          {FaUsers({})}
          <span>User Management</span>
        </a>
        <a href="/admin/products" className={`admin-sidebar-link${location.pathname === '/admin/products' ? ' active' : ''}`}>
          {FaBox({})}
          <span>Product Management</span>
        </a>
        <a href="/admin/orders" className={`admin-sidebar-link${location.pathname === '/admin/orders' ? ' active' : ''}`}>
          {FaClipboardList({})}
          <span>Orders</span>
        </a>
        <a href="/admin/artisan-requests" className={`admin-sidebar-link${location.pathname === '/admin/artisan-requests' ? ' active' : ''}`}>
          {FaUserTie({})}
          <span>Artisan Requests</span>
        </a>
        {isArtisan && (
          <li>
            <NavLink to="/artisan-orders" className={({ isActive }) => isActive ? 'active' : ''}>
              {FaBoxOpen({ style: { marginRight: 8 } })} Artisan Orders
            </NavLink>
          </li>
        )}
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="admin-sidebar-link admin-sidebar-logout">
            {FaSignOutAlt({})}
            <span>Log Out</span>
          </button>
        </div>
        {onHideSidebar && (
          <button
            onClick={onHideSidebar}
            className="admin-sidebar-link admin-sidebar-hide"
            style={{ marginTop: 16 }}
          >
            Hide Sidebar
          </button>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar; 