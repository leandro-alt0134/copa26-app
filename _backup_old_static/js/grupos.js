let chaveamentoDados = {};
let faseAtivaIndex = 0;
const ordemEtapas = ['dezesseis_avos', 'oitavas', 'quartas', 'semifinais', 'final'];

document.addEventListener('DOMContentLoaded', () => {
  carregarGrupos();

  document.getElementById('btn-prev-fase')?.addEventListener('click', () => {
    if (faseAtivaIndex > 0) {
      faseAtivaIndex--;
      renderizarChaveamento();
    }
  });

  document.getElementById('btn-next-fase')?.addEventListener('click', () => {
    if (faseAtivaIndex < ordemEtapas.length - 1) {
      faseAtivaIndex++;
      renderizarChaveamento();
    }
  });

  document.getElementById('carousel-indicators')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.indicator-pill');
    if (btn) {
      faseAtivaIndex = parseInt(btn.dataset.faseIdx, 10);
      renderizarChaveamento();
    }
  });
});

function carregarGrupos() {
  fetch('data/grupos.json')
    .then(response => response.json())
    .then(data => {
      renderizarGrupos(data.grupos || []);
      chaveamentoDados = data.chaveamento || {};
      renderizarChaveamento();
      document.getElementById('stat-grupos').textContent = (data.grupos || []).length;
      document.getElementById('stat-selecoes-grupos').textContent = (data.grupos || []).reduce((acc, g) => acc + (g.selecoes || []).length, 0);
    })
    .catch(error => {
      console.error('Erro ao carregar grupos.json:', error);
      document.getElementById('lista-grupos').innerHTML = '<div class="col-12"><div class="empty-state">Não foi possível carregar os grupos.</div></div>';
    });
}

function renderizarGrupos(grupos) {
  const container = document.getElementById('lista-grupos');
  container.innerHTML = '';
  grupos.forEach(grupo => {
    const linhas = (grupo.selecoes || []).map((time, index) => `
      <div class="team-row">
        <img src="${time.bandeiraQuadrada || time.bandeira || time.escudo}" class="team-mini" alt="Bandeira ${time.nome}" loading="lazy" onerror="this.style.display='none'">
        <span class="team-name">${index + 1}. ${time.nome}</span>
        <span class="stand-cell">${time.pontos ?? 0}</span>
        <span class="stand-cell">${time.jogos ?? 0}</span>
        <span class="stand-cell">${time.vitorias ?? 0}</span>
        <span class="stand-cell">${time.saldo ?? 0}</span>
      </div>`).join('');
    container.innerHTML += `
      <div class="col-12 col-lg-6 col-xxl-4">
        <article class="group-card">
          <div class="group-header">
            <h2 class="group-title">${grupo.grupo}</h2>
            <span class="badge rounded-pill text-bg-light">4 seleções</span>
          </div>
          <div class="team-row header">
            <span></span><span>Seleção</span><span>Pts</span><span>J</span><span>V</span><span>SG</span>
          </div>
          ${linhas}
        </article>
      </div>`;
  });
}

function tituloEtapa(chave) {
  const nomes = {
    dezesseis_avos: 'Dezesseis-avos',
    oitavas: 'Oitavas de Final',
    quartas: 'Quartas de Final',
    semifinais: 'Semifinais',
    final: 'Finais'
  };
  return nomes[chave] || chave;
}

function renderizarChaveamento() {
  const container = document.getElementById('chaveamento');
  if (!container) return;
  container.innerHTML = '';
  
  const etapa = ordemEtapas[faseAtivaIndex];
  const jogos = chaveamentoDados[etapa] || [];
  if (!jogos.length) return;

  const gridClass = jogos.length > 4 ? 'grid-2col' : '';

  container.innerHTML = `
    <div class="bracket-column active">
      <section class="bracket-card p-3 p-md-4">
        <h2 class="bracket-stage-title h5 text-center pb-2 mb-3 border-bottom border-light-subtle">${tituloEtapa(etapa)}</h2>
        <div class="matches-list ${gridClass}">
          ${jogos.map(jogo => `
            <div class="match">
              <div class="match-label">${jogo.jogo}</div>
              <div class="match-team"><span>${jogo.timeA}</span><strong>—</strong></div>
              <div class="match-team"><span>${jogo.timeB}</span><strong>—</strong></div>
            </div>`).join('')}
        </div>
      </section>
    </div>`;

  atualizarControleCarousel();
}

function atualizarControleCarousel() {
  const indicators = document.getElementById('carousel-indicators');
  if (!indicators) return;

  indicators.innerHTML = ordemEtapas.map((etapa, idx) => `
    <button type="button" class="indicator-pill ${idx === faseAtivaIndex ? 'active' : ''}" data-fase-idx="${idx}">
      ${tituloEtapa(etapa)}
    </button>
  `).join('');

  const btnPrev = document.getElementById('btn-prev-fase');
  const btnNext = document.getElementById('btn-next-fase');

  if (btnPrev) {
    if (faseAtivaIndex === 0) {
      btnPrev.setAttribute('disabled', 'true');
      btnPrev.classList.add('opacity-50');
    } else {
      btnPrev.removeAttribute('disabled');
      btnPrev.classList.remove('opacity-50');
    }
  }

  if (btnNext) {
    if (faseAtivaIndex === ordemEtapas.length - 1) {
      btnNext.setAttribute('disabled', 'true');
      btnNext.classList.add('opacity-50');
    } else {
      btnNext.removeAttribute('disabled');
      btnNext.classList.remove('opacity-50');
    }
  }
}
