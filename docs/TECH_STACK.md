# Stack Tecnológica Oficial - Palpitaria da Copa 2026

Este documento cataloga a especificação técnica de ferramentas, dependências e compiladores homologados para execução em produção.

---

## 1. Ambiente de Execução Recomendado

* **Node.js**: Versão `>= 20.10.0` (LTS Recomendada) ou `>= 22.0.0`
* **Gerenciador de Pacotes**: npm (nativo) ou yarn/pnpm (respeitando o `package-lock.json` existente)
* **Compatibilidade de SO**: Multiplataforma (Windows, macOS, Linux)

---

## 2. Core Framework e Bibliotecas Principais

* **React**: Versão `19.2.6` (Utilização de Hooks de estado, referências e efeitos colaterais padrão).
* **React DOM**: Versão `19.2.6`.
* **React Router DOM**: Versão `7.15.1` (Gerenciamento de rotas e históricos do PWA).
* **Vite**: Versão `8.0.12` (Motor de compilação rápida para desenvolvimento local e otimizador de chunks para bundle de produção).
* **Bootstrap**: Versão `5.3.8` (Grid layout, reset CSS de elementos estruturais e formulários de palpites).
* **CSS Customizado**: Vanilla CSS (`index.css`) com tokens visuais unificados para o tema escuro premium da Copa.

---

## 3. Configurações PWA (Progressive Web App)

* **Vite Plugin PWA**: Versão `1.3.0`
* **Modo de Atualização**: `'prompt'` (O usuário recebe uma barra de aviso com botão de recarregar quando novas atualizações de service worker são implantadas).
* **Workbox**: Configurado em modo `generateSW` para pré-cache de todos os arquivos estáticos estáticos (`.js`, `.css`, `.html`, `.svg`, `.png`) e offline fallback via `sw.js`.
* **Cache de Dados Estáticos**: CacheFirst para imagens e StaleWhileRevalidate para arquivos JSON de partidas e seleções.

---

## 4. Scripts e Comandos Disponíveis

* **Execução em Desenvolvimento**:
  ```bash
  npm run dev
  ```
  Inicia o servidor Vite na porta padrão (geralmente `http://localhost:5173`).

* **Compilação de Produção**:
  ```bash
  npm run build
  ```
  Gera o bundle otimizado, limpo e minificado na pasta `/dist`, registrando e empacotando o Service Worker do PWA.

* **Visualização da Compilação de Produção**:
  ```bash
  npm run preview
  ```
  Inicia um servidor web local servindo a pasta `/dist` para testes rápidos pré-implantação.

* **Análise de Código (Linting)**:
  ```bash
  npm run lint
  ```
  Executa validações com ESLint para regras de linting do React e Javascript.
