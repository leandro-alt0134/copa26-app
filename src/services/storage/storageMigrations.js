import { STORAGE_KEYS } from './storageKeys';

export const CURRENT_STORAGE_VERSION = '1.0.0';

/**
 * Executa migrações caso o schema do LocalStorage mude nas próximas versões.
 * Para a versão inicial (1.0.0), garante que chaves antigas sejam carimbadas com a versão inicial.
 */
export function migrateStorage() {
  try {
    const activeVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    if (!activeVersion) {
      // Primeira inicialização ou legado sem versão.
      // Stamp da versão atual.
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_STORAGE_VERSION);
      console.log(`Carimbo de versão inicial definido para: ${CURRENT_STORAGE_VERSION}`);
    } else if (activeVersion !== CURRENT_STORAGE_VERSION) {
      console.log(`Detectada alteração de versão: ${activeVersion} -> ${CURRENT_STORAGE_VERSION}. Executando migração.`);
      
      // Aqui seriam incluídos os cases de migração passo-a-passo. Ex:
      // if (activeVersion === '0.9.0') { migrateTo100(); }

      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_STORAGE_VERSION);
    }
  } catch (err) {
    console.error('Falha ao processar migrações do LocalStorage:', err);
  }
}
