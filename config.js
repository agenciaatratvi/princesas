/* =====================================================================
   CONFIGURAÇÃO CENTRAL — é o ÚNICO arquivo que você precisa editar
   para colocar os links de checkout, preços ou imagens.
   ===================================================================== */

const IMG = "https://olympusjoias.com/cdn/shop/files/";

const SITE_CONFIG = {

  /* ---------- 1) LINKS DE CHECKOUT ----------
     Para 1 relógio, o link depende da princesa escolhida.
     Para 2, 3 ou 4 relógios, usa-se o checkout do combo. */
  checkouts: {
    1: "", // direcionamento individual definido em singleCheckouts
    2: "https://comprasseguras.org.ua/c/009576d9e9",
    3: "https://comprasseguras.org.ua/c/7b03ea66d0",
    4: "https://comprasseguras.org.ua/c/796984e929"
  },
  singleCheckouts: {
    rapunzel: "https://comprasseguras.org.ua/c/02ad96598a",
    tiana: "https://comprasseguras.org.ua/c/5300f5dfc9",
    cinderela: "https://comprasseguras.org.ua/c/7c68e0c880",
    bela: "https://comprasseguras.org.ua/c/88ac69d086",
    aurora: "https://comprasseguras.org.ua/c/7677348d54"
  },

  /* ---------- 2) OFERTAS ---------- */
  unitPrice: 47.90, // preço base de 1 relógio (usado para calcular "Economize")
  offers: [
    { qty: 1, emoji: "👑", label: "1 Relógio",   price: 47.90,  tagline: "Escolha sua princesa favorita!" },
    { qty: 2, emoji: "💖", label: "2 Relógios",  price: 87.90,  badge: "COMBO ESPECIAL" },
    { qty: 3, emoji: "✨", label: "3 Relógios",  price: 117.90 },
    { qty: 4, emoji: "🎀", label: "4 Relógios",  price: 147.90 }
  ],
  // Troque "COMBO ESPECIAL" por "MAIS POPULAR" SOMENTE se tiver dados reais de vendas.

  /* ---------- 3) COMO ENVIAR A ESCOLHA AO CHECKOUT ----------
     Sempre são acrescentados ao link: qtd, total, princesas, ref.
     - shopifyAttributes: true  → também envia attributes[Princesas]=...&note=...
       (use se o checkout for Shopify /cart/... ; para outras plataformas deixe false)
     - webhookUrl: opcional. Se preencher, a escolha é enviada (POST JSON)
       ao seu servidor/automação (Make, Zapier, n8n, planilha etc.) ANTES do
       redirecionamento, associando o pedido ao código "ref", sem depender
       do navegador do cliente.                                           */
  selectionDelivery: {
    shopifyAttributes: false,
    webhookUrl: ""
  },

  /* ---------- 4) IMAGENS LOCAIS, ORIGINAIS ---------- */
  princesses: [
    { id: "rapunzel", name: "Rapunzel", img: "imagens/rapunzel.png" },
    { id: "tiana", name: "Tiana", img: "imagens/tiana.png" },
    { id: "cinderela", name: "Cinderela", img: "imagens/cinderela.png" },
    { id: "aurora", name: "Aurora", img: "imagens/aurora.png" },
    { id: "bela", name: "Bela", img: "imagens/bela.png" }
  ],
  // Galeria do topo: todos, Rapunzel, Cinderela, Aurora, Bela, Tiana
  gallery: [
    { src: "imagens/todos.png", alt: "Coleção com os cinco relógios das princesas" },
    { src: "imagens/rapunzel.png", alt: "Relógio Rapunzel" },
    { src: "imagens/cinderela.png", alt: "Relógio Cinderela" },
    { src: "imagens/aurora.png", alt: "Relógio Aurora" },
    { src: "imagens/bela.png", alt: "Relógio Bela" },
    { src: "imagens/tiana.png", alt: "Relógio Tiana" }
  ],
  galleryIntervalMs: 4500,
  // Imagens das avaliações na ordem dos 10 depoimentos existentes
  reviewImages: [
    "imagens/avaliacao-01.png", "imagens/avaliacao-02.png",
    "imagens/avaliacao-03.png", "imagens/avaliacao-04.png",
    "imagens/avaliacao-05.png", "imagens/avaliacao-06.png",
    "imagens/avaliacao-07.png", "imagens/avaliacao-08.png",
    "imagens/avaliacao-09.png", "imagens/avaliacao-10.png"
  ],
  // O cabeçalho não exibe logotipo.
  sparkle: IMG + "Design_sem_nome_60.png?v=1782157055"
};
