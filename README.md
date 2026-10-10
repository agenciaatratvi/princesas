# Olympus – Relógios das Princesas (Black Friday)

Site estático (HTML + CSS + JS puro, sem dependências).

## Arquivos
- `index.html` – página
- `style.css` – visual (rosa-choque)
- `app.js` – seleção, validação, redirecionamento
- `config.js` – **único arquivo a editar**: links de checkout, preços, imagens
- `vercel.json` – configuração da Vercel

## Colocar os checkouts
Abra `config.js`, bloco `checkouts`, e cole o link de cada oferta (1, 2, 3, 4 relógios).
Link vazio = o botão não redireciona e mostra aviso.

## Princesas no pedido
Ao clicar em "GARANTIR...", o link recebe: `qtd`, `total`, `princesas`, `ref` (código único tipo PR-ABC123).
- Shopify: ative `shopifyAttributes: true` (envia attributes + note).
- Qualquer plataforma: preencha `webhookUrl` (Make/Zapier/n8n) para receber a escolha + `ref` no seu servidor.
- Se a plataforma ignorar os parâmetros, use o `ref` para casar o pedido com o webhook.

## Publicar na Vercel
Arraste a pasta em vercel.com/new (ou `vercel --prod` dentro da pasta). Sem build.

## Imagens locais e galeria
Todas as 6 fotos do topo, 5 modelos individuais e 10 fotos das avaliações foram integradas na pasta `imagens/` sem edição.
A galeria inicia na foto com todos os relógios, depois Rapunzel, Cinderela, Aurora, Bela e Tiana. Avança automaticamente a cada 4,5 segundos, com setas, miniaturas e gesto de deslizar. Pausa na interação e quando a aba está oculta.

**Pendente:** o arquivo original do logotipo e do ícone de brilho não foi enviado; o projeto conserva seus links externos anteriores. Se o logotipo externo falhar, o texto Olympus aparece no lugar.

**Checkouts:** os quatro links ainda precisam ser inseridos em `config.js`. Confira a compatibilidade dos parâmetros de personalização com seu provedor de checkout antes de publicar.

**Avaliações:** confirme que as fotos enviadas correspondem aos depoimentos reais antes de publicar.

## Correções de imagens e cabeçalho
As imagens individuais foram associadas diretamente aos arquivos originais reenviados: Tiana (verde), Bela (vermelho), Cinderela (azul), Aurora (rosa), Rapunzel (lilás). O logotipo Olympus foi retirado do cabeçalho.
