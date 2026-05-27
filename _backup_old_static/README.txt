Projeto Copa do Mundo 2026

Estrutura principal:
- index.html: página de seleções
- grupos.html: página de grupos e chaveamento
- css/style.css: estilos globais separados do HTML
- js/app.js: lógica da página inicial
- js/grupos.js: lógica da página de grupos/chaveamento
- selecoes.json: dados das 48 seleções
- data/grupos.json: grupos e chaveamento editáveis
- escudos/: escudos locais no padrão pais-escudo.svg
- assets/: logos/ícones da Copa 2026

Observação importante:
A página grupos.html está pronta para receber dados oficiais, mas os grupos foram preenchidos de forma demonstrativa com as 48 seleções do projeto, pois não foi possível consultar a URL da FIFA em tempo real neste ambiente. Para atualizar, edite data/grupos.json.


Atualização adicional:
- HTML, CSS e JavaScript mantidos separados.
- A busca foi removida da página de seleções.
- Ordenação disponível por A-Z, títulos, participações e ranking FIFA.
- Bandeiras aplicadas como marca d'água no background dos cards.
- Botão mobile fixo para voltar ao topo.
- Modal do escudo com opção de salvar/baixar.
- Espaços de publicidade preparados para inserção posterior do código Google AdSense.


Atualização offline:
- O site não depende mais da API externa flagsapi.com para bandeiras.
- As bandeiras de fundo usam arquivos locais em flags/.
- As bandeiras quadradas para logos/miniaturas usam arquivos locais em square-flags/.
- O campo bandeiraFundo foi adicionado ao selecoes.json e ao data/grupos.json para os backgrounds dos cards.
- O campo bandeiraQuadrada foi adicionado para uso como logo/miniatura nas tabelas de grupos.
