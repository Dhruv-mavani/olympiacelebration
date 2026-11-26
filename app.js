(() => {
  const S = window.SITE, T = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
  const store = {
    get: () => { try { return +localStorage.getItem("lang") || 0; } catch { return 0; } },
    set: v => { try { localStorage.setItem("lang", v); } catch {} }
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  let lang = [0, 1, 2].includes(store.get()) ? store.get() : 0;
  const t = (key, vars = {}, i = lang) => (T[key] ? T[key][i] : key).replace(/\{(\w+)\}/g, (m, v) => (v in vars ? vars[v] : m));
  const locale = () => ["en-IN", "en-IN", "gu-IN"][lang];
  const rupees = n => "₹" + n.toLocaleString("en-IN");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = v => { const [y, m, d] = v.split("-").map(Number); return v ? new Date(y, m - 1, d) : null; };

  const state = { name: "", occasion: "birthday", date: null, pack: "p2", guests: 8, addons: new Set(), step: 0 };
  const pack = () => S.packages.find(p => p.id === state.pack);
  const occasion = () => S.occasions.find(o => o.id === state.occasion);
  const packMeta = p => t(p.hours === 1 ? "meta1" : "meta2", { n: p.guests, h: p.hours });

  const links = {
    call: "tel:" + S.phone, instagram: S.instagram, tourReel: S.tourReel, maps: S.maps, reviews: S.reviews,
    whatsapp: `https://wa.me/${S.whatsapp}?text=${encodeURIComponent("Hello Olympia Celebration, I would like to book the party room.")}`
  };
  $$("[data-link]").forEach(a => { a.href = links[a.dataset.link]; });

  /* ---------- The neon sign ---------- */
  const signA = $("#signA"), signB = $("#signB");

  // Size each line to fill the wall without overflowing it.
  function fit(tube, max) {
    const width = tube.parentElement.clientWidth;
    tube.style.fontSize = "100px";
    tube.style.fontSize = Math.min(max, (100 * width * 0.94) / tube.offsetWidth) + "px";
  }
  function fitAll() {
    const wide = Math.min(innerWidth, 1100), tall = innerHeight;
    fit(signA, Math.min(wide * 0.17, tall * 0.15)); fit(signB, Math.min(wide * 0.24, tall * 0.21));
    const [a, b] = $$(".neon.small .tube"); fit(a, 90); fit(b, 170);
  }
  function setText(tube, text) { tube.textContent = text; tube.dataset.text = text; }
  function write(tube, delay = 0, dur = 1.25) {
    tube.classList.remove("dark", "write");
    if (reduced.matches) return;
    void tube.offsetWidth; // restart the animation
    tube.style.setProperty("--delay", delay + "s"); tube.style.setProperty("--dur", dur + "s");
    tube.classList.add("write");
  }
  function drawSign() {
    // On phones, stack the words (broken near the middle) so the sign can be much bigger.
    const words = occasion().sign;
    const gaps = [...words.matchAll(/ /g)].map(m => m.index).sort((a, b) => Math.abs(a - words.length / 2) - Math.abs(b - words.length / 2));
    setText(signA, innerWidth <= 560 && gaps.length ? words.slice(0, gaps[0]) + "\n" + words.slice(gaps[0] + 1) : words);
    setText(signB, state.name.trim() || t("default_name"));
    fitAll();
  }

  function setOccasion(id) {
    state.occasion = id;
    document.documentElement.style.setProperty("--neon", occasion().color);
    drawSign(); write(signA, 0, 1); write(signB, 0.625, 1);
    renderOccasions(); renderLede(); updateMessage();
  }
  function toggle(label, on, click) {
    const b = el("button", { type: "button", className: "switch", textContent: label });
    b.setAttribute("aria-pressed", on);
    b.onclick = click;
    return b;
  }
  // Re-rendering replaces buttons, so put keyboard focus back on the same position.
  function fill(box, nodes) {
    const at = [...box.children].indexOf(document.activeElement);
    box.replaceChildren(...nodes);
    if (at > -1) box.children[at].focus({ preventScroll: true });
  }
  function renderOccasions() {
    fill($("#occasions"), S.occasions.map(o => toggle(t("o_" + o.id), o.id === state.occasion, () => setOccasion(o.id))));
  }
  $("#name").addEventListener("input", e => {
    state.name = e.target.value;
    signB.classList.remove("write", "dark"); // typing lights letters instantly
    drawSign(); renderLede(); updateMessage();
  });
  $("#name").addEventListener("keydown", e => { if (e.key === "Enter") e.target.blur(); });

  /* ---------- Lights on: scroll position switches on one spot at a time ---------- */
  const lights = $("#lights"), room = $("#room"), items = $$(".spots li");
  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = v => 1 - Math.pow(1 - v, 3);
  let queued = false;
  function drawLights() {
    queued = false;
    if (!lights.classList.contains("scrub")) return;
    const box = lights.getBoundingClientRect(), pinH = $(".pin").offsetHeight;
    const p = clamp((64 - box.top) / (box.height - pinH));
    const step = p * 5.2; // the last 0.2 holds the fully lit room
    const W = room.clientWidth, H = room.clientHeight, k = Math.max(W / 1036, H / 1844);
    const left = (W - 1036 * k) / 2, top = (H - 1844 * k) / 2; // matches object-fit: cover
    S.spots.forEach(([x, y, r], i) => {
      room.style.setProperty(`--x${i}`, left + x * 1036 * k + "px");
      room.style.setProperty(`--y${i}`, top + y * 1844 * k + "px");
      // The first spot is already part-lit on arrival, so the room is never just black.
      const on = ease(clamp(i === 0 ? 0.5 + step : (step - i) / 0.6));
      room.style.setProperty(`--r${i}`, Math.max(1, on * r * 1036 * k) + "px");
    });
    room.style.setProperty("--all", clamp((step - 4) / 0.6));
    const active = Math.min(4, Math.floor(step));
    items.forEach((li, i) => li.classList.toggle("on", i === active));
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(drawLights); } };
  function setScrub() {
    // Short landscape screens and reduced motion get the fully lit photo and a plain list.
    lights.classList.toggle("scrub", !reduced.matches && innerHeight > 520);
    queue();
  }
  addEventListener("scroll", queue, { passive: true });
  reduced.addEventListener("change", setScrub);

  /* ---------- Gallery ---------- */
  const strip = $("#strip"), light = $("#light"), tour = $(".tour", strip);
  function renderGallery() {
    strip.replaceChildren(tour, ...S.gallery.map(g => {
      const b = el("button", { type: "button", className: "shot" }, el("img", { src: g.src, alt: "", loading: "lazy" }), el("span", { textContent: t(g.key) }));
      b.onclick = () => { $("img", light).src = g.src; $("img", light).alt = t(g.key); $("p", light).textContent = t(g.key); light.showModal(); };
      return b;
    }));
  }
  const slide = dir => strip.scrollBy({ left: dir * strip.clientWidth * 0.7, behavior: reduced.matches ? "auto" : "smooth" });
  $("#left").onclick = () => slide(-1);
  $("#right").onclick = () => slide(1);
  light.addEventListener("click", e => { if (e.target.tagName !== "IMG") light.close(); });

  /* ---------- Google reviews carousel ---------- */
  const track = $("#revTrack"), slides = [...track.children], dots = $("#revDots");
  let slide0 = 0;
  const centre = n => n.offsetLeft + n.offsetWidth / 2;
  function showSlide(i) {
    const n = slides[(i + slides.length) % slides.length]; // wraps around at both ends
    track.scrollTo({ left: centre(n) - track.clientWidth / 2, behavior: reduced.matches ? "auto" : "smooth" });
  }
  dots.append(...slides.map((_, i) => {
    const b = el("button", { type: "button" });
    b.setAttribute("aria-label", `Show review card ${i + 1}`);
    b.onclick = () => showSlide(i);
    return b;
  }));
  function markSlide() {
    const mid = track.scrollLeft + track.clientWidth / 2;
    slide0 = slides.reduce((best, n, i) => Math.abs(centre(n) - mid) < Math.abs(centre(slides[best]) - mid) ? i : best, 0);
    slides.forEach((n, i) => n.classList.toggle("on", i === slide0));
    [...dots.children].forEach((d, i) => d.setAttribute("aria-current", i === slide0));
  }
  track.addEventListener("scroll", () => requestAnimationFrame(markSlide), { passive: true });
  addEventListener("resize", markSlide);
  $("#revPrev").onclick = () => showSlide(slide0 - 1);
  $("#revNext").onclick = () => showSlide(slide0 + 1);
  markSlide();

  /* ---------- Plans and add-ons ---------- */
  function setPack(id) { state.pack = id; state.guests = Math.min(state.guests, pack().guests); renderPlans(); renderParty(); }
  const goBooking = () => $("#booking").scrollIntoView();
  function renderPlans() {
    const focused = $$("#planGrid button").indexOf(document.activeElement);
    $("#planGrid").replaceChildren(...S.packages.map(p => {
      const on = p.id === state.pack;
      const b = el("button", { type: "button", className: "btn" + (on ? "" : " btn-ghost"), textContent: t(on ? "chosen" : "choose") });
      b.onclick = () => { if (on) goBooking(); else setPack(p.id); };
      return el("article", { className: "plan" + (on ? " on" : "") },
        el("p", { className: "price", textContent: rupees(p.price) }),
        el("p", { className: "meta", textContent: packMeta(p) }),
        el("ul", {}, ...p.features.map(f => el("li", { className: f === "led" ? "plus" : "", textContent: (f === "led" ? "+ " : "") + t("f_" + f) }))),
        b);
    }));
    if (focused > -1) $$("#planGrid button")[focused].focus({ preventScroll: true });
  }
  function renderAddons() {
    fill($("#addons"), S.addons.map(a => toggle(t("a_" + a), state.addons.has(a), () => {
      state.addons.delete(a) || state.addons.add(a); renderAddons(); updateMessage();
    })));
  }

  /* ---------- Booking, in three steps ---------- */
  const error = $("#error"), dateInput = $("#date");
  dateInput.min = iso(today); dateInput.max = iso(lastDay);
  const validDate = () => state.date && state.date >= today && state.date <= lastDay;

  function renderLede() {
    const name = state.name.trim(), box = $("#bkLede");
    const parts = t(name ? "bk_lede" : "bk_lede_none").split(/(\{name\}|\{occasion\})/);
    box.replaceChildren(...parts.map(part =>
      part === "{name}" ? el("b", { textContent: name }) : part === "{occasion}" ? el("b", { textContent: t("o_" + state.occasion) }) : part));
  }
  function renderDays() {
    fill($("#days"), Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const b = el("button", { type: "button", className: "day" },
        el("small", { textContent: d.toLocaleDateString(locale(), { weekday: "short" }) }),
        el("b", { textContent: d.getDate() }),
        el("small", { textContent: d.toLocaleDateString(locale(), { month: "short" }) }));
      b.setAttribute("aria-pressed", !!state.date && +d === +state.date);
      b.setAttribute("aria-label", d.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" }));
      b.onclick = () => { state.date = d; dateInput.value = iso(d); error.textContent = ""; renderDays(); updateMessage(); };
      return b;
    }));
  }
  dateInput.addEventListener("change", () => { state.date = parse(dateInput.value); error.textContent = ""; renderDays(); updateMessage(); });

  function renderParty() {
    fill($("#formPlans"), S.packages.map(p => toggle(`${rupees(p.price)} · ${packMeta(p)}`, p.id === state.pack, () => setPack(p.id))));
    $("#guests").textContent = state.guests;
    $("#max").textContent = t("max", { n: pack().guests });
    $("#minus").disabled = state.guests <= 1;
    $("#plus").disabled = state.guests >= pack().guests;
    updateMessage();
  }
  $("#minus").onclick = () => { state.guests--; renderParty(); };
  $("#plus").onclick = () => { state.guests++; renderParty(); };

  // The message is always in English so the team gets a consistent format.
  function updateMessage() {
    const p = pack(), you = $("#you").value.trim(), time = $("#time").value, notes = $("#notes").value.trim();
    $("#msg").textContent = [
      "Hello Olympia Celebration,",
      "I would like to enquire about the private party room.",
      `Occasion: ${t("o_" + state.occasion, {}, 0)}`,
      state.name.trim() && `Celebrating: ${state.name.trim()}`,
      you && `My name: ${you}`,
      `Date: ${state.date ? state.date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "(not selected)"}`,
      time && `Start time: ${time}`,
      `Package: ${rupees(p.price)} / ${p.hours} hour${p.hours > 1 ? "s" : ""}`,
      `Guests: ${state.guests}`,
      state.addons.size && `Add-ons: ${[...state.addons].map(a => t("a_" + a, {}, 0)).join(", ")}`,
      notes && `Notes: ${notes}`,
      "Is this slot available? Please confirm the rate."
    ].filter(Boolean).join("\n");
  }
  ["#you", "#time", "#notes"].forEach(s => $(s).addEventListener("input", updateMessage));

  function showStep(n) {
    if (n > 0 && !validDate()) { n = 0; error.textContent = t("err_date"); } else error.textContent = "";
    state.step = n;
    $$(".step").forEach(s => { s.hidden = +s.dataset.step !== n; });
    $$(".progress button").forEach((b, i) => {
      b.classList.toggle("done", i <= n);
      if (i === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    $("#back").hidden = n === 0;
    $("#go").textContent = t(n === 2 ? "send" : "next");
    updateMessage();
  }
  $$(".progress button").forEach(b => { b.onclick = () => showStep(+b.dataset.go); });
  $("#back").onclick = () => showStep(state.step - 1);
  $("#form").addEventListener("submit", e => {
    e.preventDefault();
    if (state.step < 2 || !validDate()) { showStep(Math.min(2, state.step + 1)); return; }
    window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent($("#msg").textContent)}`, "_blank", "noopener");
  });

  /* ---------- Language ---------- */
  function applyLang(i) {
    lang = i; store.set(i);
    document.documentElement.lang = ["en", "hi-Latn", "gu"][i];
    $$("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
    $$("[data-i18n-ph]").forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
    $$(".langs button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.lang === i));
    drawSign(); renderOccasions(); renderGallery(); renderPlans(); renderAddons(); renderLede(); renderDays(); renderParty(); showStep(state.step);
    queue();
  }
  $$(".langs button").forEach(b => { b.onclick = () => applyLang(+b.dataset.lang); });

  /* ---------- Start ---------- */
  applyLang(lang);
  setScrub();
  let width = innerWidth;
  addEventListener("resize", () => {
    setScrub();
    // Phone address bars change the height while scrolling; only refit the sign when the width changes.
    if (innerWidth !== width) { width = innerWidth; drawSign(); }
  });
  window.ready = true;

  // Opening: the sign writes itself once its font has arrived (or after 1.2 s at the latest).
  const signTubes = [signA, signB], closing = $$(".neon.small .tube");
  [...signTubes, ...closing].forEach(n => n.classList.add("dark"));
  const fonts = document.fonts ? document.fonts.load('100px "Sacramento"') : Promise.resolve();
  Promise.race([fonts.catch(() => {}), new Promise(r => setTimeout(r, 1200))]).then(() => {
    fitAll(); write(signA, 0.125, 1); write(signB, 0.875, 1);
    document.fonts && document.fonts.ready.then(fitAll);
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { write(closing[0], 0, 1); write(closing[1], 0.75, 1); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe($(".neon.small"));
  } else closing.forEach(n => n.classList.remove("dark"));
})();
