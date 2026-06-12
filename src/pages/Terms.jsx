import React from 'react';

export default function Terms() {
  const dataAtualizacao = '11 de Junho de 2026';

  return (
    <main className="container pb-5 text-white animate-fade-in">
      <section className="hero mb-4">
        <div className="hero-content p-4 p-md-5 position-relative">
          <span className="hero-badge mb-2 d-inline-block">⚖️ Regras e Diretrizes</span>
          <h1>Termos de Uso</h1>
          <p className="text-muted-old mb-0">Leia os termos de utilização da aplicação independente de simulação e entretenimento.</p>
        </div>
      </section>

      <section className="toolbar p-4 rounded-3 text-white-50" style={{ background: 'rgba(4, 62, 39, 0.86)', border: '1px solid rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(14px)' }}>
        <h2 className="h4 text-white font-weight-bold mb-3">1. Caráter Recreativo e de Entretenimento</h2>
        <p className="small mb-4">
          O aplicativo <strong>Palpitaria da Copa 2026</strong> é um simulador gamificado recreativo voltado exclusivamente para entretenimento pessoal. Ele permite projetar os placares da fase de grupos, montar chaves de mata-mata e prever posições sem qualquer valor financeiro envolvido.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">2. Isenção Total de Apostas e Prêmios</h2>
        <p className="small mb-4">
          <strong>Este NÃO é um aplicativo de apostas esportivas</strong>. Não coletamos dinheiro, não realizamos intermediação financeira, não oferecemos promessas de ganhos financeiros e não distribuímos prêmios de qualquer tipo aos usuários que simularem resultados ou acertarem palpites.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">3. Independência de Entidades Oficiais</h2>
        <p className="small mb-4">
          Este aplicativo é totalmente <strong>independente e privado</strong>. Não possui afiliação, associação comercial, patrocínio, endosso ou chancela legal da FIFA (Fédération Internationale de Football Association), das federações nacionais de futebol, das seleções participantes ou de qualquer patrocinador oficial da Copa do Mundo de 2026.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">4. Exclusão de Garantias de Resultados</h2>
        <p className="small mb-4">
          As estatísticas de seleções (títulos, ranking da FIFA e participações), previsões automáticas baseadas em questionários de torque e simulações de chaveamentos são demonstrativas. Os palpites e resultados gerados no aplicativo não garantem, sob hipótese alguma, o resultado real das partidas de futebol da competição.
        </p>

        <h2 className="h4 text-white font-weight-bold mb-3">5. Uso de Armazenamento Local e Responsabilidade</h2>
        <p className="small mb-4">
          Os dados salvos no seu aparelho dependem da integridade do <code>localStorage</code> do seu navegador. Não somos responsáveis por perda acidental de palpites decorrente de limpezas de cache de navegadores, reinstalação do aplicativo ou restauração de fábrica do aparelho.
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
