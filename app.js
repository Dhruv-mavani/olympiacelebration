(() => {
  const S = window.SITE, T = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
  const store = {
    get: () => { try { return +localStorage.getItem("lang") || 0; } catch { return 0; } },
    set: v => { try { localStorage.setItem("lang", v); } catch {} }
  };

  let lang = [0, 1, 2].includes(store.get()) ? store.get() : 0;
  const t = (key, i = lang) => (T[key] ? T[key][i] : key);
  const locale = () => ["en-IN", "en-IN", "gu-IN"][lang];
  const rupees = n => "₹" + n.toLocaleString("en-IN");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastView = new Date(today.getFullYear(), today.getMonth() + 6, 1);
  const state = { date: null, pack: "p2", guests: 8, occasion: "birthday", addons: new Set() };
  const pack = () => S.packages.find(p => p.id === state.pack);
  const hoursKey = p => (p.hours === 1 ? "pk_hour" : "pk_hours");

  // Links
  const links = {
    call: "tel:" + S.phone, instagram: S.instagram, tourReel: S.tourReel, maps: S.maps,
    whatsapp: `https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Hello Olympia Celebration, I would like to book the party room.")}`
  };
  $$("[data-link]").forEach(a => { a.href = links[a.dataset.link]; });
  $("#place [data-link=call]").textContent = S.phoneDisplay;
  $("#map").src = S.mapsEmbed;

  function renderPackages() {
    $("#packs").replaceChildren(...S.packages.map(p => {
      const btn = el("button", { type: "button", className: "btn btn-solid", textContent: t("pk_choose") });
      btn.onclick = () => { setPack(p.id); $("#booking").scrollIntoView(); };
      return el("article", { className: "card pack" + (p.id === "p2" ? " feature" : "") },
        el("p", { className: "kicker", textContent: t(hoursKey(p)) }),
        el("p", { className: "price", textContent: rupees(p.price) }),
        el("p", { className: "upto", textContent: t("pk_upto").replace("{n}", p.guests) }),
        el("ul", {}, ...p.features.map(f => el("li", { textContent: t("f_" + f) }))),
        btn);
    }));
    $("#addonList").replaceChildren(...S.addons.map(a => el("li", { className: "chip", textContent: t("a_" + a) })));
  }

  // Gallery and lightbox
  let cat = "all";
  const light = $("#light");
  function renderGallery() {
    $("#grid").replaceChildren(...S.gallery.filter(g => cat === "all" || g.cat === cat).map(g => {
      const b = el("button", { type: "button", className: "shot" },
        el("img", { src: g.src, alt: t(g.key), loading: "lazy" }), el("span", { textContent: t(g.key) }));
      b.onclick = () => { $("img", light).src = g.src; $("img", light).alt = t(g.key); $("p", light).textContent = t(g.key); light.showModal(); };
      return b;
    }));
  }
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat;
    $$("#filters .chip").forEach(c => c.classList.toggle("on", c === b));
    renderGallery();
  });
  light.addEventListener("click", e => { if (e.target.tagName !== "IMG") light.close(); });

  // Calendar
  function renderCalendar() {
    $("#month").textContent = view.toLocaleDateString(locale(), { month: "long", year: "numeric" });
    const heads = Array.from({ length: 7 }, (_, i) => // 1 Jan 2024 was a Monday
      el("span", { className: "dow", textContent: new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: "narrow" }) }));
    const blanks = Array.from({ length: (view.getDay() + 6) % 7 }, () => el("span"));
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: count }, (_, i) => {
      const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
      const b = el("button", { type: "button", textContent: i + 1, disabled: d < today });
      b.setAttribute("aria-label", d.toDateString());
      if (d.getDay() === 0 || d.getDay() === 6) b.classList.add("weekend");
      const on = state.date && +d === +state.date;
      if (on) b.classList.add("sel");
      b.setAttribute("aria-pressed", !!on);
      b.onclick = () => { state.date = d; $("#error").textContent = ""; renderCalendar(); updateMessage(); };
      return b;
    });
    $("#cal").replaceChildren(...heads, ...blanks, ...days);
    $("#prev").disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    $("#nextMonth").disabled = view >= lastView;
    $("#picked").textContent = state.date
      ? `${t("bk_picked")} ${state.date.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" })}`
      : t("bk_pick");
  }
  $("#prev").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCalendar(); };
  $("#nextMonth").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCalendar(); };

  // Booking form
  function chip(label, on, click) {
    const b = el("button", { type: "button", className: "chip" + (on ? " on" : ""), textContent: label });
    b.setAttribute("aria-pressed", on);
    b.onclick = click;
    return b;
  }
  function renderForm() {
    $("#fPack").replaceChildren(...S.packages.map(p =>
      chip(`${rupees(p.price)} · ${t(hoursKey(p))}`, state.pack === p.id, () => setPack(p.id))));
    $("#fOcc").replaceChildren(...S.occasions.map(o =>
      chip(t("o_" + o), state.occasion === o, () => { state.occasion = o; renderForm(); })));
    $("#fAdd").replaceChildren(...S.addons.map(a =>
      chip(t("a_" + a), state.addons.has(a), () => { state.addons.delete(a) || state.addons.add(a); renderForm(); })));
    $("#guests").textContent = state.guests;
    $("#max").textContent = t("bk_max").replace("{n}", pack().guests);
    $("#minus").disabled = state.guests <= 1;
    $("#plus").disabled = state.guests >= pack().guests;
    updateMessage();
  }
  function setPack(id) { state.pack = id; state.guests = Math.min(state.guests, pack().guests); renderForm(); }
  $("#minus").onclick = () => { state.guests--; renderForm(); };
  $("#plus").onclick = () => { state.guests++; renderForm(); };

  // The message is always in English so the team gets a consistent format.
  function updateMessage() {
    const p = pack(), name = $("#name").value.trim(), time = $("#time").value, notes = $("#notes").value.trim();
    const date = state.date ? state.date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "(not selected)";
    $("#msg").value = [
      "Hello Olympia Celebration,",
      "I would like to enquire about the private party room.",
      name && `Name: ${name}`,
      `Date: ${date}`,
      time && `Start time: ${time}`,
      `Package: ${rupees(p.price)} / ${p.hours} hour${p.hours > 1 ? "s" : ""}`,
      `Guests: ${state.guests}`,
      `Occasion: ${t("o_" + state.occasion, 0)}`,
      state.addons.size && `Add-ons: ${[...state.addons].map(a => t("a_" + a, 0)).join(", ")}`,
      notes && `Notes: ${notes}`,
      "Is this slot available? Please confirm the rate."
    ].filter(Boolean).join("\n");
  }
  ["#name", "#time", "#notes"].forEach(s => $(s).addEventListener("input", updateMessage));
  $("#form").addEventListener("submit", e => {
    e.preventDefault();
    if (!state.date) { $("#error").textContent = t("bk_need"); $("#cal").scrollIntoView({ block: "center" }); return; }
    window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent($("#msg").value)}`, "_blank", "noopener");
  });

  // Language
  let current = $("#hero");
  const setClock = () => { $("#clock").textContent = `${current.dataset.clock} · ${t(current.dataset.clockKey)}`; };
  function applyLang(i) {
    lang = i; store.set(i);
    document.documentElement.lang = ["en", "hi-Latn", "gu"][i];
    $$("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
    $$("[data-i18n-ph]").forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
    $$(".langs button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.lang === i));
    $("#error").textContent = "";
    renderPackages(); renderGallery(); renderCalendar(); renderForm(); setClock(); observeReveals(); onScroll();
  }
  $$(".langs button").forEach(b => { b.onclick = () => applyLang(+b.dataset.lang); });

  // Scroll: progress bar, clock chip and the evening fading in behind the timeline
  const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    const mid = scrollY + innerHeight * 0.5;
    const hit = $$("[data-clock]").filter(s => s.getBoundingClientRect().top + scrollY <= mid).pop() || $("#hero");
    if (hit !== current) { current = hit; setClock(); }
    // The switch to night is short and sits just before the dark sections, so text stays readable.
    const reelTop = $("#reel").getBoundingClientRect().top;
    const night = reelTop < innerHeight * 0.6;
    document.body.classList.toggle("night", night);
    const dusk = Math.min(1, Math.max(0, scrollY / Math.max(1, $("#reel").offsetTop - innerHeight)));
    $(".sky").style.background = night
      ? "linear-gradient(#241420, #150d14)"
      : `linear-gradient(${mix([250, 246, 237], [247, 231, 222], dusk)}, ${mix([240, 233, 216], [236, 206, 200], dusk)})`;
    $("#fab").classList.toggle("show", scrollY > innerHeight * 0.8 && !$("#booking").contains(current) && current.id !== "booking");
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  const io = "IntersectionObserver" in window && new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  function observeReveals() { $$(".reveal:not(.in), .pack:not(.in)").forEach(n => (io ? io.observe(n) : n.classList.add("in"))); }

  // Floating balloons and petals
  $("#orbs").append(...Array.from({ length: 16 }, (_, i) => {
    const o = el("i");
    o.style.cssText = `left:${(i * 61) % 100}%;--s:${10 + ((i * 7) % 22)}px;animation-duration:${16 + ((i * 5) % 14)}s;animation-delay:-${(i * 3.7) % 20}s`;
    return o;
  }));

  applyLang(lang);
})();
