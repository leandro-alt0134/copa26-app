import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Teams from './pages/Teams';
import Groups from './pages/Groups';
import Matches from './pages/Matches';
import Predictions from './pages/Predictions';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Teams />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/confrontos" element={<Matches />} />
        <Route path="/palpites" element={<Predictions />} />
      </Routes>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  );
}
