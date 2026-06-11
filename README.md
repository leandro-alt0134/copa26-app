# Guia da Copa do Mundo 2026 (React + Vite)

Este projeto é uma versão modernizada do site demonstrativo da Copa do Mundo 2026, convertida de HTML/CSS/JS estático para uma aplicação web SPA (Single Page Application) moderna em **React** construída sobre o **Vite**.

## Tecnologias Utilizadas
- **React (v19)**: Criação de interfaces baseadas em componentes funcionais e reatividade baseada em estados (`useState`, `useEffect`).
- **Vite (v6)**: Ferramenta de build ultra-rápida e Hot Module Replacement (HMR).
- **React Router Dom (v7)**: Sistema de roteamento dinâmico para navegação instantânea.
- **Bootstrap (v5)**: Estilização responsiva e componentes auxiliares.
- **HTML5 Canvas**: Geração dinâmica de cards de palpites em imagem PNG no lado do cliente.

---

## Estrutura do Projeto
O projeto está organizado da seguinte forma:

- `/public`: Contém os assets estáticos que continuam com referências estáticas intactas:
  - `assets/`: Imagens de fundo, logos e ilustrações da Copa 2026.
  - `data/`: Arquivos JSON de dados (`selecoes.json`, `partidas.json`, `grupos.json`).
  - `escudos/`: Escudos oficiais de cada país em SVG.
  - `flags/`: Bandeiras oficiais para o fundo dos cards.
  - `square-flags/`: Bandeiras em proporção quadrada para as tabelas e comparadores.
- `/src`: Código-fonte da aplicação React:
  - `components/`: Componentes globais e reutilizáveis:
    - `Navbar.jsx`: Menu com indicador de rota ativa.
    - `Footer.jsx`: Rodapé com textos dinâmicos de acordo com a rota ativa.
    - `Countdown.jsx`: Relógio de contagem regressiva em tempo real para a abertura.
    - `BackToTop.jsx`: Botão flutuante para subir a tela em dispositivos móveis.
  - `pages/`: Páginas que compõem cada rota da aplicação:
    - `Teams.jsx`: Guia visual de seleções com busca avançada, filtros confederativos, ordenação múltipla, modal de ampliação de escudos e comparador estatístico de 2 times com barras de progresso.
    - `Groups.jsx`: Tabelas de pontuação por grupo, chaveamento eliminatório (de 16-avos a final) com carrossel dinâmico e guia informativo de estádios.
    - `Matches.jsx`: Agenda de confrontos com filtragem por grupo e rodada, com direcionamento para palpites.
    - `Predictions.jsx`: Calculadora de palpites contendo quiz de 5 perguntas, formulário de placar final, salvamento em `localStorage`, exportação em imagem PNG gerada via Canvas, download em arquivo TXT e compartilhamento direto no WhatsApp.
  - `App.jsx`: Configuração central das rotas (`BrowserRouter`).
  - `index.css`: Folha de estilo CSS global com tokens `:root` e estilos comuns.
  - `main.jsx`: Ponto de entrada que carrega os estilos globais e monta a árvore React.
- `_backup_old_static/`: Cópia de segurança dos arquivos estáticos originais pré-migração.

---

## Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em sua máquina local:

### 1. Instalar as Dependências
Abra o terminal no diretório do projeto e execute:
```bash
npm install
```

### 2. Rodar em Ambiente de Desenvolvimento (com Hot Reload)
Para iniciar o servidor local com recarregamento instantâneo na edição do código:
```bash
npm run dev
```
O console exibirá o endereço local (geralmente `http://localhost:5173`). Abra esta URL no seu navegador.

### 3. Compilar para Produção (Build)
Para gerar os arquivos otimizados e minificados para deploy na pasta `/dist`:
```bash
npm run build
```

### 4. Visualizar a Versão de Produção Localmente (Preview)
Após gerar a build, você pode simular a execução de produção localmente rodando:
```bash
npm run preview
```

### 5. Resolução de Caching e PWA (Limpeza do Service Worker)

Como o projeto utiliza o `vite-plugin-pwa` para suporte a PWA Offline, os arquivos de estilo e scripts são mantidos sob cache agressivo do navegador. Se você realizar uma compilação de produção (`npm run build`) e, ao rodar o preview (`npm run preview`), o layout parecer desalinhado ou com contrastes antigos, siga os passos abaixo para limpar o cache:

1. **Abra o DevTools** no navegador (pressione `F12` ou clique com o botão direito e selecione *Inspecionar*).
2. Vá até a aba **Application** (ou *Aplicativo*).
3. No painel esquerdo, navegue até **Service Workers**.
4. Clique em **Unregister** (ou *Desativar/Remover registro*) correspondente ao service worker da porta local.
5. Em seguida, acesse **Storage** (ou *Armazenamento*) e clique em **Clear site data** (ou *Limpar dados do site*).
6. Force um recarregamento completo da página usando **Ctrl + F5** (ou **Cmd + Shift + R** no macOS).

Isso garantirá que o preview e testes locais de produção utilizem os arquivos atuais da pasta `/dist`.
