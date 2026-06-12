import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { exportAppData, importAppData, clearAppData } from '../services/storage/storageAdapter';
import { vibrateSuccess, vibrateWarning, vibrateError } from '../services/hapticsService';

export default function Settings() {
  const isOnline = useOnlineStatus();
  const fileInputRef = useRef(null);
  const appVersion = '1.0.0';

  const handleExport = () => {
    try {
      const backupObj = exportAppData();
      const dataStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `palpitaria_copa2026_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      vibrateSuccess();
    } catch (err) {
      vibrateError();
      alert('Não foi possível exportar os dados de backup.');
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        
        if (window.confirm('Atenção: A importação de dados irá SOBRESCREVER todos os palpites e simulações salvos no aparelho atual. Deseja prosseguir?')) {
          importAppData(parsed);
          vibrateSuccess();
          alert('Importação concluída com sucesso! Recarregando dados da aplicação...');
          window.location.reload();
        }
      } catch (err) {
        vibrateError();
        alert(`Falha ao importar: ${err.message || 'Arquivo de backup corrompido ou JSON inválido.'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reseta input
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza de que deseja APAGAR permanentemente todos os seus palpites, chaveamentos e progresso de simulações do aparelho? Esta ação é irreversível.')) {
      vibrateWarning();
      clearAppData();
      alert('Todos os dados locais foram apagados. Recarregando...');
      window.location.reload();
    }
  };

  return (
    <main className="container pb-5 text-white animate-fade-in">
      <section className="hero mb-4">
        <div className="hero-content p-4 p-md-5 position-relative">
          <span className="hero-badge mb-2 d-inline-block">⚙️ Painel do Usuário</span>
          <h1>Configurações do Aplicativo</h1>
          <p className="text-muted-old mb-0">Gerencie seus arquivos de palpites, dados locais e preferências de privacidade.</p>
        </div>
      </section>

      <div className="row g-4">
        {/* Lado Esquerdo: Ajustes e Informações de Status */}
        <div className="col-12 col-md-6">
          <section className="toolbar p-4 rounded-3 text-white-50 h-100" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
            <h2 className="h5 text-white font-weight-bold mb-4">Diagnóstico do Sistema</h2>

            {/* Status da Conexão */}
            <div className="mb-4">
              <span className="d-block small text-muted-old mb-1">Status de Conexão:</span>
              <div className="d-flex align-items-center gap-2">
                {isOnline ? (
                  <>
                    <span style={{ color: '#00C853', fontSize: '1.25rem' }}>🟢</span>
                    <strong className="text-white small">Online (Conectado à Internet)</strong>
                  </>
                ) : (
                  <>
                    <span style={{ color: '#EF4444', fontSize: '1.25rem' }}>🔴</span>
                    <strong className="text-white small">Offline (Modo de Armazenamento Local)</strong>
                  </>
                )}
              </div>
            </div>

            {/* Versão do App */}
            <div className="mb-4">
              <span className="d-block small text-muted-old mb-1">Versão do Aplicativo:</span>
              <strong className="text-white small">{appVersion} (Lançamento Oficial 1.0.0)</strong>
            </div>

            {/* Links Rápidos de Navegação Legal */}
            <div className="mt-5">
              <span className="d-block small text-muted-old mb-2">Páginas Legais e Diretrizes:</span>
              <div className="d-flex flex-column gap-2">
                <Link to="/privacidade" className="small text-warning" style={{ textDecoration: 'none' }}>
                  🛡️ Política de Privacidade e Proteção de Dados
                </Link>
                <Link to="/privacidade-config" className="small text-warning" style={{ textDecoration: 'none' }}>
                  ⚙️ Configurações de Privacidade e Cookies (LGPD)
                </Link>
                <Link to="/termos" className="small text-warning" style={{ textDecoration: 'none' }}>
                  ⚖️ Termos de Utilização e Recreação
                </Link>
                <Link to="/suporte" className="small text-warning" style={{ textDecoration: 'none' }}>
                  💬 Central de Ajuda e Suporte ao Usuário
                </Link>
                <Link to="/sobre" className="small text-warning" style={{ textDecoration: 'none' }}>
                  🌎 Sobre a Palpitaria da Copa 2026
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Lado Direito: Exportar, Importar e Apagar */}
        <div className="col-12 col-md-6">
          <section className="toolbar p-4 rounded-3 text-white-50 h-100" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
            <h2 className="h5 text-white font-weight-bold mb-4">Gerenciamento de Dados</h2>
            <p className="small mb-4">
              Como todos os dados ficam salvos apenas no seu aparelho, utilize as opções abaixo para realizar cópias de segurança (backups) ou transferir seus palpites para outro navegador.
            </p>

            <div className="d-flex flex-column gap-3 mb-4">
              {/* Botão Exportar */}
              <button 
                type="button" 
                className="btn btn-warning py-3 font-weight-bold text-dark w-100" 
                onClick={handleExport}
                style={{ borderRadius: '12px', minHeight: '48px', fontSize: '0.9rem' }}
              >
                📥 Exportar Dados para Backup (.json)
              </button>

              {/* Botão Importar */}
              <button 
                type="button" 
                className="btn btn-outline-light py-3 font-weight-bold w-100" 
                onClick={handleImportClick}
                style={{ borderRadius: '12px', minHeight: '48px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                📤 Importar Dados de Backup (.json)
              </button>
              
              {/* Input Invisível para arquivo */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportFileChange} 
                accept=".json" 
                style={{ display: 'none' }} 
              />
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <div className="mt-4">
              <span className="d-block small text-danger font-weight-bold mb-2">Excluir Dados do Navegador:</span>
              <p className="small text-muted-old mb-3" style={{ fontSize: '0.8rem' }}>
                Caso queira limpar todos os seus palpites salvos para reiniciar sua simulação e zerar as conquistas:
              </p>
              <button 
                type="button" 
                className="btn btn-outline-danger w-100 py-2 font-weight-bold" 
                onClick={handleClear}
                style={{ borderRadius: '10px', fontSize: '0.85rem' }}
              >
                🗑️ Limpar Armazenamento Local
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
