# Checklist de Lançamento iOS (App Store)

Como o ambiente de desenvolvimento local do Capacitor roda em Windows, a compilação final para **iOS** requer o uso de um computador com macOS equipado com o Xcode. Este guia cobre o processo detalhado a ser executado no host macOS para assinar, testar e publicar o app na App Store.

---

## Requisitos Prévios no Host macOS

Antes de começar, certifique-se de que a máquina macOS possui:
1. **Xcode** (instalado via App Store).
2. **Node.js** e **npm** instalados.
3. **CocoaPods** instalado via Terminal:
   ```bash
   sudo gem install cocoapods
   ```
4. Uma conta ativa no **Apple Developer Program**.

---

## Passo 1: Sincronização dos Arquivos de Produção

No host macOS, baixe os arquivos mais recentes do repositório Git do projeto e execute a compilação:

```bash
# Instalar dependências de node no Mac
npm install

# Compilar arquivos estáticos e sincronizar para o diretório ios/
npm run sync:ios
```

---

## Passo 2: Instalação das Dependências do CocoaPods

Entre no diretório do projeto iOS e certifique-se de que os pods nativos estão atualizados:

```bash
cd ios/App
pod install
```

Para retornar à pasta raiz do projeto:
```bash
cd ../..
```

---

## Passo 3: Configurações de Assinatura e Bundle no Xcode

Abra o Xcode usando a ferramenta rápida de CLI do Capacitor:
```bash
npm run open:ios
```

Dentro da interface do Xcode:
1. **Selecione o Projeto Principal:**
   - No menu lateral esquerdo, clique no nó raiz `App`.
2. **Defina a Conta de Desenvolvedor (Signing & Capabilities):**
   - Clique na aba **Signing & Capabilities**.
   - Habilite a caixa **Automatically manage signing**.
   - Em *Team*, selecione a sua conta de desenvolvedor Apple ou equipe empresarial correspondente.
   - Valide se o *Bundle Identifier* está preenchido como `com.palpitaria.copa26`.
3. **Metadados de Versão:**
   - Na aba **General**, em *Identity*, atualize o campo **Version** (ex: `1.0.0`) e incremente o campo **Build** (ex: `2`) a cada nova submissão de release.

---

## Passo 4: Manifesto de Privacidade (Privacy Manifest)

> [!IMPORTANT]
> A Apple exige a declaração de motivos de privacidade para APIs sensíveis utilizadas por bibliotecas e SDKs.

No projeto do Capacitor, um arquivo contendo as declarações de privacidade necessárias para os plugins usados já é inserido sob a pasta `App/App/PrivacyInfo.xcprivacy`. Caso o Xcode exiba avisos de APIs de timestamp ausentes durante a validação da loja, insira as chaves correspondentes neste manifesto apontando para o uso legítimo de controle de timestamps offline do banco de dados LocalStorage.

---

## Passo 5: Geração do Arquivo de Compilação (Archive)

1. No menu superior do Xcode, altere o dispositivo de teste alvo de um simulador de iPhone para **Any iOS Device (arm64)**.
2. Acesse no menu principal **Product > Archive**.
3. O Xcode iniciará o build de compilação em produção. Este processo pode levar alguns minutos dependendo do desempenho da máquina macOS.
4. Ao finalizar, a janela do **Organizer** do Xcode se abrirá automaticamente exibindo o build gerado.

---

## Passo 6: Envio ao TestFlight e App Store Connect

1. Na janela do **Organizer**, com o build recém-compilado selecionado, clique no botão **Distribute App** no painel direito.
2. Selecione a opção **TestFlight & App Store** e clique em **Next**.
3. Escolha **Upload** (enviar diretamente para os servidores da Apple) e avance.
4. Mantenha marcadas as opções padrão de compilação de bitcode e símbolos do app para geração de relatórios de crash nativos.
5. Selecione o perfil de distribuição automático gerado e clique em **Upload**.
6. Aguarde a conclusão do progresso. Uma barra de sucesso será exibida informando que o pacote foi recebido.
7. Acesse o portal [App Store Connect](https://appstoreconnect.apple.com), navegue para a seção **TestFlight** para distribuir o build internamente para os seus testadores cadastrados ou selecione-o na aba **App Store** para submetê-lo à aprovação da Apple Store para publicação geral.
