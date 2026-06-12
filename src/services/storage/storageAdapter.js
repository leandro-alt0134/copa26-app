import { STORAGE_KEYS } from './storageKeys';
import { CURRENT_STORAGE_VERSION, migrateStorage } from './storageMigrations';

// Inicializa migrações na primeira importação/carga do adapter
migrateStorage();

/**
 * Lê uma informação de forma segura do LocalStorage, tratando JSON inválido ou ausência.
 */
export function getAppData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao analisar JSON para a chave ${key}:`, err);
    return defaultValue;
  }
}

/**
 * Grava uma informação de forma segura, tratando falhas de quota cheia (Quota Exceeded).
 */
export function saveAppData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    if (err.name === 'QuotaExceededError' || err.code === 22 || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('Limite de espaço do LocalStorage excedido (Quota Exceeded)!');
      alert('Aviso: O armazenamento local está cheio. Não foi possível salvar novos dados.');
    } else {
      console.error(`Erro ao salvar no LocalStorage para a chave ${key}:`, err);
    }
    return false;
  }
}

/**
 * Remove apenas as chaves associadas a este aplicativo.
 */
export function clearAppData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (err) {
    console.error('Erro ao limpar dados locais do aplicativo:', err);
    return false;
  }
}

/**
 * Exporta todos os dados locais em formato de objeto estruturado.
 */
export function exportAppData() {
  try {
    return {
      version: CURRENT_STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      palpites: getAppData(STORAGE_KEYS.PALPITES, []),
      minhaCopa: getAppData(STORAGE_KEYS.MINHA_COPA, null),
      partidasAtualizadas: getAppData(STORAGE_KEYS.PARTIDAS_ATUALIZADAS, [])
    };
  } catch (err) {
    console.error('Erro ao estruturar exportação de dados:', err);
    throw new Error('Falha ao exportar dados.');
  }
}

/**
 * Importa e valida dados de backup de um arquivo JSON.
 */
export function importAppData(jsonData) {
  try {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Formato de dados de importação inválido.');
    }

    if (!jsonData.version) {
      throw new Error('Arquivo de dados sem indicação de versão de esquema.');
    }

    // Validações básicas de consistência
    const palpitesValidos = Array.isArray(jsonData.palpites);
    const partidasValidas = Array.isArray(jsonData.partidasAtualizadas);

    if (!palpitesValidos || !partidasValidas) {
      throw new Error('Estrutura de dados corrompida ou incompatível.');
    }

    // Grava dados após validação
    saveAppData(STORAGE_KEYS.PALPITES, jsonData.palpites);
    saveAppData(STORAGE_KEYS.PARTIDAS_ATUALIZADAS, jsonData.partidasAtualizadas);
    if (jsonData.minhaCopa) {
      saveAppData(STORAGE_KEYS.MINHA_COPA, jsonData.minhaCopa);
    } else {
      localStorage.removeItem(STORAGE_KEYS.MINHA_COPA);
    }

    localStorage.setItem(STORAGE_KEYS.VERSION, jsonData.version);
    return true;
  } catch (err) {
    console.error('Erro ao importar arquivo de backup:', err);
    throw err;
  }
}
