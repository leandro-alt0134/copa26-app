document.addEventListener('DOMContentLoaded', () => {
  // 1. Lógica do botão Voltar ao Topo
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const alternarVisibilidade = () => {
      if (window.scrollY > 360) backToTop.classList.add('is-visible');
      else backToTop.classList.remove('is-visible');
    };

    window.addEventListener('scroll', alternarVisibilidade, { passive: true });
    alternarVisibilidade();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Lógica do Cronômetro Regressivo (Abertura: 11 de Junho de 2026)
  inicializarCronometro();
});

function inicializarCronometro() {
  const container = document.getElementById('countdown');
  if (!container) return;

  // Data de abertura: 11 de Junho de 2026 às 18:00:00 (Fuso do México/Texas: UTC-5)
  const dataAbertura = new Date('2026-06-11T18:00:00-05:00').getTime();

  const atualizarTempo = () => {
    const agora = new Date().getTime();
    const diferenca = dataAbertura - agora;

    if (diferenca <= 0) {
      container.innerHTML = '<span class="countdown-started">🏆 A Copa do Mundo 2026 começou!</span>';
      clearInterval(intervalo);
      return;
    }

    const umDia = 24 * 60 * 60 * 1000;
    const umaHora = 60 * 60 * 1000;
    const umMinuto = 60 * 1000;

    const dias = Math.floor(diferenca / umDia);
    const horas = Math.floor((diferenca % umDia) / umaHora);
    const minutos = Math.floor((diferenca % umaHora) / umMinuto);
    const segundos = Math.floor((diferenca % umMinuto) / 1000);

    const elDias = document.getElementById('countdown-dias');
    const elHoras = document.getElementById('countdown-horas');
    const elMinutos = document.getElementById('countdown-minutos');
    const elSegundos = document.getElementById('countdown-segundos');

    if (elDias) elDias.textContent = String(dias).padStart(2, '0');
    if (elHoras) elHoras.textContent = String(horas).padStart(2, '0');
    if (elMinutos) elMinutos.textContent = String(minutos).padStart(2, '0');
    if (elSegundos) elSegundos.textContent = String(segundos).padStart(2, '0');
  };

  atualizarTempo();
  const intervalo = setInterval(atualizarTempo, 1000);
}
