(function () {
  "use strict";
  var C = SITE_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var imgW = function (u, w) { return u + (u.indexOf("?") > -1 ? "&" : "?") + "width=" + w; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var state = { qty: null, picks: [] };

  // ---- logo e galeria com fotos originais ----
  var spark = $("#bfLogoSpark");
  spark.src = C.sparkle;
  spark.addEventListener("error", function () { spark.style.display = "none"; });
  var gallery = C.gallery;
  var main = $("#galMain"), thumbs = $("#galThumbs");
  var current = 0, timer = null;
  function showImg(i) {
    current = (i + gallery.length) % gallery.length;
    main.src = gallery[current].src;
    main.alt = gallery[current].alt;
    [].forEach.call(thumbs.children, function (b, k) {
      b.setAttribute("aria-current", k === current ? "true" : "false");
    });
  }
  function stopGallery() { if (timer) { clearInterval(timer); timer = null; } }
  function startGallery() {
    stopGallery();
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(function () { showImg(current + 1); }, C.galleryIntervalMs || 4500);
  }
  function navigateGallery(delta) { showImg(current + delta); startGallery(); }
  gallery.forEach(function (g, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Mostrar " + g.alt);
    var image = document.createElement("img");
    image.loading = "lazy"; image.width = 80; image.height = 80;
    image.alt = ""; image.src = g.src;
    b.appendChild(image);
    b.addEventListener("click", function () { showImg(i); startGallery(); });
    thumbs.appendChild(b);
  });
  $("#galPrev").addEventListener("click", function () { navigateGallery(-1); });
  $("#galNext").addEventListener("click", function () { navigateGallery(1); });
  var swipeX = null;
  main.addEventListener("touchstart", function (e) { swipeX = e.changedTouches[0].screenX; }, { passive: true });
  main.addEventListener("touchend", function (e) {
    if (swipeX === null) return;
    var dx = e.changedTouches[0].screenX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 45) navigateGallery(dx < 0 ? 1 : -1);
  }, { passive: true });
  var galleryEl = $("#galleryCarousel");
  galleryEl.addEventListener("mouseenter", stopGallery);
  galleryEl.addEventListener("mouseleave", startGallery);
  galleryEl.addEventListener("focusin", stopGallery);
  galleryEl.addEventListener("focusout", function (e) {
    if (!galleryEl.contains(e.relatedTarget)) startGallery();
  });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopGallery(); else startGallery(); });
  showImg(0); startGallery();
  // Fotos das avaliações enviadas pelo proprietário, sem edição
  [].forEach.call(document.querySelectorAll(".reviews .rv .card"), function (card, i) {
    if (!C.reviewImages[i]) return;
    var pic = document.createElement("img");
    pic.className = "review-photo";
    pic.src = C.reviewImages[i];
    pic.alt = "Foto do relógio associada à avaliação " + (i + 1);
    pic.loading = "lazy";
    card.appendChild(pic);
  });
  $("#sparkTrack").innerHTML = ["MAGIA", "ENCANTO", "ELEGÂNCIA", "MAGIA", "ENCANTO", "ELEGÂNCIA", "MAGIA", "ENCANTO", "ELEGÂNCIA", "MAGIA", "ENCANTO", "ELEGÂNCIA"]
    .map(function (t) { return '<span><img alt="" width="44" height="44" loading="lazy" src="' + C.sparkle + '">' + t + "</span>"; }).join("");

  // ---- ofertas ----
  var offersEl = $("#offers");
  C.offers.forEach(function (o) {
    var save = Math.round((o.qty * C.unitPrice - o.price) * 100) / 100;
    var sub = o.qty === 1 ? o.tagline : "Economize " + money(save) + "!";
    var el = document.createElement("label");
    el.className = "offer" + (o.badge ? " has-badge" : "");
    el.innerHTML = (o.badge ? '<span class="badge">' + esc(o.badge) + "</span>" : "") +
      '<input type="radio" name="qty" value="' + o.qty + '">' +
      '<span class="o-emoji" aria-hidden="true">' + o.emoji + "</span>" +
      '<span class="o-label">' + esc(o.label) + "</span>" +
      '<span class="o-price">' + money(o.price) + "</span>" +
      '<span class="o-sub">' + esc(sub) + "</span>";
    el.querySelector("input").addEventListener("change", function () { setQty(o.qty); });
    offersEl.appendChild(el);
  });

  // ---- seletores de princesa ----
  var slotsEl = $("#slots"), step2 = $("#step2"), step3 = $("#step3");
  function setQty(q) {
    var old = state.picks.slice();
    state.qty = q;
    state.picks = [];
    for (var i = 0; i < q; i++) state.picks.push(old[i] || null);
    renderSlots(); update(); save();
    step2.hidden = false; step3.hidden = false;
    setTimeout(function () { step2.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }
  function renderSlots() {
    slotsEl.innerHTML = "";
    state.picks.forEach(function (pick, idx) {
      var s = document.createElement("fieldset");
      s.className = "slot"; s.dataset.idx = idx;
      var h = '<legend>Relógio ' + (idx + 1) + ' de ' + state.qty + '</legend><div class="tiles">';
      C.princesses.forEach(function (p) {
        h += '<button type="button" class="tile" data-id="' + p.id + '" aria-pressed="' + (pick === p.id) + '">' +
          '<img loading="lazy" width="200" height="200" alt="Relógio ' + esc(p.name) + '" src="' + p.img + '">' +
          "<span>" + esc(p.name) + "</span></button>";
      });
      s.innerHTML = h + "</div>";
      slotsEl.appendChild(s);
    });
  }
  slotsEl.addEventListener("click", function (e) {
    var t = e.target.closest(".tile"); if (!t) return;
    var slot = t.closest(".slot"), idx = +slot.dataset.idx;
    state.picks[idx] = t.dataset.id;
    [].forEach.call(slot.querySelectorAll(".tile"), function (b) { b.setAttribute("aria-pressed", b === t ? "true" : "false"); });
    slot.classList.remove("missing");
    update(); save();
  });

  function nameOf(id) { return C.princesses.filter(function (p) { return p.id === id; })[0].name; }
  function offer() { return C.offers.filter(function (o) { return o.qty === state.qty; })[0]; }
  function missing() { return state.picks.filter(function (p) { return !p; }).length; }

  var cta = $("#cta"), msg = $("#ctaMsg");
  function update() {
    if (!state.qty) return;
    var o = offer(), miss = missing();
    $("#sumQty").textContent = o.label;
    $("#sumList").innerHTML = state.picks.map(function (p, i) {
      return "<li><b>" + (i + 1) + ".</b> " + (p ? esc(nameOf(p)) : '<em>escolha a princesa</em>') + "</li>";
    }).join("");
    $("#sumTotal").textContent = money(o.price);
    cta.setAttribute("aria-disabled", miss ? "true" : "false");
    msg.textContent = miss ? "Falta escolher " + miss + (miss > 1 ? " princesas" : " princesa") + " para continuar." : "";
    msg.className = "cta-msg";
  }

  function refCode() {
    var a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "PR-", r = new Uint8Array(6);
    (window.crypto || window.msCrypto).getRandomValues(r);
    for (var i = 0; i < 6; i++) s += a[r[i] % a.length];
    return s;
  }

  cta.addEventListener("click", function () {
    if (!state.qty) return;
    var miss = missing();
    if (miss) {
      var first = null;
      [].forEach.call(slotsEl.children, function (s, i) { if (!state.picks[i]) { s.classList.add("missing"); first = first || s; } });
      msg.textContent = "Selecione a princesa de todos os relógios (" + miss + " pendente" + (miss > 1 ? "s" : "") + ").";
      msg.className = "cta-msg err";
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var o = offer();
    var singleLinks = {
      rapunzel: "https://comprasseguras.org.ua/c/02ad96598a",
      tiana: "https://comprasseguras.org.ua/c/5300f5dfc9",
      cinderela: "https://comprasseguras.org.ua/c/7c68e0c880",
      bela: "https://comprasseguras.org.ua/c/88ac69d086",
      aurora: "https://comprasseguras.org.ua/c/7677348d54"
    };
    var comboLinks = {
      2: "https://comprasseguras.org.ua/c/009576d9e9",
      3: "https://comprasseguras.org.ua/c/7b03ea66d0",
      4: "https://comprasseguras.org.ua/c/796984e929"
    };
    var link = state.qty === 1
      ? singleLinks[state.picks[0]]
      : comboLinks[state.qty];
    link = (link || "").trim();
    if (!link) {
      msg.textContent = "Checkout em preparação. Por favor, tente novamente em instantes ou fale com o atendimento.";
      msg.className = "cta-msg err";
      return;
    }
    var names = state.picks.map(nameOf);
    var ref = refCode();
    var payload = { ref: ref, qtd: state.qty, total: o.price.toFixed(2), princesas: names, quando: new Date().toISOString() };
    var url;
    try {
      url = new URL(link);
    } catch (e) {
      msg.textContent = "Link de checkout inválido. Verifique o config.js.";
      msg.className = "cta-msg err";
      return;
    }
    url.searchParams.set("qtd", state.qty);
    url.searchParams.set("total", o.price.toFixed(2));
    url.searchParams.set("princesas", names.join(", "));
    url.searchParams.set("ref", ref);
    if (C.selectionDelivery.shopifyAttributes) {
      url.searchParams.set("attributes[Princesas]", names.join(", "));
      url.searchParams.set("attributes[Pedido]", ref);
      url.searchParams.set("note", "Princesas: " + names.join(", ") + " | Ref " + ref);
    }
    // webhook opcional (não bloqueia o redirecionamento)
    if (C.selectionDelivery.webhookUrl) {
      try {
        var body = JSON.stringify(payload);
        if (!(navigator.sendBeacon && navigator.sendBeacon(C.selectionDelivery.webhookUrl, new Blob([body], { type: "text/plain" })))) {
          fetch(C.selectionDelivery.webhookUrl, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(function () {});
        }
      } catch (e) {}
    }
    cta.setAttribute("aria-busy", "true");
    window.location.href = url.toString();
  });

  function save() { try { sessionStorage.setItem("pr_sel", JSON.stringify(state)); } catch (e) {} }
  try {
    var s = JSON.parse(sessionStorage.getItem("pr_sel") || "null");
    if (s && s.qty && s.picks && s.picks.length === s.qty) {
      var valid = s.picks.every(function (p) { return p === null || C.princesses.some(function (x) { return x.id === p; }); });
      if (valid) {
        state = s;
        var r = document.querySelector('input[name="qty"][value="' + s.qty + '"]'); if (r) r.checked = true;
        renderSlots(); update(); step2.hidden = false; step3.hidden = false;
      }
    }
  } catch (e) {}

  // ---- botão fixo mobile: some quando a seção de compra está visível ----
  var sticky = $("#sticky"), buy = $("#escolha");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { sticky.classList.toggle("hide", en[0].isIntersecting); }, { threshold: 0.15 }).observe(buy);
  }
})();
