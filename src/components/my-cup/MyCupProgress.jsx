import React, { useState, useEffect, useRef } from 'react';

const STEPS = [
  { id: 'groups', label: 'Grupos', emoji: '🏟️' },
  { id: 'qualified', label: 'Classificação', emoji: '🧮' },
  { id: 'knockout', label: 'Mata-mata', emoji: '⚔️' },
  { id: 'semifinals', label: 'Semifinal', emoji: '🌟' },
  { id: 'final', label: 'Final', emoji: '🏆' },
  { id: 'champion', label: 'Campeão', emoji: '🥇' }
];

export default function MyCupProgress({ currentStep }) {
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const prevStepRef = useRef(currentStep);

  // Transition interstitial trigger effect
  useEffect(() => {
    const prevStep = prevStepRef.current;
    prevStepRef.current = currentStep;

    // Detect forward transitions
    const majorTransitions = [
      { from: 'groups', to: 'qualified' },
      { from: 'qualified', to: 'knockout' },
      { from: 'knockout', to: 'semifinals' },
      { from: 'final', to: 'champion' }
    ];

    const shouldShow = majorTransitions.some(
      (t) => t.from === prevStep && t.to === currentStep
    );

    if (shouldShow && navigator.onLine) {
      setShowInterstitial(true);
      setCountdown(3);
    }
  }, [currentStep]);

  // Interstitial countdown timer
  useEffect(() => {
    if (!showInterstitial) return;
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showInterstitial, countdown]);

  const handleCloseAd = () => {
    setShowInterstitial(false);
  };

  // If we are in intro step, don't show progress
  if (currentStep === 'intro') return null;

  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;

  // Calculate percentage of progress line
  const progressPercent = (activeIdx / (STEPS.length - 1)) * 90; // Adjust spacing to align with bubbles

  return (
    <div className="steps-container bg-transparent p-0 mb-5 text-center animate-fade-in">
      <div className="position-relative mx-auto" style={{ maxWidth: '800px' }}>
        <ul className="steps-list">
          {/* Progress fill line */}
          <div 
            className="steps-list-progress-line" 
            style={{ 
              width: `${progressPercent}%`, 
              left: '5%',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          />
          
          {STEPS.map((step, idx) => {
            let statusClass = '';
            if (idx < activeIdx) statusClass = 'completed';
            else if (idx === activeIdx) statusClass = 'active';

            return (
              <li 
                key={step.id} 
                className={`step-item ${statusClass}`}
                style={{ flex: 1 }}
              >
                <div 
                  className="step-bubble"
                  title={step.label}
                  aria-current={idx === activeIdx ? 'step' : undefined}
                >
                  {idx < activeIdx ? '✓' : step.emoji}
                </div>
                <span className="step-label d-none d-md-block">{step.label}</span>
                <span className="step-label d-block d-md-none" style={{ fontSize: '0.62rem' }}>
                  {step.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Simulated Fullscreen Google AdSense Interstitial Overlay */}
      {showInterstitial && (
        <div 
          className="interstitial-overlay animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'radial-gradient(circle at center, #08291D 0%, #061A12 100%)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          {/* Subtle Reflector Stadium Lights (Background Visual Textures) */}
          <div 
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '40%',
              height: '40%',
              background: 'radial-gradient(circle, rgba(0, 200, 83, 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '40%',
              height: '40%',
              background: 'radial-gradient(circle, rgba(0, 200, 83, 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          {/* Premium Glassmorphism Card */}
          <div 
            className="interstitial-card"
            style={{
              width: '100%',
              maxWidth: '540px',
              background: 'rgba(4, 62, 39, 0.86)',
              border: '2px solid rgba(0, 200, 83, 0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(0, 200, 83, 0.15)',
              borderRadius: '24px',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              padding: '2.5rem 2rem',
              position: 'relative',
              textAlign: 'center',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#F8FAFC'
            }}
          >
            {/* Top Close Button (Simulated Google AdSense style) */}
            <button
              onClick={countdown === 0 ? handleCloseAd : undefined}
              disabled={countdown > 0}
              aria-label="Fechar Anúncio"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: countdown > 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                border: countdown > 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
                color: countdown > 0 ? 'rgba(255,255,255,0.3)' : '#fff',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {countdown > 0 ? countdown : '✕'}
            </button>

            {/* Publicidade Header Label */}
            <span 
              style={{
                fontSize: '0.65rem',
                fontWeight: '900',
                letterSpacing: '3px',
                color: 'rgba(183, 201, 192, 0.5)',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                display: 'block'
              }}
            >
              Publicidade Intersticial
            </span>

            {/* Main Product/Feature Showcase */}
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
            <h2 
              style={{ 
                fontSize: '1.75rem', 
                fontWeight: '900', 
                color: '#fff', 
                marginBottom: '0.5rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Copa dos Palpites <span style={{ color: 'var(--primary)' }}>PRO</span>
            </h2>
            <p 
              style={{ 
                fontSize: '0.9rem', 
                color: '#B7C9C0', 
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}
            >
              Leve sua simulação ao próximo nível com a versão premium independente do aplicativo.
            </p>

            {/* Benefit Checkmarks */}
            <div 
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '2rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Simulação inteligente e chaveamento instantâneo.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Notificações push em tempo real de gols e estatísticas.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Histórico completo de todas as edições anteriores.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Totalmente otimizado para PWA offline sem interrupções.</span>
              </div>
            </div>

            {/* Action Button */}
            {countdown > 0 ? (
              <button
                disabled
                className="btn py-3 w-100"
                style={{
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(183, 201, 192, 0.4)',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  cursor: 'not-allowed',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Aguarde {countdown}s...</span>
              </button>
            ) : (
              <button
                onClick={handleCloseAd}
                className="btn py-3 w-100 animate-pulse"
                style={{
                  borderRadius: '14px',
                  background: 'var(--primary)',
                  border: 'none',
                  color: '#03140E',
                  fontSize: '0.9rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  minHeight: '48px',
                  boxShadow: '0 0 15px rgba(0, 200, 83, 0.4)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 200, 83, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 200, 83, 0.4)';
                }}
              >
                <span>Fechar e Continuar ➔</span>
              </button>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>
              Identificador do anúncio: interstitial-sim-cup-v1
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
