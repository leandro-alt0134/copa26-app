import React, { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alternarVisibilidade = () => {
      if (window.scrollY > 600) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', alternarVisibilidade, { passive: true });
    alternarVisibilidade();

    return () => window.removeEventListener('scroll', alternarVisibilidade);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar para o topo"
    >
      ↑
    </button>
  );
}
