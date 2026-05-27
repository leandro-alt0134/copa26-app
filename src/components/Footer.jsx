import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  const getSubtext = () => {
    switch (location.pathname) {
      case '/grupos':
        return <span>Atualize a tabela em <strong>data/grupos.json</strong></span>;
      case '/confrontos':
        return <span>Dados integrados do arquivo <strong>data/partidas.json</strong></span>;
      case '/palpites':
        return <span>Salvo localmente no navegador via <strong>localStorage</strong></span>;
      case '/':
      default:
        return <span>Escudos locais no padrão <strong>pais-escudo.svg</strong></span>;
    }
  };

  return (
    <footer className="py-4 mt-5">
      <div className="container small d-flex flex-column flex-md-row justify-content-between gap-2">
        <span>Projeto demonstrativo — Copa do Mundo 2026</span>
        {getSubtext()}
      </div>
    </footer>
  );
}
