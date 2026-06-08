const STORAGE_KEY = "copa2026_palpites";

export function carregarPalpites() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (!dados) return [];
    
    const lista = JSON.parse(dados);
    if (!Array.isArray(lista)) return [];

    // Aplicar retrocompatibilidade com dados antigos
    return lista.map((palpite) => {
      return {
        ...palpite,
        tipoPalpite: palpite.tipoPalpite || "rapido",
        nivelConfianca: palpite.nivelConfianca || "Não informado",
        perfilPalpiteiro: palpite.perfilPalpiteiro || "Palpiteiro da Copa",
        pontuacao: palpite.pontuacao || {
          selecaoA: 0,
          empate: 0,
          selecaoB: 0
        }
      };
    });
  } catch (err) {
    console.error("Erro ao carregar palpites do localStorage:", err);
    return [];
  }
}

export function salvarPalpite(palpite) {
  try {
    const palpites = carregarPalpites();
    
    // Procura palpite existente correspondente a partidaId e tipoPalpite
    const index = palpites.findIndex(
      (item) => item.matchId === palpite.matchId && item.tipoPalpite === palpite.tipoPalpite
    );

    const novoPalpite = {
      ...palpite,
      createdAt: palpite.createdAt || new Date().toISOString()
    };

    if (index >= 0) {
      palpites[index] = novoPalpite;
    } else {
      palpites.push(novoPalpite);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(palpites));
    return true;
  } catch (err) {
    console.error("Erro ao salvar palpite no localStorage:", err);
    return false;
  }
}

export function limparTodosPalpites() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error("Erro ao limpar palpites do localStorage:", err);
    return false;
  }
}

const MATCHES_STORAGE_KEY = "copa2026_partidas_atualizadas";

export function carregarPartidasAtualizadas() {
  try {
    const dados = localStorage.getItem(MATCHES_STORAGE_KEY);
    if (!dados) return null;
    return JSON.parse(dados);
  } catch (err) {
    console.error("Erro ao carregar partidas atualizadas do localStorage:", err);
    return null;
  }
}

export function salvarPartidasAtualizadas(partidas) {
  try {
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(partidas));
    return true;
  } catch (err) {
    console.error("Erro ao salvar partidas atualizadas no localStorage:", err);
    return false;
  }
}

