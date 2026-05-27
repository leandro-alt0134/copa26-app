let selecoes = [];
let ordenacaoAtual = 'nome';
let buscaAtual = '';
let confederacaoAtual = 'todas';
let comparacaoSelecoes = [];

document.addEventListener('DOMContentLoaded', () => {
  carregarSelecoes();

  document.getElementById('ordenacao')?.addEventListener('change', (e) => {
    ordenacaoAtual = e.target.value;
    aplicarFiltrosEOrdenacao();
  });

  document.getElementById('busca')?.addEventListener('input', (e) => {
    buscaAtual = e.target.value;
    aplicarFiltrosEOrdenacao();
  });

  document.getElementById('filtro-confederacao')?.addEventListener('change', (e) => {
    confederacaoAtual = e.target.value;
    aplicarFiltrosEOrdenacao();
  });

  configurarModalEscudo();
  configurarComparador();
});

function carregarSelecoes() {
  fetch('data/selecoes.json')
    .then(response => response.json())
    .then(data => {
      selecoes = data.copa_2026 || [];
      atualizarEstatisticas();
      aplicarFiltrosEOrdenacao();
    })
    .catch(error => {
      console.error('Erro ao carregar data/selecoes.json:', error);
      document.getElementById('lista-selecoes').innerHTML = '<div class="col-12"><div class="empty-state">Não foi possível carregar as seleções.</div></div>';
    });
}

function valorOuPadrao(valor) {
  return valor === null || valor === undefined || valor === '' ? 'A confirmar' : valor;
}

function normalizarTexto(texto) {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = String(texto || '');
  return div.innerHTML;
}

function escaparAtributo(texto) {
  return escaparHtml(texto).replace(/"/g, '&quot;');
}

function criarCssUrl(caminho) {
  const valor = String(caminho || '').trim();
  if (!valor) return 'none';
  const seguro = valor.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
  return `url("${seguro}")`;
}

function nomeArquivoSeguro(nome) {
  return normalizarTexto(nome)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'escudo';
}

function configurarModalEscudo() {
  const modal = document.getElementById('escudo-modal');
  const botaoFechar = document.getElementById('fechar-modal-escudo');

  document.addEventListener('click', (event) => {
    const botaoEscudo = event.target.closest('[data-escudo-zoom]');
    if (botaoEscudo) {
      abrirModalEscudo(botaoEscudo.dataset.escudoSrc, botaoEscudo.dataset.escudoNome);
      return;
    }

    if (event.target.matches('[data-close-modal]')) {
      fecharModalEscudo();
    }
  });

  botaoFechar?.addEventListener('click', fecharModalEscudo);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
      fecharModalEscudo();
    }
  });
}

function abrirModalEscudo(src, nome) {
  const modal = document.getElementById('escudo-modal');
  const imagem = document.getElementById('escudo-modal-img');
  const titulo = document.getElementById('escudo-modal-titulo');
  const download = document.getElementById('escudo-download');
  const botaoFechar = document.getElementById('fechar-modal-escudo');

  if (!modal || !imagem || !titulo || !src) return;

  imagem.src = src;
  imagem.alt = `Escudo ampliado ${nome || ''}`.trim();
  titulo.textContent = nome || 'Escudo da seleção';

  if (download) {
    download.href = src;
    const extensao = src.split('.').pop()?.split('?')[0] || 'svg';
    download.download = `${nomeArquivoSeguro(nome)}-escudo.${extensao}`;
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  botaoFechar?.focus();
}

function fecharModalEscudo() {
  const modal = document.getElementById('escudo-modal');
  const imagem = document.getElementById('escudo-modal-img');

  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (imagem) imagem.src = '';
}

function atualizarEstatisticas() {
  document.getElementById('stat-total').textContent = selecoes.length;
  const totalTitulos = selecoes.reduce((acc, s) => acc + (Number(s.titulos) || 0), 0);
  document.getElementById('stat-titulos').textContent = totalTitulos;
}

function ordenar(lista) {
  const copia = [...lista];
  if (ordenacaoAtual === 'ranking') return copia.sort((a, b) => (Number(a.rankingFifa) || 999) - (Number(b.rankingFifa) || 999));
  if (ordenacaoAtual === 'titulos') return copia.sort((a, b) => (Number(b.titulos) || 0) - (Number(a.titulos) || 0) || a.nome.localeCompare(b.nome, 'pt-BR'));
  if (ordenacaoAtual === 'participacoes') return copia.sort((a, b) => (Number(b.participacoes) || 0) - (Number(a.participacoes) || 0) || a.nome.localeCompare(b.nome, 'pt-BR'));
  return copia.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function aplicarFiltrosEOrdenacao() {
  let filtradas = [...selecoes];

  if (buscaAtual.trim() !== '') {
    const termo = normalizarTexto(buscaAtual);
    filtradas = filtradas.filter(s => 
      normalizarTexto(s.nome).includes(termo) || 
      normalizarTexto(s.federacao).includes(termo)
    );
  }

  if (confederacaoAtual !== 'todas') {
    filtradas = filtradas.filter(s => s.confederacao === confederacaoAtual);
  }

  const info = document.getElementById('confederacao-info');
  if (info) {
    if (confederacaoAtual === 'todas') {
      info.textContent = buscaAtual.trim() !== '' ? `Filtrando resultados por "${buscaAtual}"` : '';
    } else {
      let texto = `Confederação: ${confederacaoAtual}`;
      if (buscaAtual.trim() !== '') texto += ` | Busca: "${buscaAtual}"`;
      info.textContent = texto;
    }
  }

  renderizarSelecoes(ordenar(filtradas));
}

function blocoAdsenseInline(indice) {
  return `
    <div class="col-12">
      <section class="ad-slot ad-slot--inline my-2" aria-label="Espaço para anúncio entre seleções">
        <span class="ad-slot__label">Publicidade</span>
        <div class="ad-slot__placeholder">Espaço para Google AdSense — anúncio entre cards ${indice}</div>
      </section>
    </div>`;
}

function renderizarSelecoes(lista) {
  const container = document.getElementById('lista-selecoes');
  const contador = document.getElementById('contador');
  container.innerHTML = '';
  contador.textContent = `${lista.length} seleções exibidas`;

  if (!lista.length) {
    container.innerHTML = '<div class="col-12"><div class="empty-state">Nenhuma seleção disponível.</div></div>';
    return;
  }

  lista.forEach((selecao, index) => {
    const siteDisponivel = selecao.site && selecao.site !== '#';
    const nome = escaparHtml(selecao.nome);
    const escudo = escaparAtributo(selecao.escudo);
    const bandeiraFundo = escaparAtributo(selecao.bandeiraFundo || selecao.bandeira || '');
    const estaSelecionada = comparacaoSelecoes.some(s => s.nome === selecao.nome);
    const fedValor = valorOuPadrao(selecao.federacao);
    const fedContent = siteDisponivel && fedValor !== 'A confirmar'
      ? `<a href="${escaparHtml(selecao.site)}" target="_blank" rel="noopener noreferrer" class="federacao-link">${escaparHtml(selecao.federacao)}</a>`
      : fedValor;
    const melhorCamp = escaparHtml(selecao.melhorCampanha || 'A confirmar');
    const estrelas = (selecao.jogadoresDestaque || []).map(j => `<span class="star-badge">${escaparHtml(j)}</span>`).join(' ');

    const card = `
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <article class="team-card">
          ${bandeiraFundo ? `<img src="${bandeiraFundo}" class="card-flag-bg" alt="" aria-hidden="true" loading="lazy">` : ''}
          <div class="topo-card">
            <button type="button" class="escudo-zoom-button" data-escudo-zoom data-escudo-src="${escudo}" data-escudo-nome="${nome}" aria-label="Ampliar escudo ${nome}">
              <img src="${escudo}" class="escudo" alt="Escudo ${nome}" loading="lazy" onerror="this.closest('button').style.display='none'">
            </button>
          </div>
          <div class="card-body p-3 p-md-4 d-flex flex-column flex-grow-1">
            <h2 class="card-title h5 mb-3">${nome}</h2>
            <div class="info-list">
              <div class="info-item"><span class="info-label">🏆 Títulos</span><span class="info-value">${valorOuPadrao(selecao.titulos)}</span></div>
              <div class="info-item"><span class="info-label">🌍 Ranking FIFA</span><span class="info-value">${valorOuPadrao(selecao.rankingFifa)}</span></div>
              <div class="info-item"><span class="info-label">🎯 Participações</span><span class="info-value">${valorOuPadrao(selecao.participacoes)}</span></div>
              <div class="info-item"><span class="info-label">🏢 Federação</span><span class="info-value">${fedContent}</span></div>
              <div class="info-item"><span class="info-label">🏅 Melhor Campanha</span><span class="info-value text-wrap text-end" style="max-width: 60%;" title="${melhorCamp}">${melhorCamp}</span></div>
              <div class="info-item flex-column align-items-start gap-1 pb-1">
                <span class="info-label">⭐ Destaques:</span>
                <div class="d-flex flex-wrap gap-1 mt-1">
                  ${estrelas || '<span class="text-white-50 small">A confirmar</span>'}
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 mt-auto">
              <a href="${siteDisponivel ? escaparHtml(selecao.site) : '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light flex-grow-1" style="font-size: 0.85rem; min-height: 38px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; ${siteDisponivel ? '' : 'pointer-events: none; opacity: 0.5;'}">Site Oficial</a>
              <button type="button" class="btn ${estaSelecionada ? 'btn-success' : 'btn-primary'} btn-compare px-2" data-compare-nome="${nome}" style="font-size: 0.85rem; min-height: 38px; border-radius: 10px; flex-shrink: 0;" aria-label="Comparar ${nome}">
                ${estaSelecionada ? '✅ Selecionada' : '⚖️ Comparar'}
              </button>
            </div>
          </div>
        </article>
      </div>`;

    container.innerHTML += card;

    if (index === 7 || index === 23 || index === 39) {
      container.innerHTML += blocoAdsenseInline(index + 1);
    }
  });
}

function configurarComparador() {
  const bar = document.getElementById('compare-bar');
  const selectedList = document.getElementById('compare-selected-list');
  const clearBtn = document.getElementById('compare-clear');
  const actionBtn = document.getElementById('compare-btn-action');
  
  const modal = document.getElementById('compare-modal');
  const modalClose = document.getElementById('compare-modal-close');
  const modalBackdrop = document.getElementById('compare-modal-backdrop');

  document.addEventListener('click', (e) => {
    const btnCompare = e.target.closest('.btn-compare');
    if (btnCompare) {
      const nome = btnCompare.dataset.compareNome;
      const selecao = selecoes.find(s => s.nome === nome);
      if (selecao) {
        toggleSelecaoComparador(selecao, btnCompare);
      }
      return;
    }

    const tagRemove = e.target.closest('.compare-badge__remove');
    if (tagRemove) {
      const nome = tagRemove.dataset.removeNome;
      const selecao = selecoes.find(s => s.nome === nome);
      if (selecao) {
        removerSelecaoComparador(selecao);
      }
      return;
    }
  });

  clearBtn?.addEventListener('click', () => {
    comparacaoSelecoes = [];
    atualizarBarraComparador();
    document.querySelectorAll('.btn-compare').forEach(btn => {
      btn.classList.remove('btn-success');
      btn.classList.add('btn-primary');
      btn.innerHTML = '⚖️ Comparar';
    });
  });

  actionBtn?.addEventListener('click', () => {
    if (comparacaoSelecoes.length === 2) {
      abrirComparador();
    }
  });

  const fecharModal = () => {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  };

  modalClose?.addEventListener('click', fecharModal);
  modalBackdrop?.addEventListener('click', fecharModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      fecharModal();
    }
  });
}

function toggleSelecaoComparador(selecao, btn) {
  const index = comparacaoSelecoes.findIndex(s => s.nome === selecao.nome);
  if (index !== -1) {
    comparacaoSelecoes.splice(index, 1);
    btn.classList.remove('btn-success');
    btn.classList.add('btn-primary');
    btn.innerHTML = '⚖️ Comparar';
  } else {
    if (comparacaoSelecoes.length >= 2) {
      alert('Você só pode comparar 2 seleções ao mesmo tempo. Remova uma primeiro!');
      return;
    }
    comparacaoSelecoes.push(selecao);
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-success');
    btn.innerHTML = '✅ Selecionada';
  }
  atualizarBarraComparador();
}

function removerSelecaoComparador(selecao) {
  const index = comparacaoSelecoes.findIndex(s => s.nome === selecao.nome);
  if (index !== -1) {
    comparacaoSelecoes.splice(index, 1);
    const btn = document.querySelector(`.btn-compare[data-compare-nome="${selecao.nome}"]`);
    if (btn) {
      btn.classList.remove('btn-success');
      btn.classList.add('btn-primary');
      btn.innerHTML = '⚖️ Comparar';
    }
    atualizarBarraComparador();
  }
}

function atualizarBarraComparador() {
  const bar = document.getElementById('compare-bar');
  const selectedList = document.getElementById('compare-selected-list');
  const actionBtn = document.getElementById('compare-btn-action');

  if (!bar || !selectedList) return;

  if (comparacaoSelecoes.length > 0) {
    bar.classList.add('is-visible');
    bar.setAttribute('aria-hidden', 'false');
    
    selectedList.innerHTML = comparacaoSelecoes.map(s => `
      <div class="compare-badge">
        <img src="${s.bandeiraQuadrada || s.bandeira || s.escudo}" alt="" style="width: 18px; height: 18px; object-fit: contain;">
        <span>${escaparHtml(s.nome)}</span>
        <span class="compare-badge__remove" data-remove-nome="${escaparAtributo(s.nome)}">&times;</span>
      </div>
    `).join('');

    if (comparacaoSelecoes.length === 2) {
      actionBtn.removeAttribute('disabled');
      actionBtn.classList.remove('btn-secondary');
      actionBtn.classList.add('btn-primary');
    } else {
      actionBtn.setAttribute('disabled', 'true');
    }
  } else {
    bar.classList.remove('is-visible');
    bar.setAttribute('aria-hidden', 'true');
    selectedList.innerHTML = '';
    actionBtn.setAttribute('disabled', 'true');
  }
}

function abrirComparador() {
  const modal = document.getElementById('compare-modal');
  if (!modal || comparacaoSelecoes.length !== 2) return;

  const t1 = comparacaoSelecoes[0];
  const t2 = comparacaoSelecoes[1];

  document.getElementById('compare-t1-escudo').src = t1.escudo;
  document.getElementById('compare-t1-escudo').alt = `Escudo de ${t1.nome}`;
  document.getElementById('compare-t1-nome').textContent = t1.nome;
  document.getElementById('compare-t1-confed').textContent = t1.confederacao || 'Federação';

  document.getElementById('compare-t2-escudo').src = t2.escudo;
  document.getElementById('compare-t2-escudo').alt = `Escudo de ${t2.nome}`;
  document.getElementById('compare-t2-nome').textContent = t2.nome;
  document.getElementById('compare-t2-confed').textContent = t2.confederacao || 'Federação';

  const titulos1 = Number(t1.titulos) || 0;
  const titulos2 = Number(t2.titulos) || 0;
  document.getElementById('compare-val-titulos-1').textContent = titulos1;
  document.getElementById('compare-val-titulos-2').textContent = titulos2;
  
  const totalTitulos = Math.max(titulos1 + titulos2, 1);
  const pctTit1 = (titulos1 / totalTitulos) * 100;
  const pctTit2 = (titulos2 / totalTitulos) * 100;
  document.getElementById('compare-bar-titulos-1').style.width = titulos1 > 0 || titulos2 > 0 ? `${pctTit1}%` : '0%';
  document.getElementById('compare-bar-titulos-2').style.width = titulos1 > 0 || titulos2 > 0 ? `${pctTit2}%` : '0%';

  const rankVal1 = t1.rankingFifa === 'A confirmar' ? 'A confirmar' : Number(t1.rankingFifa) || 'A confirmar';
  const rankVal2 = t2.rankingFifa === 'A confirmar' ? 'A confirmar' : Number(t2.rankingFifa) || 'A confirmar';
  document.getElementById('compare-val-ranking-1').textContent = rankVal1;
  document.getElementById('compare-val-ranking-2').textContent = rankVal2;

  const rankNum1 = rankVal1 === 'A confirmar' ? 100 : rankVal1;
  const rankNum2 = rankVal2 === 'A confirmar' ? 100 : rankVal2;
  
  const score1 = Math.max(101 - rankNum1, 1);
  const score2 = Math.max(101 - rankNum2, 1);
  const totalScore = score1 + score2;
  const pctRank1 = (score1 / totalScore) * 100;
  const pctRank2 = (score2 / totalScore) * 100;
  document.getElementById('compare-bar-ranking-1').style.width = `${pctRank1}%`;
  document.getElementById('compare-bar-ranking-2').style.width = `${pctRank2}%`;

  const part1 = Number(t1.participacoes) || 0;
  const part2 = Number(t2.participacoes) || 0;
  document.getElementById('compare-val-part-1').textContent = part1;
  document.getElementById('compare-val-part-2').textContent = part2;

  const totalPart = Math.max(part1 + part2, 1);
  const pctPart1 = (part1 / totalPart) * 100;
  const pctPart2 = (part2 / totalPart) * 100;
  document.getElementById('compare-bar-part-1').style.width = part1 > 0 || part2 > 0 ? `${pctPart1}%` : '0%';
  document.getElementById('compare-bar-part-2').style.width = part1 > 0 || part2 > 0 ? `${pctPart2}%` : '0%';

  document.getElementById('compare-val-fed-1').textContent = t1.federacao || '—';
  document.getElementById('compare-val-fed-2').textContent = t2.federacao || '—';

  document.getElementById('compare-val-campanha-1').textContent = t1.melhorCampanha || 'A confirmar';
  document.getElementById('compare-val-campanha-2').textContent = t2.melhorCampanha || 'A confirmar';

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.getElementById('compare-modal-close')?.focus();
}
