import React, { useRef } from 'react';
import { useSimpleInView } from './useSimpleInView';
import './CommunitySupport.css';

const CommunitySupport: React.FC = () => {
  const supportRef = useRef<HTMLElement>(null);
  const { inView } = useSimpleInView(supportRef, {
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={supportRef} className={`community-support-container ${inView ? 'is-visible' : ''}`}>
      <h2>Community Support</h2>
      <p>
        Welcome to the Community Support section! Here, artisans and customers can connect, share experiences, and seek assistance.
      </p>
      
      <div className="support-subsection">
        <h3>Forums</h3>
        <p>Join discussions about products, techniques, and more.</p>
      </div>
      
      <div className="support-subsection">
        <h3>Q&A Section</h3>
        <p>Have questions? Ask the community or provide answers to others.</p>
      </div>
    </section>
  );
};

export default CommunitySupport; 