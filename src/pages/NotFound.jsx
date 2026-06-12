import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container pb-5 text-white animate-fade-in text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🏟️⚠️</div>
      <h1 className="display-4 font-weight-bold text-warning mb-3">404 - Impedimento!</h1>
      <p className="text-white-50 mb-4" style={{ maxWidth: '540px', fontSize: '1.05rem', lineHeight: '1.6' }}>
        A página que você está tentando acessar parece não existir ou foi movida de lugar. Verifique o endereço digitado.
      </p>
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <Link to="/" className="btn btn-warning px-4 py-2 font-weight-bold" style={{ borderRadius: '12px' }}>
          🏠 Ir para Início
        </Link>
        <Link to="/suporte" className="btn btn-outline-light px-4 py-2 font-weight-bold" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)' }}>
          💬 Central de Suporte
        </Link>
      </div>
    </main>
  );
}
