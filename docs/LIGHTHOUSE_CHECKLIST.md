# Auditoria Lighthouse & Diretrizes de Qualidade PWA

Este checklist define os padrões técnicos mínimos para aprovação nas auditorias de Performance, PWA, Acessibilidade e SEO do Google Lighthouse.

---

## 1. Diretrizes de PWA (Progressive Web App)

- [ ] **Manifesto Válido**: O manifesto deve conter metadados e ícones adequados (`manifest.webmanifest`).
- [ ] **Tema e Cores**: `theme_color` e `background_color` correspondentes a `#061A12` em `index.html` e no manifesto.
- [ ] **Service Worker Registrado**: Registro do `sw.js` via Vite PWA Plugin com estratégia prompt de atualização.
- [ ] **Fallback Offline**: Garantir que as rotas e assets estáticos essenciais abram offline por meio do cache do Workbox.
- [ ] **Instalabilidade**: O prompt de instalação (`InstallPwaButton`) deve aparecer de forma ergonômica em navegadores suportados.

---

## 2. Acessibilidade (A11y) e Usabilidade Mobile

- [ ] **Área Mínima de Toque (Hitboxes)**: Todos os elementos clicáveis (botões de palpites, links de abas, inputs de placares) devem ter dimensões mínimas de **48x48px**.
- [ ] **Contraste de Cores**: Textos claros (`#F8FAFC`) contra fundos escuros (`#061A12`) mantendo conformidade com a diretiva WCAG AA de contraste (mínimo de 4.5:1).
- [ ] **Leitura por Leitores de Tela**: Presença de atributos `aria-label` e `role` em botões de ações importantes (como fechar anúncios e apagar dados).
- [ ] **Estrutura de Cabeçalhos**: Um único elemento `<h1>` por página, com hierarquia lógica de subtítulos (`<h2>`, `<h3>`).

---

## 3. Otimização de Performance

- [ ] **Layout Shift Mínimo (CLS)**: Carregamento local das fontes Plus Jakarta Sans e reserva de espaços de layouts em blocos de anúncios para evitar saltos na renderização.
- [ ] **Imagens e SVGs Otimizados**: Todas as bandeiras no formato SVG comprimido ou imagens WebP.
- [ ] **Código Dividido (Code Splitting)**: Carregamento dinâmico de componentes grandes no bundle compilation do Vite.
