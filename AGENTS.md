# AGENTS.md - Contexto de Desenvolvimento e UI/UX

Este arquivo serve como guia de contexto e restrições para o desenvolvimento do **Guia da Copa do Mundo 2026**. Ele dita os padrões arquiteturais, regras de design system e fluxos de UX que devem ser respeitados em qualquer refatoração ou criação de código.

---

## 1. Stack Tecnológica Base
* **Core:** React 19 (v19.2.6) - Hooks nativos (`useState`, `useEffect`, `useRef`).
* **Build & Router:** Vite 6 (v6.0.12) e React Router DOM 7 (v7.15.1).
* **UI:** Bootstrap 5 (v5.3.8) para grid/utilitários + Vanilla CSS (`index.css`) customizado.
* **PWA:** Vite Plugin PWA (v1.3.0) + LocalStorage para persistência.

---

## 2. Diretrizes de Design System & CSS (`index.css`)
Qualquer alteração visual ou novos componentes devem herdar a identidade visual premium estabelecida:

* **Paleta de Cores & Ambiente:** * Fundo escuro imersivo: `#061A12` e `#08291D`.
  * Cor primária vibrante (Verde Oficial): `--primary: #00C853`.
  * Efeitos de iluminação: Gradientes radiais nos cantos simulando refletores de estádio.
  * Tipografia oficial: **Plus Jakarta Sans**.
* **Glassmorphism:** Painéis, modais e cards devem usar fundos semitransparentes (`rgba(4, 62, 39, .86)`) combinados com `backdrop-filter: blur(14px)`.
* **Texturas Visuais:** Cards de seleções devem exibir a bandeira oficial do país centralizada ao fundo com opacidade muito baixa (`opacity: .16`).
* **Micro-animações:** Efeitos de elevação suave ao passar o mouse (`transform: translateY(-5px)`) com transição suave.
* **Foco & Seleção:** Inputs e botões ativos ganham contornos/bordas neon vibrantes em tons de dourado ou ciano.

---

## 3. Padrões de UX e Regras de Negócio (Mobile-First)

### A. Responsividade e Navegação
* **Mobile-First:** Em telas menores que 768px, a barra de navegação superior (`Navbar.jsx`) deve ser substituída ergonomicamente pelas abas inferiores fixas (`MobileBottomNav.jsx`).
* **Área de Toque:** Elementos clicáveis no mobile devem respeitar a área mínima de hitboxes de **48x48px**.

### B. Consistência Visual de Dados
* **Identificação Visual:** Tabelas de classificação, chaves de mata-mata e comparadores devem sempre exibir as bandeiras quadradas (`square-flags`) ou escudos ao lado do nome da seleção para facilitar o escaneamento visual rápido.

### C. Resiliência de Estado no Simulador ("Minha Copa")
* **Alerta de Invalidação:** Caso o usuário altere retroativamente o placar de um jogo da Fase de Grupos após já ter avançado no fluxo (Mata-mata), o sistema **deve disparar um modal de alerta claro** informando que a alteração reiniciará o chaveamento subsequente para evitar dados fantasmas ("TBD").
* **Persistência:** Todo o progresso de simulação e palpites avulsos deve persistir automaticamente no `LocalStorage` através dos helpers criados na pasta `utils/` (ex: `myCupStorage.js`), evitando perda de dados por recarregamento acidental.

---

## 4. Comandos de Engenharia
```bash
# Instalação
npm install

# Desenvolvimento local
npm run dev

# Build de produção (PWA)
npm run build