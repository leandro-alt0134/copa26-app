import React from 'react';
import { clearAppData } from '../services/storage/storageAdapter';

export default function Support() {
  const versaoApp = '1.0.0';

  const handleResetData = () => {
    if (window.confirm('Atenção: Isso apagará permanentemente todos os seus palpites e simulações salvos neste aparelho. Esta ação não pode ser desfeita. Tem certeza de que deseja prosseguir?')) {
      clearAppData();
      alert('Todos os dados locais foram removidos com sucesso. A página será recarregada.');
      window.location.href = '/';
    }
  };

  return (
    <main className="container pb-5 text-white animate-fade-in">
      <section className="hero mb-4">
        <div className="hero-content p-4 p-md-5 position-relative">
          <span className="hero-badge mb-2 d-inline-block">💬 Ajuda e Suporte</span>
          <h1>Central de Ajuda</h1>
          <p className="text-muted-old mb-0">Tire suas dúvidas sobre o funcionamento do simulador e gerencie seus dados.</p>
        </div>
      </section>

      <div className="row g-4">
        {/* Lado Esquerdo: FAQ */}
        <div className="col-12 col-lg-8">
          <section className="toolbar p-4 rounded-3 text-white-50 h-100" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
            <h2 className="h4 text-white font-weight-bold mb-4">Perguntas Frequentes (FAQ)</h2>
            
            <div className="faq-item mb-4">
              <h3 className="h6 text-warning font-weight-bold mb-2">Como meus palpites são salvos?</h3>
              <p className="small">
                Todos os palpites que você cria na tela inicial e todo o progresso da aba "Minha Copa" são gravados localmente no seu navegador. Não transmitimos nenhum dado para servidores na nuvem, garantindo a sua privacidade e permitindo que o app funcione totalmente offline.
              </p>
            </div>

            <div className="faq-item mb-4">
              <h3 className="h6 text-warning font-weight-bold mb-2">Por que meus palpites sumiram?</h3>
              <p className="small">
                Isso acontece caso você tenha limpado o cache do seu navegador, apagado os dados de navegação ou utilizado um modo de navegação anônima (onde os dados são limpos automaticamente ao fechar as abas). Para evitar isso em futuras atualizações, você pode exportar seu arquivo de backup na página de configurações.
              </p>
            </div>

            <div className="faq-item mb-4">
              <h3 className="h6 text-warning font-weight-bold mb-2">Posso usar o aplicativo de forma 100% offline?</h3>
              <p className="small">
                Sim! Graças à tecnologia PWA (Progressive Web App), o aplicativo armazena as fotos das bandeiras, escudos, páginas e estilos. O simulador continuará funcionando mesmo sem internet no estádio ou no metrô.
              </p>
            </div>

            <div className="faq-item mb-0">
              <h3 className="h6 text-warning font-weight-bold mb-2">Como atualizar o aplicativo para receber novas versões?</h3>
              <p className="small">
                Quando uma nova versão do app estiver disponível, uma barra de aviso amigável aparecerá no rodapé ("Nova Versão Disponível"). Basta clicar em "Atualizar agora" para recarregar o app com as atualizações mais recentes.
              </p>
            </div>
          </section>
        </div>

        {/* Lado Direito: Contato e Reset */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Bloco de Contato */}
            <section className="toolbar p-4 rounded-3 text-white-50" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
              <h2 className="h5 text-white font-weight-bold mb-3">Contato e Feedback</h2>
              <p className="small mb-3">
                Quer reportar um erro de dados de seleções ou sugerir novos recursos? Envie um e-mail com as informações de erro e capturas de tela:
              </p>
              <div className="p-3 bg-dark bg-opacity-25 rounded-3 mb-2">
                <div className="small font-weight-bold text-white mb-1">E-mail:</div>
                <div className="small text-warning">[INSERIR E-MAIL DE CONTATO]</div>
              </div>
              <div className="small text-muted-old">
                Versão instalada: <strong>{versaoApp}</strong>
              </div>
            </section>

            {/* Bloco de Gerenciamento de Dados */}
            <section className="toolbar p-4 rounded-3 text-white-50 border border-danger border-opacity-25" style={{ background: 'rgba(30, 10, 10, 0.85)', backdropFilter: 'blur(14px)' }}>
              <h2 className="h5 text-danger font-weight-bold mb-3">Área de Perigo</h2>
              <p className="small mb-3 text-white-50">
                Se você está enfrentando problemas de travamentos ou deseja zerar o aplicativo para começar novos palpites do zero:
              </p>
              <button 
                type="button" 
                className="btn btn-outline-danger btn-sm w-100 py-2 font-weight-bold" 
                onClick={handleResetData}
                style={{ borderRadius: '10px' }}
              >
                🗑️ Apagar Todos os Dados Locais
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
