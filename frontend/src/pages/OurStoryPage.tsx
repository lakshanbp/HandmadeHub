import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OurStoryPage.css';

// Using an existing image from the public folder
import storyImage from '../../public/images/image_5.jpg'; 

const OurStoryPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="our-story-container">
        <div className="story-image-column">
          <img src="/images/image_5.jpg" alt="Artisan working on a craft" />
        </div>
        <div className="story-text-column">
          <h2>THIS IS US</h2>
          <p>
            This is a space to share more about the business. Take advantage of this long text to tell people who's behind it, what it does, how it began, and other details. It's an excellent place to share the story behind the business and describe what this site has to offer its visitors.
          </p>
          <p>
            You can write about the business's history here, from its founding until now. Draw readers in with an engaging narrative. By telling its story, you can help people connect to the business. Share what inspired its creation and what need it was meant to fill. You can include details of the obstacles it overcame to get where it is today.
          </p>
          <p>
            This space is also a good spot to talk about a particular feature of the business that sets it apart from its competitors. Explain to readers what makes this business unique and why they should choose it over other options. Focus on the value this business can offer its users.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurStoryPage; 