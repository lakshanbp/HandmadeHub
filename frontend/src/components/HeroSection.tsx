import React, { useRef } from 'react';
import { useSimpleInView } from './useSimpleInView';
import './HeroSection.css';

interface HeroSectionProps {
  showContent?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ showContent = true }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { inView } = useSimpleInView(heroRef, {
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={heroRef} className={`hero-section-container ${inView ? 'is-visible' : ''}`}>
      {showContent && (
        <div className="hero-content">
          <h1 style={{ transitionDelay: '100ms' }}>Discover Unique Handmade Goods</h1>
          <p style={{ transitionDelay: '200ms' }}>
            Shop artisan-crafted homeware, accessories, gifts, and more. Support local makers and find something truly special.
          </p>
          <a href="/shop">
            <button className="hero-cta-button" style={{ transitionDelay: '300ms' }}>Shop All Products</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default HeroSection; 