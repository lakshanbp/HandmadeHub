import React, { useEffect, useState } from 'react';
import { fetchArtisanRequests, updateArtisanRequest } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';

interface ArtisanRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  brandName: string;
  bio: string;
  portfolioLink?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const ArtisanRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ArtisanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ArtisanRequest | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetchArtisanRequests();
      setRequests(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await updateArtisanRequest(requestId, status);
      fetchRequests();
    } catch (err: any) {
      alert(`Failed to ${status} request`);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flexGrow: 1, padding: '32px 48px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Artisan Requests</h1>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={tableHeaderStyle}>User Name</th>
                <th style={tableHeaderStyle}>Brand Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={{ ...tableHeaderStyle, width: 120 }}>Status</th>
                <th style={{ ...tableHeaderStyle, width: 200 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={tableCellStyle}>{req.user.name}</td>
                  <td style={tableCellStyle}>{req.brandName}</td>
                  <td style={tableCellStyle}>{req.user.email}</td>
                  <td style={tableCellStyle}>
                    <span style={statusBadgeStyle(req.status)}>{req.status}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <button onClick={() => setSelectedRequest(req)} style={actionButtonStyle('details')}>Details</button>
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateRequest(req._id, 'approved')} style={actionButtonStyle('approve')}>Approve</button>
                        <button onClick={() => handleUpdateRequest(req._id, 'rejected')} style={actionButtonStyle('reject')}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedRequest && (
          <div style={modalOverlayStyle} onClick={() => setSelectedRequest(null)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: 12, marginBottom: 16 }}>Request Details</h2>
              <strong>User:</strong> {selectedRequest.user.name} <br/>
              <strong>Brand:</strong> {selectedRequest.brandName} <br/>
              <p><strong>Bio:</strong> {selectedRequest.bio}</p>
              {selectedRequest.portfolioLink && (
                <p><strong>Portfolio:</strong> <a href={selectedRequest.portfolioLink} target="_blank" rel="noopener noreferrer">{selectedRequest.portfolioLink}</a></p>
              )}
              <button onClick={() => setSelectedRequest(null)} style={{ marginTop: 24, padding: '8px 16px' }}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Inline styles for the table
const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 15,
  color: '#444',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 15,
};

const statusBadgeStyle = (status: string): React.CSSProperties => ({
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 500,
  textTransform: 'capitalize',
  background: status === 'approved' ? '#e8f5e9' : status === 'rejected' ? '#ffebee' : '#fffde7',
  color: status === 'approved' ? '#2e7d32' : status === 'rejected' ? '#c62828' : '#f57f17',
});

const actionButtonStyle = (type: 'approve' | 'reject' | 'details'): React.CSSProperties => ({
  border: 'none',
  borderRadius: 6,
  padding: '6px 12px',
  marginRight: 8,
  cursor: 'pointer',
  fontWeight: 500,
  background: type === 'approve' ? '#4caf50' : type === 'reject' ? '#f44336' : '#2196f3',
  color: '#fff',
});

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalContentStyle: React.CSSProperties = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  width: '100%',
  maxWidth: 500
};

export default ArtisanRequestsPage; 