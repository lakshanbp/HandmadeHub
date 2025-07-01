import React from 'react';
import './SaleBanner.css';

const bgImage = process.env.PUBLIC_URL + '/images/image_9.jpg';

const SaleBanner: React.FC = () => {
  return (
    <div
      className="sale-banner-bg"
      style={{
        background: `linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), url(${bgImage}) center center/cover no-repeat`
      }}
    >
      <div className="sale-banner-overlay">
        <div className="sale-banner-content">
          <div className="sale-banner-offer">UP TO 50% OFF</div>
          <div className="sale-banner-sale-row">
            <div className="sale-banner-sale-animate">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i}>SALE&nbsp;&nbsp;</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleBanner; 