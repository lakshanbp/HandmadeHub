import React from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import ProductListSection from '../components/ProductListSection';
import Footer from '../components/Footer';
import SaleBanner from '../components/SaleBanner';

const HomePage: React.FC = () => (
  <>
    <TopBar />
    <Navbar />
    <SaleBanner />
    <HeroSection />
    <CategoryList />
    <ProductListSection />
    <Footer />
  </>
);

export default HomePage; 