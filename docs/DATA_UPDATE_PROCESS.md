# Processo de Atualização de Dados (Data Update Process)

Este documento orienta os desenvolvedores e mantenedores do aplicativo **Palpitaria da Copa 2026** sobre como atualizar os dados estáticos do torneio, configurações de seleções, chaves de grupos e canais de transmissão.

---

## 1. Arquivos de Dados Estáticos (`/public/data/`)

Os dados do aplicativo são centralizados em arquivos JSON dentro da pasta pública. Quaisquer modificações estruturais ou de valores devem ser efetuadas diretamente nestes arquivos:

### A. Seleções (`/public/data/selecoes.json`)
* **Propósito**: Contém a lista de todas as 48 seleções participantes da Copa do Mundo 2026.
* **Estrutura**:
  ```json
  {
    "copa_2026": [
      {
        "id": "mexico",
        "nome": "México",
        "grupo": "A",
        "codigo": "MX",
        "escudo": "escudos/mexico-escudo.svg",
        "bandeira": "square-flags/mexico.svg"
      }
    ]
  }
  ```
* **Regras para Atualização**:
  - Garanta que o campo `codigo` esteja em formato de sigla ISO 3166-1 alpha-2 ou código de bandeira compatível, utilizado para gerar os fallbacks de emoji via `codigoParaEmojiBandeira`.
  - Certifique-se de que os assets de imagens (`escudo` e `bandeira`) existam dentro de `/public/escudos/` e `/public/square-flags/` respetivamente.

### B. Partidas (`/public/data/partidas.json`)
* **Propósito**: Define todos os confrontos da Fase de Grupos, contendo data, horário oficial de Brasília (BRT), estádio, cidade sede e caminhos de assets.
* **Estrutura**:
  ```json
  [
    {
      "id": "grupo-a-rodada-1-mexico-africa-do-sul",
      "grupo": "A",
      "rodada": 1,
      "selecaoA": "México",
      "selecaoB": "África do Sul",
      "escudoA": "escudos/mexico-escudo.svg",
      "escudoB": "escudos/africa-do-sul-escudo.svg",
      "bandeiraA": "square-flags/mexico.svg",
      "bandeiraB": "square-flags/africa-do-sul.svg",
      "data": "2026-06-11",
      "horario": "16:00",
      "estadio": "Estadio Azteca",
      "cidade": "Cidade do México",
      "pais": "México"
    }
  ]
  ```
* **Regras para Atualização**:
  - O formato do campo `data` deve ser obrigatoriamente `AAAA-MM-DD` para compatibilidade com o analisador de datas local (`formatarDataAgenda`).
  - O campo `horario` deve ser expressado em formato `HH:MM` oficial (BRT).

---

## 2. Lógica de Canais de Transmissão (`TvSchedule.jsx`)

Atualmente, o mapeamento dos canais de transmissão para a agenda de bolso é realizado de forma programática com base na chave de grupo da partida no arquivo `src/pages/TvSchedule.jsx`. 

Para alterar as regras de exibição das emissoras parceiras:
1. Abra [TvSchedule.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/pages/TvSchedule.jsx).
2. Localize a função `obterCanaisTransmissao`:
   ```javascript
   const obterCanaisTransmissao = (grupo) => {
     const canaisComuns = ['Cazé TV'];
     if (['A', 'C', 'D', 'F', 'I', 'J', 'L'].includes(grupo)) {
       return [...canaisComuns, 'GE / Sportv', 'SBT'];
     }
     return canaisComuns;
   };
   ```
3. Ajuste os arrays de retorno ou adicione condições específicas por rodada, ID da partida ou grupo de chaves conforme acordos comerciais de transmissão.

---

## 3. Sincronização Dinâmica com API de Resultados (Background Sync)

O aplicativo tenta buscar resultados atualizados da API em segundo plano sempre que o usuário acessa as rotas de palpites e confrontos:
1. Executa a requisição pelo cliente `src/services/footballApiClient.js` consumindo o proxy configurado em `VITE_PUBLIC_API_BASE_URL`.
2. Se a chamada for bem-sucedida, as partidas locais no dispositivo do usuário são marcadas como `encerradas: true` e recebem as chaves `golsRealA` e `golsRealB` correspondentes.
3. Essas atualizações são persistidas no `LocalStorage` sob a chave `copa2026_partidas_atualizadas` utilizando o `storageAdapter.js`.

Se o cache precisar ser forçado a se invalidar para todos os usuários (por exemplo, após correção de digitação nos arquivos JSON estáticos), a versão de migração em `src/services/storage/storageMigrations.js` deve ser incrementada (ex: `1.0.1`), forçando a limpeza automática de estruturas obsoletas.
