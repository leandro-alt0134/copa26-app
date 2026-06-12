import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registrado com sucesso:', r);
    },
    onRegisterError(error) {
      console.error('Erro ao registrar Service Worker:', error);
    },
  });

  const fecharPrompt = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div 
      className="pwa-update-toast" 
      role="alert"
      style={{
        position: 'fixed',
        bottom: '85px', // Acima da barra de navegação inferior mobile (70px + safe area)
        left: '20px',
        right: '20px',
        maxWidth: '480px',
        margin: '0 auto',
        background: 'rgba(4, 62, 39, 0.95)',
        border: '2.5px solid #FFD166',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 209, 102, 0.15)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        padding: '1.25rem',
        zIndex: 9999, // Acima de quase tudo
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#F8FAFC',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: '1.5rem' }}>✨</span>
        <div className="text-start">
          <h4 className="h6 font-weight-bold mb-1" style={{ color: '#FFD166' }}>
            Nova Versão Disponível
          </h4>
          <p className="small mb-0 text-white-50" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
            Atualize o aplicativo para receber as últimas seleções, placares de jogos e recursos de simulação.
          </p>
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-end mt-1">
        <button 
          type="button" 
          className="btn btn-outline-light btn-sm px-3" 
          onClick={fecharPrompt}
          style={{ borderRadius: '8px', fontSize: '0.78rem', minHeight: '34px', border: '1px solid rgba(255, 255, 255, 0.25)' }}
        >
          Depois
        </button>
        <button 
          type="button" 
          className="btn btn-warning btn-sm px-3 font-weight-bold" 
          onClick={() => updateServiceWorker(true)}
          style={{ borderRadius: '8px', fontSize: '0.78rem', minHeight: '34px', background: '#FFD166', color: '#03140E', border: 'none' }}
        >
          Atualizar agora
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
