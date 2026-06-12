import { fetchRealResultsFromProxy } from '../services/footballApiClient';

// Dicionário De/Para para traduzir os nomes retornados pela API (Inglês) para os nomes em Português do projeto
const DE_PARA_SELECOES = {
  "Algeria": "Argélia",
  "Argentina": "Argentina",
  "Australia": "Austrália",
  "Austria": "Áustria",
  "Belgium": "Bélgica",
  "Bosnia and Herzegovina": "Bósnia e Herzegovina",
  "Bosnia-Herzegovina": "Bósnia e Herzegovina",
  "Brazil": "Brasil",
  "Cape Verde": "Cabo Verde",
  "Canada": "Canadá",
  "Colombia": "Colômbia",
  "DR Congo": "RD Congo",
  "Congo DR": "RD Congo",
  "Ivory Coast": "Costa do Marfim",
  "Croatia": "Croácia",
  "Curacao": "Curaçao",
  "Czech Republic": "República Tcheca",
  "Czechia": "República Tcheca",
  "Ecuador": "Equador",
  "Egypt": "Egito",
  "England": "Inglaterra",
  "France": "França",
  "Germany": "Alemanha",
  "Ghana": "Gana",
  "Haiti": "Haiti",
  "Iran": "Irã",
  "Iraq": "Iraque",
  "Japan": "Japão",
  "Jordan": "Jordânia",
  "Mexico": "México",
  "Morocco": "Marrocos",
  "Netherlands": "Holanda",
  "New Zealand": "Nova Zelândia",
  "Norway": "Noruega",
  "Panama": "Panamá",
  "Paraguay": "Paraguai",
  "Portugal": "Portugal",
  "Qatar": "Catar",
  "Saudi Arabia": "Arábia Saudita",
  "Scotland": "Escócia",
  "Senegal": "Senegal",
  "South Africa": "África do Sul",
  "South Korea": "Coreia do Sul",
  "Korea Republic": "Coreia do Sul",
  "Spain": "Espanha",
  "Sweden": "Suécia",
  "Switzerland": "Suíça",
  "Tunisia": "Tunísia",
  "Turkey": "Turquia",
  "Uruguay": "Uruguai",
  "USA": "Estados Unidos",
  "United States": "Estados Unidos",
  "Uzbekistan": "Uzbequistão"
};

/**
 * Busca todas as partidas da Copa do Mundo 2026 e retorna os resultados reais
 */
export async function buscarResultadosReais() {
  try {
    const resultados = await fetchRealResultsFromProxy();
    if (!resultados || resultados.length === 0) return [];

    return resultados.map(item => {
      const nameA = item.selecaoA;
      const nameB = item.selecaoB;
      
      return {
        selecaoA: DE_PARA_SELECOES[nameA] || nameA,
        selecaoB: DE_PARA_SELECOES[nameB] || nameB,
        golsA: item.golsA,
        golsB: item.golsB,
        status: item.status || 'FT',
        rodada: item.rodada
      };
    });
  } catch (error) {
    console.error('Erro ao mapear resultados reais:', error);
    return [];
  }
}