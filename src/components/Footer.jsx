import React from 'react';
import { Link } from 'react-router-dom';
import mascote from '../assets/mascote_54X54.png';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer-palpitaria mt-auto py-4 py-md-5">
      <div className="container">
        <div className="row align-items-center gy-4 text-center text-md-start">
          
          {/* Lado Esquerdo: Branding e Mascote */}
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center gap-3">
            <div className="mascote-wrapper">
              <img 
                src={mascote} 
                alt="Mascote Mongrel Tech" 
                className="mascote-footerimg"
                width="54"
                height="54"
              />
            </div>
            <div>
              <h5 className="app-title-footer mb-1">Palpitaria da Copa</h5>
              <p className="text-muted small mb-0">
                Desenvolvido com ❤️ por <strong className="developer-brand">Mongrel Tech Solutions</strong>.
              </p>
            </div>
          </div>

          {/* Lado Direito: Links Institucionais e Legais */}
          <div className="col-12 col-md-6 text-md-end">
            <div className="footer-links mb-2 d-flex justify-content-center justify-content-md-end gap-3 flex-wrap">
              <Link to="/matches" className="footer-link-item">Tabela</Link>
              <Link to="/teams" className="footer-link-item">Seleções</Link>
              <Link to="/predictions" className="footer-link-item">Meus Palpites</Link>
            </div>
            
            {/* Termos Legais de Isenção (Crucial para Apps de Palpites/Futebol) */}
            <div className="legal-disclaimer small text-muted">
              <p className="mb-1">
                &copy; {anoAtual} Palpitaria da Copa. Todos os direitos reservados.
              </p>
              <p className="legal-text-tiny mb-0">
                Este é um simulador recreativo e gamificado. Não possui filiação, patrocínio ou vínculo comercial com a FIFA ou o comitê organizador oficial da Copa do Mundo de 2026.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}