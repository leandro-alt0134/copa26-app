import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const versaoApp = '1.0.0';

  return (
    <main className="container pb-5 text-white animate-fade-in">
      <section className="hero mb-4">
        <div className="hero-content p-4 p-md-5 position-relative">
          <span className="hero-badge mb-2 d-inline-block">🌎 Sobre o Aplicativo</span>
          <h1>Palpitaria da Copa 2026</h1>
          <p className="text-muted-old mb-0">Um simulador independente de futebol, palpites e estatísticas de bolso.</p>
        </div>
      </section>

      <section className="toolbar p-4 rounded-3 text-white-50" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
        <h2 className="h4 text-white font-weight-bold mb-3">O que é a Palpitaria?</h2>
        <p className="small mb-4" style={{ lineHeight: '1.6' }}>
          O <strong>Palpitaria da Copa 2026</strong> é um projeto gamificado interativo e independente construído para reunir torcedores, palpiteiros e entusiastas de futebol. Ele oferece uma forma divertida e gratuita de prever os resultados dos jogos da fase de grupos, simular os cruzamentos automáticos de chaves a partir das oitavas de final (com o regulamento de melhores terceiros colocados) e definir seu campeão do torneio de futebol mais aguardado de 2026.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">Especificações de Engenharia</h2>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-dark bg-opacity-25 rounded-3 text-center">
              <div className="small text-muted-old">Versão do App</div>
              <div className="h5 text-warning font-weight-bold mb-0">{versaoApp}</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-dark bg-opacity-25 rounded-3 text-center">
              <div className="small text-muted-old">Tecnologia PWA</div>
              <div className="h5 text-success font-weight-bold mb-0">Ativo / Instalável</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-dark bg-opacity-25 rounded-3 text-center">
              <div className="small text-muted-old">Armazenamento</div>
              <div className="h5 text-info font-weight-bold mb-0">Local e Seguro</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-dark bg-opacity-25 rounded-3 text-center">
              <div className="small text-muted-old">Integração</div>
              <div className="h5 text-primary font-weight-bold mb-0">Proxy Segura</div>
            </div>
          </div>
        </div>

        <h2 className="h4 text-white font-weight-bold mb-3">Isenção de Vínculo Legal</h2>
        <p className="small mb-4" style={{ lineHeight: '1.6' }}>
          Garantimos expressamente que este aplicativo <strong>não possui qualquer tipo de vínculo comercial, contrato de licenciamento de uso, patrocínio ou afiliação oficial com a FIFA</strong> ou qualquer uma de suas subsidiárias, comitês organizadores da Copa do Mundo, patrocinadores corporativos das marcas, ou federações de futebol de qualquer um dos países participantes. Todos os logotipos e escudos de seleções exibidos servem estritamente para propósitos de identificação visual informativa no contexto recreativo.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">Links Rápidos de Conformidade</h2>
        <div className="d-flex gap-3 flex-wrap">
          <Link to="/termos" className="btn btn-outline-warning btn-sm px-4 py-2 font-weight-bold" style={{ borderRadius: '10px' }}>
            ⚖️ Termos de Uso
          </Link>
          <Link to="/privacidade" className="btn btn-outline-success btn-sm px-4 py-2 font-weight-bold" style={{ borderRadius: '10px' }}>
            🛡️ Privacidade
          </Link>
          <Link to="/suporte" className="btn btn-outline-light btn-sm px-4 py-2 font-weight-bold" style={{ borderRadius: '10px' }}>
            💬 Suporte e FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
