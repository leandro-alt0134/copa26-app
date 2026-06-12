# Diretrizes de Privacidade Apple — App Store Connect

Este documento serve como guia de referência técnica para o preenchimento da seção **Privacidade do Aplicativo** (App Privacy Nutrition Labels) no App Store Connect e para a configuração de integridade do manifesto de privacidade da Apple no iOS.

---

## 1. Resumo de Coleta de Dados (Nutrition Labels)

O aplicativo **Palpitaria da Copa 2026** funciona sob a premissa de armazenamento 100% local (Client-Side). No entanto, devido à integração com a biblioteca nativa do **Google AdMob** no ambiente de produção para iOS, alguns dados de publicidade e telemetria podem ser processados de forma agregada pela SDK do Google.

A tabela abaixo detalha as declarações necessárias na App Store:

| Categoria do Dado | Tipo de Dado | Coletado? | Finalidade Principal | Vinculado ao Usuário? | Rastreamento? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Identificadores** | Identificadores de Dispositivo (IDFA/IDFV) | **Sim** (via SDK AdMob) | Publicidade do Desenvolvedor | Não | **Sim** (Apenas se aceito no prompt ATT) |
| **Dados de Uso** | Interação com o produto (cliques em anúncios) | **Sim** (via SDK AdMob) | Publicidade / Análise | Não | Não |
| **Dados de Diagnóstico** | Desempenho e Falhas do App (Crash logs) | **Sim** (via SDK AdMob) | Diagnóstico do App | Não | Não |
| **Outros Dados** | Conteúdo gerado pelo usuário (palpites locais) | **Não** | N/A (armazenado apenas localmente) | Não | Não |

---

## 2. Solicitação de Rastreamento (App Tracking Transparency - ATT)

No iOS 14.5+, para coletar e utilizar o IDFA (Identifier for Advertisers) para fins de anúncio personalizado, o aplicativo deve solicitar autorização do usuário usando o prompt ATT do iOS.

* **Justificativa de Permissão (Info.plist)**:
  `NSUserTrackingUsageDescription`
  * *Texto sugerido em Português:* "Este identificador será utilizado para veicular anúncios mais relevantes e personalizados sobre a Copa do Mundo 2026 para você."
  * *Texto sugerido em Inglês:* "This identifier will be used to deliver more relevant and personalized ads about the 2026 World Cup."

---

## 3. Privacyinfo.xcprivacy (Manifesto de Privacidade do iOS)

Para projetos Xcode baseados em Capacitor 8, a Apple exige um arquivo estruturado `PrivacyInfo.xcprivacy` declarando o uso de APIs de razão requerida (Required Reason APIs) e domínios de rastreamento.

Crie ou atualize o arquivo no caminho do Xcode: `ios/App/App/PrivacyInfo.xcprivacy`

### Estrutura XML Recomendada:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <true/>
    <key>NSPrivacyTrackingDomains</key>
    <array>
        <string>doubleclick.net</string>
        <string>googleads.g.doubleclick.net</string>
        <string>pagead2.googlesyndication.com</string>
    </array>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeDeviceID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <true/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeDeveloperAdvertising</string>
            </array>
        </dict>
    </array>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string> <!-- Acesso legítimo para persistir dados locais da aplicação como simulações e palpites -->
            </array>
        </dict>
    </array>
</dict>
</plist>
```

---

## 4. Retenção e Exclusão de Dados

* O app não transmite dados a servidores de banco de dados remotos.
* **Exclusão de Dados**: Para deletar todo e qualquer dado local (como os cookies de publicidade, localStorage e backups salvos), o usuário pode acessar `/configuracoes` e clicar em "Limpar Armazenamento Local", ou apagar os dados nas configurações do próprio iOS (Ajustes -> Armazenamento -> Palpitaria Copa 2026 -> Apagar dados).
