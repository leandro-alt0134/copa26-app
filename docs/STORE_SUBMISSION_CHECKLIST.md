# Checklist de Submissão para as Lojas (Google Play e App Store)

Esta tabela deve ser usada como controle de homologação final antes de submeter novos builds para revisão comercial nas lojas.

| Item | Status | Responsável | Observação / Referência | Arquivo / Link |
| :--- | :---: | :---: | :--- | :--- |
| **Isenção de Oficialidade** | ✅ Concluído | Desenvolvedor | Sem logotipos oficiais da FIFA ou termos enganosos de afiliação. | [Footer.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/components/Footer.jsx) |
| **Assets Gráficos Revisados** | ✅ Concluído | Designer | Ícones do app, splash screens e logotipos limpos e sem placeholders. | `/public/pwa/` e `/android/app/src/main/res/` |
| **Política de Privacidade** | ✅ Concluído | Jurídico / Dev | Publicada publicamente e integrada dentro do app. | [Privacy.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/pages/Privacy.jsx) |
| **Termos de Uso Recreativo** | ✅ Concluído | Jurídico / Dev | Deixa explícito a inexistência de apostas com dinheiro real ou prêmios. | [Terms.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/pages/Terms.jsx) |
| **Suporte ao Usuário** | ✅ Concluído | Suporte | Página com canal de contato de suporte ativo e funcional. | [Support.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/pages/Support.jsx) |
| **Sem Placeholders Visíveis** | ✅ Concluído | QA / Dev | Substituição de marcadores de texto por dados reais da Mongrel Tech. | [Privacy.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/pages/Privacy.jsx) |
| **Android App Bundle (.aab)** | 📋 Pendente | DevOps | Gerar o arquivo `.aab` assinado no Android Studio para produção. | [RELEASE_PROCESS.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/RELEASE_PROCESS.md) |
| **Target SDK Android (v34+)** | ✅ Concluído | Dev | Validado nível de API direcionado atendendo regras da Play Store. | [build.gradle](file:///c:/Projetos/Copa%202026/copa26-app_v1/android/app/build.gradle) |
| **Play App Signing** | 📋 Pendente | Publicador | Configurar chave de assinatura de apps da Google Play no console. | Play Console ➔ Assinatura de Apps |
| **Data Safety Preenchível** | ✅ Concluído | Dev | Respostas estruturadas mapeadas para o formulário. | [GOOGLE_PLAY_DATA_SAFETY.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/GOOGLE_PLAY_DATA_SAFETY.md) |
| **iOS Validado no Xcode** | 📋 Pendente | Dev macOS | Realizar compilação e teste final no emulador e dispositivo físico. | `npx cap open ios` |
| **Privacy Manifest (iOS)** | ✅ Concluído | Dev | Manifesto estruturado mapeando IDs de rastreamento e APIsUserDefaults. | [APPLE_PRIVACY.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/APPLE_PRIVACY.md) |
| **App Privacy (App Store)** | ✅ Concluído | Dev | Declarações do Nutrition Label prontas para o formulário do connect. | [APPLE_PRIVACY.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/APPLE_PRIVACY.md) |
| **TestFlight Preparado** | 📋 Pendente | DevOps | Criar grupo de testes internos e externos na App Store Connect. | App Store Connect ➔ TestFlight |
| **AdMob Nativo Instalado** | ✅ Concluído | Dev | Plugin instalado e configurado de forma resiliente por plataforma. | [adMobService.js](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/services/adMobService.js) |
| **AdSense Restrito à Web** | ✅ Concluído | Dev | Script AdSense isolado para navegadores/PWA, sem rodar em Capacitor. | [AdPlacement.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/components/ads/AdPlacement.jsx) |
| **Banner com Margem de Segurança**| ✅ Concluído | Dev / QA | Banner nativo posicionado com margem (60px) sobre o BottomNav. | [adMobService.js](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/services/adMobService.js) |
| **Consentimento de Cookies** | ✅ Concluído | Dev | Fluxo de aceitação granulada funcional no PWA e no App Nativo. | [ConsentBanner.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/components/privacy/ConsentBanner.jsx) |
| **Navegação Móvel Consistente** | ✅ Concluído | Dev / UI | Mobile-first respeitado, BottomNav fixo sem quebra de hits de toque. | [MobileBottomNav.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/components/MobileBottomNav.jsx) |
| **Resiliência Offline / Loading** | ✅ Concluído | Dev | Banners e chamadas externas falham de forma segura sem travar o app. | [OfflineBanner.jsx](file:///c:/Projetos/Copa%202026/copa26-app_v1/src/components/OfflineBanner.jsx) |
| **Versão Semântica 1.0.0** | ✅ Concluído | Dev | Versionamento alinhado para lançamento de produção. | [package.json](file:///c:/Projetos/Copa%202026/copa26-app_v1/package.json) |
| **Screenshots de Loja** | 📋 Pendente | Design | Mockups do simulador para resoluções de iPhone, iPad e telas Android. | `docs/STORE_LISTING_DRAFT.md` |
| **Descrições Curtas / Longas** | ✅ Concluído | Marketing | Textos promocionais revisados sem uso indevido de direitos autorais. | [STORE_LISTING_DRAFT.md](file:///c:/Projetos/Copa%202026/copa26-app_v1/docs/STORE_LISTING_DRAFT.md) |
