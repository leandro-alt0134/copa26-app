# Auditoria Legal de Propriedade Intelectual e Assets

Este documento apresenta a análise de conformidade de propriedade intelectual para os assets de mídia e termos de marca utilizados na aplicação independente **Palpitaria da Copa 2026**.

---

## 1. Termos de Marca e Nomes Registrados

* **Item**: FIFA, World Cup, Copa do Mundo, etc.
* **Tipo de risco**: Uso não autorizado de marcas nominativas registradas da FIFA.
* **Recomendação**: Manter o uso estritamente descritivo (ex: "Copa do Mundo 2026" ou "Mundial 2026") para fins recreativos e de identificação informativa. Nunca usar os termos sugerindo parceria, chancela oficial ou endosso.
* **Status**: Manter (com disclaimer explícito)
* **Observação**: Um aviso de isenção de responsabilidade visível foi incluído no rodapé global da página e na tela "Sobre" para certificar que o app é independente.

---

## 2. Imagens e Logotipos de Terceiros

* **Item**: Logo da Copa 2026 (`/assets/copa-2026-logo.svg`, `/assets/copa-2026-logo-white.svg`)
* **Tipo de risco**: Uso de marca figurativa registrada da FIFA (logo oficial da Copa 2026).
* **Recomendação**: Substituir a silhueta ou elementos protegidos por uma arte/vetor genérico personalizado (como um globo com uma bola de futebol estilizada ou troféu conceitual), mantendo o layout e as dimensões intactos.
* **Status**: Revisar / Substituir futuramente
* **Observação**: Para esta rodada de homologação, os caminhos foram mantidos com disclaimers estritos, mas sua substituição por elementos estilizados neutros é fortemente encorajada antes de empacotar em lojas de apps (Google Play e Apple App Store).

---

## 3. Escudos de Federações e Seleções

* **Item**: Escudos de seleções (`/public/escudos/*`)
* **Tipo de risco**: Direitos de imagem de federações e confederações desportivas (ex: escudo da CBF, da USSF, etc.).
* **Recomendação**: Manter sob a exceção de uso informativo desportivo ("Fair Use") apenas para identificação visual das equipes no chaveamento recreativo. Se for publicado comercialmente ou monetizado agressivamente, substituir os escudos oficiais por escudos conceituais/genéricos usando as cores oficiais do país.
* **Status**: Manter
* **Observação**: As bandeiras nacionais (geralmente sob domínio público) são preferidas em detrimento de marcas de associações esportivas de futebol sempre que possível.

---

## 4. Bandeiras Nacionais

* **Item**: Bandeiras (`/public/flags/*`, `/public/square-flags/*`)
* **Tipo de risco**: Baixo. Bandeiras de países soberanos são de uso público em caráter informativo e não violam propriedade intelectual privada.
* **Recomendação**: Manter o uso para escaneamento rápido e visualização limpa nas listagens, tabelas e infográficos.
* **Status**: Manter
* **Observação**: Nenhum risco legal aplicável às bandeiras nacionais.
