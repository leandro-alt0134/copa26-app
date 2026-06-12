# Guia de Segurança de Dados do Google Play (Data Safety)

Este documento fornece as diretrizes exatas para preenchimento do formulário **Segurança de Dados** (Data Safety) no Google Play Console para o aplicativo **Palpitaria da Copa 2026**.

---

## 1. Mapeamento de Coleta e Compartilhamento de Dados

Devido à integração com o **Google AdMob** no Android para veicular anúncios, o aplicativo coleta e compartilha determinados dados agregados. Nenhuma informação pessoal ou de simulação de palpites é enviada para servidores externos do nosso lado.

Preencha as seções no Play Console conforme as seguintes definições:

### A. Coleta e Compartilhamento Geral
1. **O app coleta ou compartilha algum dos tipos de dados de usuário obrigatórios?**
   * Selecione: **Sim**.
2. **Todos os dados coletados pelo app são criptografados em trânsito?**
   * Selecione: **Sim** (Toda a transmissão de requisições de anúncios do AdMob é feita sobre protocolo HTTPS seguro).
3. **O app oferece um método para os usuários solicitarem a exclusão dos dados?**
   * Selecione: **Sim** (Os usuários podem excluir todos os dados salvos localmente e revogar consentimento diretamente nas telas `/configuracoes` e `/privacidade-config`).

### B. Especificação por Tipo de Dados

#### Identificadores do Dispositivo ou Outros
* **Coletado?** Sim.
* **Compartilhado?** Sim (via SDK do Google AdMob).
* **Processado de forma efêmera?** Não.
* **Os dados são necessários para o aplicativo ou o usuário pode escolher como eles são tratados?**
   * Selecione: **A coleta é opcional** (O usuário pode aceitar ou recusar através do banner de consentimento exibido ao inicializar o app).
* **Finalidade:**
   * Selecione: **Publicidade ou marketing do desenvolvedor** (Developer Advertising or Marketing).

---

## 2. SDKs de Terceiros e APIs Utilizadas

* **Google Mobile Ads SDK (AdMob)**:
  * Coleta identificadores publicitários (como o Advertising ID do Google Play Services), interações de anúncios e dados de desempenho do app para fins de anúncios personalizados e prevenção a fraudes.
* **API de Futebol Externa**:
  * Realiza consultas via HTTPS para o proxy seguro `VITE_PUBLIC_API_BASE_URL` para carregar placares em tempo real. Não envia cabeçalhos identificáveis, cookies ou dados do aparelho do usuário.

---

## 3. Público-Alvo e Classificação Etária

* **Público-Alvo**: Maiores de 13 anos.
* **Categoria do Aplicativo**: Esportes / Recreação.
* **Anúncios**: O formulário de declaração de anúncios do Google Play deve marcar a opção **"Sim, meu app contém anúncios"**.
* **Prevenção a Jogos de Azar**: Este app é categorizado apenas como simulador de entretenimento, sem envolver apostas financeiras. Isso deve estar claro na classificação de conteúdo (IARC) para evitar rejeições.
