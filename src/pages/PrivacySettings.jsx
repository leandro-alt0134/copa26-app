import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrivacyConsent } from '../services/adMobService';
import { vibrateSuccess, vibrateWarning } from '../services/hapticsService';

export default function PrivacySettings() {
  const [consent, setConsent] = useState(() => getPrivacyConsent());
  
  // Guardar estatísticas rápidas do LocalStorage
  const [diagnostics, setDiagnostics] = useState({
    palpitesCount: 0,
    minhaCopaActive: false,
    localStorageBytes: 0
  });

  useEffect(() => {
    // Calcular dados locais para transparência
    try {
      const palpites = localStorage.getItem('copa2026_palpites');
      const minhaCopa = localStorage.getItem('copa2026_minha_copa');
      const count = palpites ? JSON.parse(palpites).length : 0;
      const active = !!minhaCopa;

      // Medir tamanho total do localStorage aproximado em bytes
      let totalBytes = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          totalBytes += (localStorage[x].length + x.length) * 2;
        }
      }

      setDiagnostics({
        palpitesCount: count,
        minhaCopaActive: active,
        localStorageBytes: totalBytes
      });
    } catch (e) {
      console.warn('Erro ao ler diagnóstico do LocalStorage:', e);
    }
  }, []);

  const updateConsent = (adsEnabled, personalizedAds) => {
    try {
      const updated = {
        decisionMade: true,
        adsEnabled,
        personalizedAds
      };
      localStorage.setItem('copa2026_privacy_consent', JSON.stringify(updated));
      setConsent(updated);
      
      // Notificar componentes em tempo real
      window.dispatchEvent(new Event('copa2026_privacy_changed'));
      
      vibrateSuccess();
      alert('Configurações de privacidade atualizadas com sucesso!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearPrivacy = () => {
    if (window.confirm('Deseja redefinir suas preferências de privacidade? O banner de consentimento reaparecerá.')) {
      vibrateWarning();
      localStorage.removeItem('copa2026_privacy_consent');
      setConsent({ decisionMade: false, adsEnabled: false, personalizedAds: false });
      window.dispatchEvent(new Event('copa2026_privacy_changed'));
      alert('Preferências redefinidas. O banner de consentimento aparecerá na próxima inicialização.');
    }
  };

  return (
    <main className="container pb-5 text-white animate-fade-in">
      <section className="hero mb-4">
        <div className="hero-content p-4 p-md-5 position-relative">
          <span className="hero-badge mb-2 d-inline-block">🛡️ Preferências</span>
          <h1>Configurações de Privacidade</h1>
          <p className="text-muted-old mb-0">Você tem total controle sobre como seus dados e a publicidade no aplicativo são gerenciados.</p>
        </div>
      </section>

      <div className="row g-4">
        {/* Controle de Consentimento de Publicidade */}
        <div className="col-12 col-lg-7">
          <section className="toolbar p-4 rounded-3 text-white-50 h-100" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
            <h2 className="h5 text-white font-weight-bold mb-3">1. Consentimento e Publicidade</h2>
            <p className="small mb-4">
              Usamos anúncios de redes autorizadas (como Google AdSense e AdMob) para viabilizar financeiramente este simulador de forma gratuita. Escolha como deseja tratar a veiculação de anúncios:
            </p>

            {/* Opções granularizadas */}
            <div className="d-flex flex-column gap-3 mb-4">
              {/* Opção A: Personalizado */}
              <div 
                onClick={() => updateConsent(true, true)}
                className="p-3 rounded-3 cursor-pointer transition-all"
                style={{
                  background: consent.decisionMade && consent.adsEnabled && consent.personalizedAds ? 'rgba(0, 200, 83, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: consent.decisionMade && consent.adsEnabled && consent.personalizedAds ? '1px solid var(--primary, #00C853)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <strong className="text-white small">🟢 Anúncios Personalizados (Recomendado)</strong>
                  <span className="small text-muted-old">Ativado</span>
                </div>
                <p className="small mb-0 opacity-75" style={{ fontSize: '0.74rem' }}>
                  Os anúncios serão direcionados com base em seus interesses e histórico de navegação. Esse modo gera maior relevância de anúncios e apoia o projeto.
                </p>
              </div>

              {/* Opção B: Não-Personalizado */}
              <div 
                onClick={() => updateConsent(true, false)}
                className="p-3 rounded-3 cursor-pointer transition-all"
                style={{
                  background: consent.decisionMade && consent.adsEnabled && !consent.personalizedAds ? 'rgba(255, 193, 7, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: consent.decisionMade && consent.adsEnabled && !consent.personalizedAds ? '1px solid #FFC107' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <strong className="text-white small">🟡 Anúncios Não-Personalizados (Limitado)</strong>
                  <span className="small text-muted-old">Ativado</span>
                </div>
                <p className="small mb-0 opacity-75" style={{ fontSize: '0.74rem' }}>
                  Anúncios continuarão sendo exibidos, mas não usarão identificadores de rastreamento para anúncios comportamentais. Usará apenas contexto genérico e geolocalização básica.
                </p>
              </div>

              {/* Opção C: Desativar */}
              <div 
                onClick={() => updateConsent(false, false)}
                className="p-3 rounded-3 cursor-pointer transition-all"
                style={{
                  background: consent.decisionMade && !consent.adsEnabled ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: consent.decisionMade && !consent.adsEnabled ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <strong className="text-white small">🔴 Desativar Todos os Anúncios</strong>
                  <span className="small text-muted-old">Desativado</span>
                </div>
                <p className="small mb-0 opacity-75" style={{ fontSize: '0.74rem' }}>
                  Nenhum anúncio será carregado ou exibido no aplicativo. Respeito total às escolhas de desativação.
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-between flex-wrap gap-2">
              <button 
                type="button" 
                className="btn btn-outline-light btn-sm"
                onClick={handleClearPrivacy}
                style={{ fontSize: '0.76rem', borderRadius: '8px' }}
              >
                🔄 Redefinir Preferências (Ver Banner)
              </button>

              <Link to="/privacidade" className="small text-warning mt-1" style={{ textDecoration: 'none' }}>
                🛡️ Ver Política de Privacidade Completa
              </Link>
            </div>
          </section>
        </div>

        {/* Diagnóstico de Dados Locais */}
        <div className="col-12 col-lg-5">
          <section className="toolbar p-4 rounded-3 text-white-50 h-100" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
            <h2 className="h5 text-white font-weight-bold mb-3">2. Transparência de Dados Locais</h2>
            <p className="small mb-4">
              Seus dados nunca saem do seu dispositivo. Veja abaixo o diagnóstico de armazenamento local atual no seu aparelho:
            </p>

            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex justify-content-between border-bottom pb-2 border-secondary" style={{ fontSize: '0.8rem' }}>
                <span className="text-white-50">Palpites Registrados:</span>
                <strong className="text-white">{diagnostics.palpitesCount} palpites</strong>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 border-secondary" style={{ fontSize: '0.8rem' }}>
                <span className="text-white-50">Simulador "Minha Copa":</span>
                <strong className="text-white">{diagnostics.minhaCopaActive ? 'Ativo (Em progresso/salvo)' : 'Vazio/Inativo'}</strong>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 border-secondary" style={{ fontSize: '0.8rem' }}>
                <span className="text-white-50">Espaço em Uso no LocalStorage:</span>
                <strong className="text-white">~{(diagnostics.localStorageBytes / 1024).toFixed(2)} KB</strong>
              </div>
            </div>

            <div className="alert alert-success border-success text-success-light bg-dark-soft small mb-3 p-3" style={{ borderRadius: '12px', background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.15)' }}>
              <span className="font-weight-bold">💡 Conformidade LGPD:</span>
              <p className="mb-0 mt-1" style={{ fontSize: '0.72rem', color: '#B7C9C0' }}>
                Você tem o direito de exportar (portabilidade) ou excluir (esquecimento) esses dados a qualquer momento nas <Link to="/configuracoes" className="text-warning">Configurações Gerais</Link> da aplicação.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
