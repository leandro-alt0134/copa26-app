import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  const dataAtualizacao = '11 de Junho de 2026';

  return (
    <main className="container pb-5 text-white animate-fade-in">
      <section className="hero mb-4">
        <div className="hero-content p-4 p-md-5 position-relative">
          <span className="hero-badge mb-2 d-inline-block">🛡️ Legal e Privacidade</span>
          <h1>Diretrizes de Privacidade</h1>
          <p className="text-muted-old mb-0">Entenda como seus dados locais e simulações são mantidos com total transparência e privacidade.</p>
        </div>
      </section>

      <section className="toolbar p-4 rounded-3 text-white-50" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
        <h2 className="h4 text-white font-weight-bold mb-3">1. Compromisso com a Privacidade</h2>
        <p className="small mb-4">
          O aplicativo <strong>Palpitaria da Copa 2026</strong> é comprometido em garantir a transparência no tratamento de dados e o respeito à privacidade dos usuários, em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">2. Responsabilidade do Aplicativo</h2>
        <p className="small mb-4">
          Este aplicativo é mantido de forma independente por <strong>Mongrel Tech Solutions</strong>. Para qualquer dúvida legal ou questionamento de privacidade, entre em contato via e-mail em <strong>mongreltechsolutions@gmail.com</strong>.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">3. Armazenamento Totalmente Local (LocalStorage)</h2>
        <p className="small mb-4">
          Todas as suas simulações de grupos, palpites exatos, chaves de mata-mata completadas e conquistas desbloqueadas são salvos <strong>exclusivamente de forma local no seu aparelho</strong> utilizando o armazenamento padrão do navegador (<code>localStorage</code>). Nenhuma informação pessoal ou palpite é transmitido a servidores externos ou terceiros de nossa parte.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">4. Consulta à API de Futebol Externa</h2>
        <p className="small mb-4">
          A fim de sincronizar a tabela de jogos com os resultados oficiais e reais da competição, o frontend do aplicativo pode fazer chamadas para um endpoint público intermediário (<code>VITE_PUBLIC_API_BASE_URL</code>). Nenhuma informação identificadora do usuário, geolocalização ou dado pessoal é transmitido nessa requisição.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">5. Publicidade e Cookies (AdSense e AdMob)</h2>
        <p className="small mb-4">
          Este aplicativo exibe anúncios de redes autorizadas para financiar seu desenvolvimento gratuito:
          <ul className="mt-2 text-white-50">
            <li><strong>Na Web e PWA:</strong> Exibimos anúncios via Google AdSense, que pode injetar cookies de personalização no seu navegador.</li>
            <li><strong>Nos Apps Nativos (Android/iOS):</strong> Utilizamos o SDK nativo do Google AdMob via Capacitor, que processa identificadores de publicidade do dispositivo para veicular anúncios adequados.</li>
          </ul>
          O usuário tem o direito total de recusar anúncios personalizados ou desativar anúncios por completo. Você pode gerenciar seu consentimento a qualquer momento nas <Link to="/privacidade-config" className="text-warning">Preferências de Privacidade</Link> do próprio aplicativo.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">6. Exportação, Importação e Exclusão de Dados</h2>
        <p className="small mb-4">
          Você tem total controle sobre seus palpites:
          <ul className="mt-2">
            <li><strong>Exportação:</strong> É possível baixar um arquivo JSON com todas as suas informações salvas a qualquer momento na tela de configurações.</li>
            <li><strong>Importação:</strong> Permite restaurar um backup JSON previamente gerado.</li>
            <li><strong>Exclusão Permanente:</strong> A exclusão de dados pode ser feita diretamente nas configurações ou apagando o cache/dados do navegador nas configurações do sistema.</li>
          </ul>
        </p>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2">
          <span className="small text-muted-old">Responsável: Mongrel Tech Solutions</span>
          <span className="small text-muted-old">Última Atualização: {dataAtualizacao}</span>
        </div>
      </section>
    </main>
  );
}
