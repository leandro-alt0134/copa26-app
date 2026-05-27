let partidas = [];
let filtroGrupoVal = 'todos';
let filtroRodadaVal = 'todas';

document.addEventListener('DOMContentLoaded', () => {
  carregarPartidas();
  configurarFiltros();
});

function carregarPartidas() {
  fetch('data/partidas.json')
    .then(response => response.json())
    .then(data => {
      partidas = data;
      aplicarFiltros();
    })
    .catch(error => {
      console.error('Erro ao carregar data/partidas.json:', error);
      document.getElementById('lista-confrontos').innerHTML = `
        <div class="col-12">
          <div class="empty-state">Não foi possível carregar a lista de confrontos.</div>
        </div>`;
    });
}

function configurarFiltros() {
  document.getElementById('filtro-grupo')?.addEventListener('change', (e) => {
    filtroGrupoVal = e.target.value;
    aplicarFiltros();
  });

  document.getElementById('filtro-rodada')?.addEventListener('change', (e) => {
    filtroRodadaVal = e.target.value;
    aplicarFiltros();
  });
}

function aplicarFiltros() {
  let filtradas = [...partidas];

  if (filtroGrupoVal !== 'todos') {
    filtradas = filtradas.filter(p => p.grupo === filtroGrupoVal);
  }

  if (filtroRodadaVal !== 'todas') {
    filtradas = filtradas.filter(p => p.rodada === parseInt(filtroRodadaVal));
  }

  renderizarConfrontos(filtradas);
}

function renderizarConfrontos(lista) {
  const container = document.getElementById('lista-confrontos');
  const contador = document.getElementById('contador-confrontos');
  
  if (!container || !contador) return;

  container.innerHTML = "";
  contador.textContent = `${lista.length} confrontos encontrados`;

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          Nenhum confronto correspondente aos filtros selecionados.
        </div>
      </div>`;
    return;
  }

  lista.forEach(partida => {
    const cardCol = document.createElement('div');
    cardCol.className = "col-12 col-lg-6";
    cardCol.innerHTML = `
      <article class="match-picker-card p-3 mb-2">
        <div class="match-card-vs">
          <!-- Seleção A -->
          <div class="match-card-team">
            <div class="match-card-escudo-wrapper" style="width: 70px; height: 70px; border-radius: 18px;">
              <img src="${partida.escudoA}" alt="Escudo de ${partida.selecaoA}" class="match-card-escudo" onerror="this.src='assets/copa-2026-logo-white.svg'">
            </div>
            <h3 class="match-card-team-name mt-2" style="font-size: 1rem;">${partida.selecaoA}</h3>
          </div>

          <!-- Meio -->
          <div class="match-card-center-vs">
            <span class="match-card-badge" style="font-size: 0.7rem;">Grupo ${partida.grupo} — Rodada ${partida.rodada}</span>
            <span class="match-card-vs-text" style="font-size: 1.4rem;">VS</span>
            <a href="palpites.html" class="btn btn-primary btn-sm px-3 mt-2" style="font-size: 0.78rem; min-height: 32px; border-radius: 8px;" onclick="guardarPartidaPreSelecionada('${partida.id}')">
              Palpitar 🎮
            </a>
          </div>

          <!-- Seleção B -->
          <div class="match-card-team">
            <div class="match-card-escudo-wrapper" style="width: 70px; height: 70px; border-radius: 18px;">
              <img src="${partida.escudoB}" alt="Escudo de ${partida.selecaoB}" class="match-card-escudo" onerror="this.src='assets/copa-2026-logo-white.svg'">
            </div>
            <h3 class="match-card-team-name mt-2" style="font-size: 1rem;">${partida.selecaoB}</h3>
          </div>
        </div>
      </article>
    `;
    container.appendChild(cardCol);
  });
}

// Armazena a partida selecionada para quando o usuário carregar palpites.html ele já comece com a partida carregada
function guardarPartidaPreSelecionada(partidaId) {
  sessionStorage.setItem('pre_selected_match_id', partidaId);
}
