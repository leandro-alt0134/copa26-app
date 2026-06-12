# Instruções para Configuração das Fontes Locais (Plus Jakarta Sans)

Para garantir o funcionamento 100% offline da aplicação PWA e evitar dependências externas de CDNs (reduzindo Layout Shift), o carregamento da fonte **Plus Jakarta Sans** foi configurado localmente.

Siga os passos abaixo para instalar os arquivos de fontes físicas no projeto:

---

## 1. Baixar os arquivos de fonte

1. Acesse o [Google Fonts - Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans).
2. Clique no botão **Download family** no canto superior direito para baixar o arquivo compactado (`.zip`).
3. Extraia o conteúdo do arquivo `.zip` na sua máquina local.

---

## 2. Copiar os arquivos para o projeto

Crie a pasta de fontes sob a estrutura de assets do frontend:

```bash
mkdir src/assets/fonts
```

Copie os seguintes arquivos da pasta extraída para a pasta `src/assets/fonts/` que acabou de criar:
* `PlusJakartaSans-VariableFont_wght.ttf` (Fonte Principal/Normal)
* `PlusJakartaSans-Italic-VariableFont_wght.ttf` (Fonte em Itálico)

---

## 3. Funcionamento

A folha de estilos `src/styles/fonts.css` já está integrada ao projeto e detecta automaticamente esses arquivos por meio da diretiva `@font-face`. Se os arquivos não forem encontrados no diretório, o navegador utilizará os fallbacks padrões de fontes do sistema definidos no CSS (`system-ui, -apple-system, sans-serif`).
