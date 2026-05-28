export const CONQUISTAS_LIST = [
  {
    id: 'primeiro_palpite',
    titulo: '🏅 Primeiro Palpite',
    descricao: 'Desbloqueado ao salvar o primeiro palpite.',
    emoji: '🏅'
  },
  {
    id: 'sequencia_5',
    titulo: '🔥 Sequência de 5',
    descricao: 'Desbloqueado ao salvar 5 palpites no total.',
    emoji: '🔥'
  },
  {
    id: 'analista_copa',
    titulo: '🧠 Analista da Copa',
    descricao: 'Desbloqueado ao salvar 3 palpites detalhados.',
    emoji: '🧠'
  },
  {
    id: 'palpiteiro_veloz',
    titulo: '⚡ Palpiteiro Veloz',
    descricao: 'Desbloqueado ao salvar 3 palpites rápidos.',
    emoji: '⚡'
  },
  {
    id: 'rei_2x1',
    titulo: '⚽ Rei do 2x1',
    descricao: 'Desbloqueado ao usar o placar 2x1 (ou 1x2) pelo menos 3 vezes.',
    emoji: '⚽'
  },
  {
    id: 'cacador_zebras',
    titulo: '🦓 Caçador de Zebras',
    descricao: 'Desbloqueado quando o perfil "Caçador de Zebras" é obtido.',
    emoji: '🦓'
  }
];

export function calcularConquistas(palpites = []) {
  const total = palpites.length;
  const detalhados = palpites.filter(p => p.tipoPalpite === 'detalhado').length;
  const rapidos = palpites.filter(p => p.tipoPalpite === 'rapido').length;

  const count2x1 = palpites.filter(p => {
    const pA = p.placar?.selecaoA;
    const pB = p.placar?.selecaoB;
    return (pA === 2 && pB === 1) || (pA === 1 && pB === 2);
  }).length;

  const temCacadorZebras = palpites.some(
    p => p.perfilPalpiteiro === 'Caçador de Zebras' || (p.perfilPalpiteiro && p.perfilPalpiteiro.nome === 'Caçador de Zebras')
  );

  return CONQUISTAS_LIST.map(conquista => {
    let unlocked = false;

    switch (conquista.id) {
      case 'primeiro_palpite':
        unlocked = total >= 1;
        break;
      case 'sequencia_5':
        unlocked = total >= 5;
        break;
      case 'analista_copa':
        unlocked = detalhados >= 3;
        break;
      case 'palpiteiro_veloz':
        unlocked = rapidos >= 3;
        break;
      case 'rei_2x1':
        unlocked = count2x1 >= 3;
        break;
      case 'cacador_zebras':
        unlocked = temCacadorZebras;
        break;
      default:
        unlocked = false;
    }

    return {
      ...conquista,
      unlocked
    };
  });
}
