# Palpitaria da Copa 2026 (React + Vite + PWA)

Este projeto é uma plataforma de simulação, palpites e guia informativo independente do Mundial de Futebol 2026. A aplicação foi migrada de arquivos HTML estáticos para uma SPA (Single Page Application) moderna em **React 19** e **Vite 6**, totalmente preparada para produção com conformidade jurídica, segurança de APIs e recursos de PWA avançados.

---

## 🚀 Novidades e Blindagem de Produção

Para preparar o PWA para submissão e publicação como aplicativo móvel (ex: Capacitor/Cordova), a aplicação passou por uma rigorosa rodada de otimização de segurança, acessibilidade, privacidade e integridade estrutural:

1. **Branding e Isenção Jurídica**:
   - Todas as menções e termos que sugeriam oficialidade do aplicativo em relação à FIFA ou ao comitê organizador foram removidos.
   - Foram implementados avisos claros de isenção de responsabilidade no rodapé e telas estratégicas.
   - Criadas rotas e páginas obrigatórias de conformidade com a LGPD e políticas das lojas: **Privacidade**, **Termos de Uso**, **Suporte** e **Sobre**.

2. **Blindagem e Isolação de Chaves de API**:
   - A chave privada da API (`VITE_SOCCER_API_KEY`) foi completamente desacoplada do código compilado no navegador.
   - Criou-se um cliente de rede seguro `src/services/footballApiClient.js` que se comunica via proxy utilizando a variável `VITE_PUBLIC_API_BASE_URL` com controle de timeout inteligente de 5 segundos.
   - Implementado fallback offline transparente para garantir o carregamento de dados mockados em caso de falta de conexão.

3. **Armazenamento Versionado e Resiliente (`storageAdapter.js`)**:
   - Centralização e encapsulamento de todas as escritas e leituras do `LocalStorage`.
   - Implementação de um validador de schemas com **controle de versão (1.0.0)** e migrações transparentes de dados antigos.
   - Mecanismos de contenção de erros de cota excedida (QuotaExceededError) e parseamento resiliente de strings JSON corrompidas.

4. **Painel de Configurações do Sistema (`/configuracoes`)**:
   - Diagnóstico em tempo real do status de conexão à internet.
   - Ferramentas de backup: **Exportar palpites em JSON** e **Importar palpites** com validação de chaves.
   - Botão de wipeout seguro (limpar armazenamento e configurações).

5. **Notificação de Atualização PWA Glassmorphism**:
   - O Service Worker foi configurado em modo de notificação (`registerType: 'prompt'`).
   - Um prompt visual elegante (`PwaUpdatePrompt.jsx`) surge notificando o usuário sobre novas atualizações disponíveis com opção de recarga rápida e segura.

6. **Fontes 100% Locais para Funcionamento Offline**:
   - Substituição de importações externas do Google Fonts pelo carregamento local do arquivo de fonte **Plus Jakarta Sans** via `@font-face` em `/src/styles/fonts.css` para evitar Cumulative Layout Shift (CLS).

---

## 🛠️ Tecnologias Utilizadas
- **React (v19.2.6)**: Componentes funcionais reativos.
- **Vite (v6.0.12)**: Servidor de desenvolvimento rápido e bundler.
- **React Router Dom (v7.15.1)**: Roteador declarativo para navegação instantânea.
- **Bootstrap (v5.3.8)**: Grid layout e utilitários de espaçamento responsivos.
- **Vite Plugin PWA (v1.3.0)**: Suporte PWA, manifesto configurado e service worker.
- **HTML5 Canvas**: Geração de cards de palpites programáticos e agenda de transmissões pixel-perfect sem overlaps.

---

## 📁 Estrutura do Projeto
- `docs/`: Documentos de arquitetura e conformidade legal.
  - [LEGAL_ASSETS_REVIEW.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/LEGAL_ASSETS_REVIEW.md)
  - [PRIVACY_DATA_MAP.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/PRIVACY_DATA_MAP.md)
  - [TECH_STACK.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/TECH_STACK.md)
  - [FONTS.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/FONTS.md)
  - [DATA_UPDATE_PROCESS.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/DATA_UPDATE_PROCESS.md)
  - [RELEASE_PROCESS.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/RELEASE_PROCESS.md)
  - [CAPACITOR.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/CAPACITOR.md)
  - [ANDROID_RELEASE_CHECKLIST.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/ANDROID_RELEASE_CHECKLIST.md)
  - [IOS_RELEASE_CHECKLIST.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/IOS_RELEASE_CHECKLIST.md)
- `src/`: Código fonte.
  - `components/`: UI (Navbar, Footer, ErrorBoundary, PwaUpdatePrompt).
  - `pages/`: Telas principais (Teams, Groups, Matches, Predictions, TvSchedule, Settings, Privacy, Terms, Support, About, NotFound).
  - `services/`: Lógicas de storage (`storageAdapter.js`) e API (`footballApiClient.js`).
  - `styles/`: Fontes e CSS específicos.

---

## ⚙️ Variáveis de Ambiente (.env)

Copie o arquivo de exemplo correspondente ao seu ambiente e configure a URL do seu proxy de futebol:
```bash
cp .env.example .env.local
```
Edite `.env.local` definindo:
```env
VITE_PUBLIC_API_BASE_URL=https://api-proxy.seudominio.com
```

---

## 💻 Executando o Projeto

### Instalação de dependências:
```bash
npm install
```

### Rodar servidor local de desenvolvimento:
```bash
npm run dev
```

### Compilar para Produção (PWA pronto):
```bash
npm run build
```

### Rodar Preview Local do Build:
```bash
npm run preview
```

### 📱 Comandos para Builds e Testes Nativos (Capacitor)

Certifique-se de compilar o aplicativo antes de sincronizar as plataformas nativas:

```bash
# Compilar e sincronizar ativos do React/Vite com Android e iOS
npm run sync:native

# Sincronizar especificamente o Android
npm run sync:android

# Sincronizar especificamente o iOS (requer macOS)
npm run sync:ios

# Abrir o Android Studio para depuração e compilação do APK/AAB
npm run open:android

# Abrir o Xcode (requer macOS) para depuração e compilação IPA
npm run open:ios
```

