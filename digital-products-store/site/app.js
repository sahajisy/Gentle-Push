(function () {
  "use strict";
  var cfg = window.STORE_CONFIG || {};
  var grid = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var products = [];
  var active = "All";

  if (cfg.storeName) {
    document.title = cfg.storeName;
    document.getElementById("brand").textContent = cfg.storeName;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  function money(p) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: p.currency || "USD" }).format(p.price);
    } catch (e) { return p.price + " " + p.currency; }
  }

  // Only allow https links to Stripe-hosted checkout.
  function safeCheckout(url) {
    return typeof url === "string" && /^https:\/\/(buy|checkout)\.stripe\.com\//.test(url) ? url : "";
  }

  function render() {
    var list = products.filter(function (p) { return active === "All" || p.category === active; });
    grid.textContent = "";
    if (!list.length) { grid.appendChild(el("p", { class: "muted", text: "No products yet. Check back soon." })); return; }
    list.forEach(function (p) {
      var href = safeCheckout(p.checkoutUrl);
      var buy = el("a", { class: "buy", href: href || "#", text: "Buy now" });
      if (!href) { buy.setAttribute("aria-disabled", "true"); buy.textContent = "Coming soon"; }
      else { buy.setAttribute("rel", "noopener"); }
      var img = el("img", { alt: "", loading: "lazy", src: p.image || "" });
      if (!p.image) img.removeAttribute("src");
      grid.appendChild(el("article", { class: "card" }, [
        img,
        el("div", { class: "body" }, [
          el("span", { class: "tag", text: p.category || "" }),
          el("h2", { text: p.title }),
          el("p", { text: p.description || "" }),
          el("div", { class: "row" }, [el("span", { class: "price", text: money(p) }), buy])
        ])
      ]));
    });
  }

  function renderFilters() {
    var cats = ["All"].concat(products.map(function (p) { return p.category; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; }));
    filters.textContent = "";
    if (cats.length < 3) return;
    cats.forEach(function (c) {
      var b = el("button", { type: "button", "aria-pressed": String(c === active), text: c });
      b.addEventListener("click", function () { active = c; renderFilters(); render(); });
      filters.appendChild(b);
    });
  }

  fetch("products.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { products = data.products || []; renderFilters(); render(); })
    .catch(function () { grid.textContent = "Could not load products. Please refresh."; });

  // ---- Chat widget (talks to the n8n AI sales agent) ----
  if (!cfg.chatWebhookUrl) return;
  var toggle = document.getElementById("chat-toggle");
  var box = document.getElementById("chat");
  var log = document.getElementById("chat-log");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");
  var sessionId = (function () {
    try {
      var s = localStorage.getItem("chatSession");
      if (!s) { s = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)); localStorage.setItem("chatSession", s); }
      return s;
    } catch (e) { return "anon-" + Date.now(); }
  })();

  function add(who, text) {
    var m = el("div", { class: "msg " + who, text: text });
    log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
  }

  toggle.hidden = false;
  toggle.addEventListener("click", function () {
    box.hidden = !box.hidden;
    if (!box.hidden && !log.childElementCount) add("bot", "Hi! Ask me anything about our products, licenses or delivery.");
    if (!box.hidden) input.focus();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    add("user", text);
    var pending = add("bot", "…");
    fetch(cfg.chatWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId, message: text })
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { pending.textContent = d.reply || "Sorry, I couldn't answer that."; })
      .catch(function () { pending.textContent = "Sorry, I'm unavailable right now. Please email support."; });
  });
})();
