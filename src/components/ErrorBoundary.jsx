import React, { Component } from 'react';
import { clearAppData } from '../services/storage/storageAdapter';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou uma falha grave na renderização:', error, errorInfo);
  }

  handleRestart = () => {
    window.location.href = '/';
  };

  handleClearData = () => {
    if (window.confirm('Atenção: Isso apagará permanentemente todas as suas simulações e palpites salvos no dispositivo. Essa ação pode corrigir o erro se ele tiver sido causado por dados corrompidos. Deseja prosseguir?')) {
      clearAppData();
      alert('Dados limpos com sucesso. O aplicativo será recarregado.');
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="container pb-5 text-white text-center d-flex flex-column align-items-center justify-content-center animate-fade-in" style={{ minHeight: '80vh' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🚑⚽</div>
          <h1 className="h2 font-weight-bold text-danger mb-3">Ocorreu um erro inesperado</h1>
          <p className="text-white-50 mb-4" style={{ maxWidth: '600px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Pedimos desculpas pelo inconveniente. Uma falha de processamento na interface foi detectada. Tente reiniciar a aplicação ou limpar o cache do navegador.
          </p>

          {this.state.error && (
            <div className="p-3 bg-dark bg-opacity-50 text-start rounded-3 mb-4 w-100" style={{ maxWidth: '600px', border: '1px solid rgba(255, 0, 0, 0.2)', overflowX: 'auto' }}>
              <strong className="text-danger small d-block mb-1">Mensagem técnica de erro:</strong>
              <code className="text-white-50" style={{ fontSize: '0.78rem' }}>{this.state.error.toString()}</code>
            </div>
          )}

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button 
              type="button" 
              className="btn btn-warning px-4 py-2 font-weight-bold" 
              onClick={this.handleRestart}
              style={{ borderRadius: '12px' }}
            >
              🔄 Recarregar Início
            </button>
            <button 
              type="button" 
              className="btn btn-outline-danger px-4 py-2 font-weight-bold" 
              onClick={this.handleClearData}
              style={{ borderRadius: '12px' }}
            >
              🗑️ Limpar Dados e Reiniciar
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
