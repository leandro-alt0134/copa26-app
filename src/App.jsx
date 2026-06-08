import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Teams from './pages/Teams';
import Groups from './pages/Groups';
import Matches from './pages/Matches';
import Predictions from './pages/Predictions';
import MyPredictionCup from './pages/MyPredictionCup';
import OfflineBanner from './components/OfflineBanner';
import MobileBottomNav from './components/MobileBottomNav';

export default function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Teams />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/confrontos" element={<Matches />} />
        <Route path="/palpites" element={<Predictions />} />
        <Route path="/minha-copa" element={<MyPredictionCup />} />
      </Routes>
      <Footer />
      <MobileBottomNav />
      <BackToTop />
    </BrowserRouter>
  );
}
