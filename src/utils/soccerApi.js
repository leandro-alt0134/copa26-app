const API_URL = 'https://v3.football.api-sports.io/fixtures';
const API_KEY = import.meta.env.VITE_SOCCER_API_KEY;
const LEAGUE_ID = import.meta.env.VITE_LEAGUE_ID || 1; // ID 1 é a Copa do Mundo na API-Football
const SEASON = import.meta.env.VITE_SEASON || 2026;

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
    if (!API_KEY) {
      console.warn('VITE_SOCCER_API_KEY não configurado.');
      return [];
    }

    const response = await fetch(`${API_URL}?league=${LEAGUE_ID}&season=${SEASON}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY
      }
    });

    if (!response.ok) throw new Error('Falha ao buscar dados da API externa');
    
    const data = await response.json();
    if (!data || !data.response) return [];
    
    // Filtra e mapeia apenas as partidas que já terminaram (FT = Full Time, AET = Extra Time, PEN = Pênaltis)
    const partidasTerminadas = data.response.filter(item => 
      item.fixture && item.fixture.status && ['FT', 'AET', 'PEN'].includes(item.fixture.status.short)
    );

    return partidasTerminadas.map(item => {
      const nameA = item.teams.home.name;
      const nameB = item.teams.away.name;
      
      return {
        selecaoA: DE_PARA_SELECOES[nameA] || nameA,
        selecaoB: DE_PARA_SELECOES[nameB] || nameB,
        golsA: item.goals.home,
        golsB: item.goals.away,
        status: item.fixture.status.short,
        rodada: item.league.round // Ex: "Group Stage - 1" ou "Round of 32"
      };
    });
  } catch (error) {
    console.error('Erro na integração com a API de Futebol:', error);
    return [];
  }
}