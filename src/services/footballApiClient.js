const PUBLIC_API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

/**
 * Cliente seguro de integração com a API de Futebol.
 * Evita a exposição de chaves privadas (ex: SOCCER_API_KEY) no bundle final do frontend.
 * Em produção, as requisições autenticadas devem ser intermediadas por um proxy/backend seguro.
 */
export async function fetchRealResultsFromProxy() {
  if (!PUBLIC_API_BASE_URL || PUBLIC_API_BASE_URL === 'https://api.seudominio.com' || PUBLIC_API_BASE_URL.trim() === '') {
    console.warn('VITE_PUBLIC_API_BASE_URL não está configurada ou é um placeholder. Usando fallback offline.');
    return [];
  }

  // Cria um controle de AbortController para timeout de 5 segundos
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}/api/fixtures`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro de resposta HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Tempo limite de conexão excedido ao buscar resultados da API (Timeout de 5s).');
    } else {
      console.error('Falha de conexão ou erro no proxy da API de Futebol:', error);
    }
    // Retorna array vazio como fallback resiliente offline
    return [];
  }
}
