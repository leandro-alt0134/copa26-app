# Checklist de Lançamento Android (Google Play)

Este guia prático fornece o passo a passo completo para compilar, assinar e distribuir a aplicação **Palpitaria Copa 2026** na Google Play Store.

---

## Passo 1: Sincronização dos Arquivos de Produção

Sempre compile o código frontend mais recente e sincronize-o com o projeto nativo do Android antes de abrir o Android Studio:

```bash
# Compilar e sincronizar os ativos do React/Vite com o diretório android/
npm run sync:android
```

---

## Passo 2: Configuração de Metadados no Android Studio

Abra o projeto Android no Android Studio:
```bash
npm run open:android
```

Dentro do Android Studio, ajuste os seguintes itens:
1. **Nome da Versão e Código (`versionCode` e `versionName`):**
   - Acesse o arquivo `android/app/build.gradle`.
   - Localize o bloco `defaultConfig`.
   - Incremente o `versionCode` (número inteiro comercial, ex: `2`) a cada atualização.
   - Atualize o `versionName` (ex: `"1.0.1"`) correspondente.
2. **Ícones do Aplicativo (App Icons):**
   - Clique com o botão direito na pasta `app` -> `New` -> `Image Asset`.
   - Escolha o tipo de ícone `Launcher Icons (Adaptive and Legacy)`.
   - Carregue o ícone oficial em alta resolução da pasta de assets e configure a cor oficial verde de fundo.

---

## Passo 3: Geração do Keystore e Chave de Assinatura

Se for a primeira vez gerando o aplicativo:
1. No menu superior do Android Studio, acesse **Build > Generate Signed Bundle / APK**.
2. Selecione **Android App Bundle** e clique em **Next**.
3. Em *Key store path*, clique em **Create new...**.
4. Defina o caminho de destino do arquivo `.jks` (guarde-o em local seguro), senhas fortes, codinome da chave (ex: `palpitaria-key`) e o tempo de validade (mínimo recomendado de 25 anos).
5. Preencha os campos organizacionais rápidos e confirme.

> [!CAUTION]
> Nunca comite o arquivo `.jks` no repositório público do Git. Adicione-o ao seu `.gitignore` local para proteção de segurança de propriedade intelectual.

---

## Passo 4: Compilação do Android App Bundle (AAB)

O formato `.aab` é obrigatório para envio à Google Play Store:
1. Acesse **Build > Generate Signed Bundle / APK**.
2. Selecione **Android App Bundle** e clique em **Next**.
3. Selecione a Keystore gerada anteriormente, insira as senhas e a chave correspondente.
4. Escolha a variante de build **`release`**.
5. Clique em **Create** (ou **Finish**).
6. O Android Studio começará a compilar e assinar o pacote. Ao terminar, uma notificação de sistema aparecerá mostrando o link para abrir a pasta do arquivo (geralmente sob `android/app/release/app-release.aab`).

---

## Passo 5: Publicação no Google Play Console

1. **Acesse o Console:**
   - Faça login na conta de desenvolvedor da [Google Play Console](https://play.google.com/console).
2. **Crie ou selecione o App:**
   - Nome: `Palpitaria Copa 2026`
   - Idioma oficial padrão: `Português (Brasil)`
   - Tipo de aplicativo: `App`
   - Categoria: `Gratuito`
3. **Selecione a Faixa de Lançamento:**
   - Para testes rápidos com equipes restritas, use **Teste Interno** (Internal Testing) ou **Teste Fechado** (Closed Beta).
   - Para envio direto à loja, use a faixa **Produção** (Production).
4. **Envie o Bundle:**
   - Crie um novo lançamento e arraste o arquivo `app-release.aab` para a seção de Upload de pacotes.
5. **Declarações Obrigatórias do App:**
   - Insira o link da **Política de Privacidade** gerada na URL de produção do app (ex: `https://palpitaria.com/privacidade`).
   - Responda ao questionário de classificação de conteúdo livre de jogos de azar reais.
6. **Capturas de Tela e Banner:**
   - Envie pelo menos 4 capturas de tela representativas da interface móvel.
   - Envie um banner promocional oficial (`1024x500px`) e o ícone em alta resolução (`512x512px`).
7. **Revisar e Lançar:**
   - Revise se há erros impeditivos de acessibilidade ou build e clique em **Iniciar Rollout** para submeter o aplicativo para análise da equipe do Google.
