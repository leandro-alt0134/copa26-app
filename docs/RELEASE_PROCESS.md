# Processo de Publicação e Release (Release Process)

Este documento descreve as diretrizes para preparar, testar, empacotar e publicar atualizações no aplicativo **Palpitaria da Copa 2026**.

---

## 1. Fluxo de Validação Local (Pré-Requisitos)

Antes de gerar qualquer build para distribuição comercial, execute a pipeline local de validação de código:

1. **Validação de Sintaxe e Erros (Linter)**:
   ```bash
   npm run lint
   ```
   *Qualquer erro retornado pelo ESLint deve ser tratado antes de prosseguir.*

2. **Geração do Build de Produção**:
   ```bash
   npm run build
   ```
   *Verifique se os chunks do bundle foram gerados na pasta `/dist/` sem estouro de tamanho ou falhas de importação de CSS.*

3. **Validação de Preview Local**:
   ```bash
   npm run preview
   ```
   *Abra o endereço gerado (normalmente `http://localhost:4173/`) e teste a navegação geral simulando dispositivos móveis no console de desenvolvedor.*

---

## 2. PWA e Estratégia de Atualização do Service Worker

O aplicativo está configurado com o `vite-plugin-pwa` em modo manual (`registerType: 'prompt'`). Isso significa que quando uma nova versão do Service Worker for disponibilizada no servidor:

1. O navegador faz o download e compila o novo script em background.
2. O evento `needRefresh` é disparado.
3. O componente `PwaUpdatePrompt.jsx` intercepta o estado e renderiza um modal flutuante com design Glassmorphism avisando o usuário: **"Nova versão disponível! Deseja atualizar agora para garantir o funcionamento offline?"**.
4. Ao clicar em **"Atualizar agora"**, o Service Worker ativa as chaves `skipWaiting` e força o reload automático da página para injetar o novo bundle no cache do navegador.

---

## 3. Gestão de Ambientes (.env)

As variáveis de ambiente devem ser devidamente isoladas em seus perfis específicos antes da publicação.

* **Desenvolvimento Local (`.env.development`)**:
  Consome APIs e proxies locais sem bloqueios restritivos de requisição.
* **Homologação/Staging (`.env.staging`)**:
  Utiliza chaves mockadas e servidores de testes dedicados.
* **Produção (`.env.production`)**:
  Aponta `VITE_PUBLIC_API_BASE_URL` para o endpoint proxy final de produção seguro (SSL obrigatório).

---

## 4. Deploy Final (Produção)

O app está configurado com regras de redirecionamento para Vercel e outros servidores estáticos:
* **Vercel**: O arquivo `vercel.json` garante o fallback de rotas SPA para que links diretos como `/agenda` ou `/configuracoes` funcionem diretamente no servidor sem retornar erros 404 de página não encontrada.
* **Netlify/Outros**: O arquivo `/public/_redirects` realiza o mesmo mapeamento (`/* /index.html 200`) para serviços estáticos similares.

**Importante**: Após finalizar o deploy em ambiente de produção, acione o Lighthouse no Chrome DevTools para validar se os critérios de PWA (Instalabilidade, Registro de Service Worker, Máscaras de Ícones e Operação Offline com `offline.html`) estão com pontuações plenas (verifique `docs/LIGHTHOUSE_CHECKLIST.md`).

---

## 5. Compilação e Distribuição do Aplicativo Nativo (Capacitor)

Para empacotar a aplicação nos contêineres nativos da Google Play Store (Android) e App Store (iOS), execute:

### A. Preparação e Sincronização dos Ativos Web:
```bash
# Executa a compilação web e atualiza os arquivos nos projetos nativos android e ios
npm run sync:native
```

### B. Distribuição Android (Google Play Store):
1. Abra o projeto Android no Android Studio:
   ```bash
   npm run open:android
   ```
2. No menu superior, vá em **Build ➔ Generate Signed Bundle / APK...**.
3. Selecione **Android App Bundle (.aab)** (formato obrigatório para novos apps).
4. Insira as credenciais do seu keystore de assinatura de produção da Mongrel Tech Solutions.
5. Selecione a variante de build `release` e clique em **Create**.
6. Suba o arquivo `.aab` gerado em `android/app/release/app-release.aab` no painel do Google Play Console.

### C. Distribuição iOS (Apple App Store):
1. Abra o projeto iOS no Xcode (necessário macOS):
   ```bash
   npm run open:ios
   ```
2. Configure a assinatura do aplicativo (Signing & Capabilities) selecionando o seu Team de Desenvolvedor e Bundle Identifier (`com.palpitaria.copa26`).
3. Certifique-se de que o manifesto `PrivacyInfo.xcprivacy` está listado na fase de build do Target do app.
4. Mude o dispositivo de teste para **Any iOS Device (arm64)**.
5. No menu superior do Xcode, selecione **Product ➔ Archive**.
6. Concluído o archive, utilize a ferramenta **Distribute App** para fazer o upload do build (formato `.ipa` compilado) diretamente para o TestFlight e App Store Connect.

