# Integração do Capacitor e Recursos Nativos

Este documento detalha a arquitetura híbrida estabelecida na **Palpitaria Copa 2026** para compilar a aplicação React/Vite/PWA como aplicativos nativos para as plataformas **Android** e **iOS** usando o **Capacitor v6**.

---

## 1. Arquitetura Híbrida

A aplicação foi desenhada de forma híbrida e unificada:
- **Web / PWA:** Roda diretamente em navegadores convencionais com suporte completo a Service Worker offline, cacheamento progressivo e botão de instalação do PWA.
- **Nativo (Android & iOS):** O Capacitor envelopa os ativos estáticos compilados (pasta `dist/`) dentro de uma WebView nativa de alto desempenho.

A detecção de ambiente é feita de forma dinâmica através do serviço [platformService.js](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/services/platformService.js) usando APIs do core do Capacitor, assegurando que recursos exclusivos para Web ou para Nativo sejam executados condicionalmente sem estragar a experiência de outras plataformas.

---

## 2. Plugins Nativos Utilizados

Foram adicionados plugins oficiais do Capacitor para integrar o app com APIs do sistema operacional:

1. **`@capacitor/status-bar`:** Usado para estilizar dinamicamente a barra de status com a cor oficial de fundo escura do app (`#061A12`) e ícones claros.
2. **`@capacitor/splash-screen`:** Controla o tempo de exibição da splash screen. Ocultado programaticamente em [App.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/App.jsx) assim que o React termina de renderizar a interface para evitar flashes visuais em branco.
3. **`@capacitor/share`:** Dispara a folha de compartilhamento nativa do sistema operacional (Android Share Sheet / iOS Share Sheet) ao invés do link direto de WhatsApp da Web.
4. **`@capacitor/haptics`:** Fornece respostas táteis físicas reais (vibrações leves, médias, de sucesso, erro e alerta) nos palpites e simulações.
5. **`@capacitor/app`:** Monitora eventos de ciclo de vida do app e escuta o botão voltar físico no Android.
6. **`@capacitor/browser`:** Abre links externos (termos, suporte, privacidade) em um navegador interno do sistema seguro (In-App Browser/Custom Tabs) sem tirar o usuário do aplicativo principal.

---

## 3. Decisão Arquitetural: Bypass do Service Worker

> [!IMPORTANT]
> Em plataformas nativas, o Service Worker do PWA foi completamente desabilitado.

**Por que tomamos essa decisão?**
1. **Colisão de Cache:** O Capacitor já possui um sistema nativo de empacotamento local que serve todos os arquivos `.js`, `.css` e `.html` diretamente do disco local (esquema `http://localhost` ou `capacitor://`). Registrar um Service Worker dentro dessa WebView geraria caches redundantes de rede que costumam quebrar após atualizações do app ou causar falhas de CORS ao requisitar dados locais.
2. **Crash em Atualizações:** Prompts de atualização automática do PWA na WebView nativa podem fazer com que a página recarregue incorretamente e tente buscar arquivos de URLs inválidas.

**Como foi implementado:**
- O botão de instalação do PWA (`InstallPwaButton`) detecta o ambiente nativo e renderiza `null`.
- O prompt de nova versão (`PwaUpdatePrompt`) é omitido condicionalmente no [App.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/App.jsx), evitando o registro do Service Worker progressivo nas plataformas nativas.

---

## 4. Comandos de Desenvolvimento e Sincronização

Os seguintes scripts de compilação e sincronização rápida foram definidos no `package.json`:

```bash
# Compilar o React para produção e sincronizar alterações para Android e iOS
npm run sync:native

# Compilar o React para produção e sincronizar especificamente para o Android
npm run sync:android

# Compilar o React para produção e sincronizar especificamente para o iOS
npm run sync:ios

# Abrir o projeto Android no Android Studio para depuração e compilação
npm run open:android

# Abrir o projeto iOS no Xcode para depuração e compilação
npm run open:ios
```
