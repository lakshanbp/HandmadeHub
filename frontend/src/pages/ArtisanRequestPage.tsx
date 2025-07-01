import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMyArtisanRequest, submitArtisanRequest } from '../services/api';
import './ArtisanRequestPage.css';

interface RequestStatus {
  status: 'none' | 'pending' | 'approved' | 'rejected';
  brandName?: string;
  bio?: string;
  portfolioLink?: string;
}

const ArtisanRequestPage: React.FC = () => {
  const [status, setStatus] = useState<RequestStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    bio: '',
    portfolioLink: '',
  });

  useEffect(() => {
    getMyArtisanRequest()
      .then(res => {
        setStatus(res.data);
        if (res.data) {
          setFormData({
            brandName: res.data.brandName || '',
            bio: res.data.bio || '',
            portfolioLink: res.data.portfolioLink || '',
          });
        }
      })
      .catch(() => {
        setStatus({ status: 'none' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    submitArtisanRequest(formData)
      .then(res => {
        setStatus(res.data);
        setShowSuccessMessage(true);
      })
      .catch(err => console.error("Submission failed", err))
      .finally(() => setLoading(false));
  };

  const renderStatusCard = () => {
    if (!status) return null;

    const statusInfo = {
      pending: {
        title: "Request Pending",
        message: "Your application is under review. We'll notify you once a decision has been made.",
        className: "status-pending"
      },
      approved: {
        title: "Request Approved!",
        message: "Congratulations! You can now start selling your products on Handmade Hub.",
        className: "status-approved"
      },
      rejected: {
        title: "Request Rejected",
        message: "Unfortunately, your application was not approved at this time. You can update and resubmit your application below.",
        className: "status-rejected"
      },
      none: {
        title: "",
        message: "",
        className: ""
      }
    };
    
    const currentStatus = statusInfo[status.status];
    if (status.status === 'none') return null;

    return (
      <div className={`status-card ${currentStatus.className}`}>
        <h3>{currentStatus.title}</h3>
        <p>{currentStatus.message}</p>
      </div>
    );
  };

  if (loading && !status) return <div className="arp-loading">Loading your request status...</div>;
  
  const showForm = !status || status.status === 'none' || status.status === 'rejected';

  return (
    <>
      <Navbar />
      <div className="artisan-request-page">
        <div className="arp-container">
          <div className="arp-header">
            <h1>Become a Handmade Hub Artisan</h1>
            <p>Share your craft with the world. Apply to become a seller on our platform.</p>
          </div>
          
          {showSuccessMessage ? (
            <div className="request-submitted-card">
              <h2>Request Submitted!</h2>
              <p>Thank you for your interest in joining Handmade Hub as an artisan seller. Our team will review your request and get in touch soon.</p>
            </div>
          ) : (
            <>
              {renderStatusCard()}
              {showForm && (
                <form onSubmit={handleSubmit} className="artisan-request-form">
                  <h3>{status?.status === 'rejected' ? 'Update Your Application' : 'Your Application'}</h3>
                  <div className="form-group">
                    <label htmlFor="brandName">Brand Name</label>
                    <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Short Bio / Brand Story</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="portfolioLink">Portfolio or Social Media Link (Optional)</label>
                    <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} />
                  </div>
                  <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtisanRequestPage; 