# Mapeamento de Dados e Conformidade LGPD

Este documento descreve como a aplicação coleta, armazena, gerencia e exclui as informações dos usuários, servindo como base técnica para a conformidade com a LGPD (Lei Geral de Proteção de Dados).

---

## 1. Princípio do Armazenamento Zero Server (Client-Side)

O aplicativo **Palpitaria da Copa 2026** funciona sob a premissa de armazenamento 100% descentralizado e do lado do cliente. Não possuímos bancos de dados centrais ou servidores remotos que armazenem cadastros, palpites exatos de partidas ou tabelas de simulações.

---

## 2. Inventário de Dados e Chaves no LocalStorage

Todas as informações são gravadas localmente no navegador por meio de chaves exclusivas.

| Chave de Armazenamento | Propósito | Estrutura dos Dados / Tipo | Exemplo de Conteúdo |
| :--- | :--- | :--- | :--- |
| `copa2026_palpites` | Armazena palpites avulsos/rápidos gerados pelo usuário. | Array de Objetos JSON | `[{ "matchId": "...", "selecaoA": "Brasil", "placar": { "selecaoA": 2, "selecaoB": 1 }, "palpiteFinal": "Brasil", "perfilPalpiteiro": "..." }]` |
| `copa2026_minha_copa` | Armazena o estado completo do simulador de chaveamento. | Objeto JSON complexo | `{ "status": "in_progress", "currentStep": "groups", "groupPredictions": { ... }, "knockout": { ... } }` |
| `copa2026_partidas_atualizadas` | Cache local de resultados de jogos obtidos da API externa. | Array de Objetos JSON | `[{ "id": "...", "selecaoA": "Alemanha", "golsRealA": 2, "golsRealB": 0, "encerrada": true }]` |
| `copa2026_privacy_consent` | Armazena a decisão e opções de cookies do usuário (LGPD). | Objeto JSON simples | `{ "decisionMade": true, "adsEnabled": true, "personalizedAds": true }` |
| `copa2026_ad_action_count` | Controle de quantidade de ações relevantes feitas pelo usuário. | Número simples | `3` |
| `copa2026_ad_last_shown_time` | Registro de timestamp da última exibição de intersticial nativo. | Número de milissegundos | `1718147986000` |
| `copa2026_version` | Controle de versionamento do banco local para migrações. | String simples | `"1.0.0"` |

---

## 3. Fluxo de Dados e APIs de Terceiros

1. **API do Proxy de Futebol** (`VITE_PUBLIC_API_BASE_URL`):
   * **Fluxo**: Frontend ➔ Servidor Proxy ➔ API Externa.
   * **Dados enviados**: Nenhum dado identificável do usuário. Apenas requisições informativas de partidas (League, Season).
   * **Retorno**: Placar atualizado dos jogos terminados.

2. **Rede de Publicidade (Google AdSense/outros)**:
   * **Mapeamento**: Cookies do navegador podem ser definidos para personalizar anúncios publicitários com base nas preferências do usuário. O app disponibiliza um link permanente nas configurações para desativação destas políticas.

---

## 4. Direitos dos Usuários e Gerenciamento

O PWA fornece ferramentas diretas para que o usuário exerça seus direitos garantidos pela LGPD de acesso, retificação, exclusão e portabilidade:

* **Portabilidade (Acesso)**: O usuário pode exportar um dump de todos os seus dados locais em formato JSON legível clicando em "Exportar Dados para Backup" nas configurações.
* **Retificação**: Modificar placares ou redefinir palpites diretamente na tela de simulação ou cards.
* **Exclusão total (Esquecimento)**: Apagar todos os dados permanentemente usando a ferramenta "Limpar Armazenamento Local" nas configurações ou na aba de Suporte.
