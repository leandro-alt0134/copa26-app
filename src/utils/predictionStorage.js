import { getAppData, saveAppData } from '../services/storage/storageAdapter';
import { STORAGE_KEYS } from '../services/storage/storageKeys';

export function carregarPalpites() {
  try {
    const lista = getAppData(STORAGE_KEYS.PALPITES, []);
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
    console.error("Erro ao carregar palpites:", err);
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

    return saveAppData(STORAGE_KEYS.PALPITES, palpites);
  } catch (err) {
    console.error("Erro ao salvar palpite:", err);
    return false;
  }
}

export function limparTodosPalpites() {
  try {
    return saveAppData(STORAGE_KEYS.PALPITES, []);
  } catch (err) {
    console.error("Erro ao limpar palpites:", err);
    return false;
  }
}

export function carregarPartidasAtualizadas() {
  try {
    return getAppData(STORAGE_KEYS.PARTIDAS_ATUALIZADAS, null);
  } catch (err) {
    console.error("Erro ao carregar partidas atualizadas:", err);
    return null;
  }
}

export function salvarPartidasAtualizadas(partidas) {
  try {
    return saveAppData(STORAGE_KEYS.PARTIDAS_ATUALIZADAS, partidas);
  } catch (err) {
    console.error("Erro ao salvar partidas atualizadas:", err);
    return false;
  }
}


