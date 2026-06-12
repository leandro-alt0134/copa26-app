import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Teams from './pages/Teams';
import Groups from './pages/Groups';
import Matches from './pages/Matches';
import Predictions from './pages/Predictions';
import MyPredictionCup from './pages/MyPredictionCup';
import TvSchedule from './pages/TvSchedule';
import Privacy from './pages/Privacy';
import PrivacySettings from './pages/PrivacySettings';
import Terms from './pages/Terms';
import Support from './pages/Support';
import About from './pages/About';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import OfflineBanner from './components/OfflineBanner';
import MobileBottomNav from './components/MobileBottomNav';
import PwaUpdatePrompt from './components/PwaUpdatePrompt';
import ErrorBoundary from './components/ErrorBoundary';
import ConsentBanner from './components/privacy/ConsentBanner';

import { isNativePlatform } from './services/platformService';
import { inicializarAppNativo } from './services/nativeAppService';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNativePlatform()) return;

    // Inicializa StatusBar e SplashScreen
    inicializarAppNativo();

    // Tratamento do botão voltar do Android (Capacitor App plugin)
    const backButtonPromise = CapApp.addListener('backButton', () => {
      if (location.pathname === '/') {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      backButtonPromise.then(handle => handle.remove());
    };
  }, [location, navigate]);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Teams />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/confrontos" element={<Matches />} />
        <Route path="/palpites" element={<Predictions />} />
        <Route path="/minha-copa" element={<MyPredictionCup />} />
        <Route path="/agenda" element={<TvSchedule />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/privacidade-config" element={<PrivacySettings />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/suporte" element={<Support />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <MobileBottomNav />
      {!isNativePlatform() && <PwaUpdatePrompt />}
      <BackToTop />
      <ConsentBanner />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

