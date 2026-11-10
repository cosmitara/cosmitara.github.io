(function () {
  "use strict";
  const C = window.COSMITARA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const configured = (v, placeholder) => v && !String(v).startsWith(placeholder);

  /* ---------- links & settings ---------- */
  $$("[data-instagram]").forEach(a => (a.href = C.instagram));
  $$("[data-youtube]").forEach(a => (a.href = C.youtube));
  $$("[data-email]").forEach(a => (a.href = "mailto:" + C.email));
  $$("[data-delivery]").forEach(s => (s.textContent = C.deliveryTime));
  $("#year").textContent = new Date().getFullYear();
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const fmt = n => "₹" + n;
  const was = p => (p.was ? `<s class="was" aria-label="Regular price ${fmt(p.was)}">${fmt(p.was)}</s> ` : "");
  const qWord = n => (n === 1 ? "1 question" : `${n} questions`);

  /* ---------- starfield ---------- */
  const sky = $("#sky"), ctx = sky.getContext("2d");
  let stars = [];
  function sizeSky() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sky.width = innerWidth * dpr; sky.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((innerWidth * innerHeight) / 5200);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() ** 3 * 1.6 + 0.3, p: Math.random() * 6.28, s: 0.6 + Math.random() * 1.4,
      gold: Math.random() < 0.12
    }));
  }
  function drawSky(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const st of stars) {
      const a = reduceMotion ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(st.p + t * 0.001 * st.s));
      ctx.fillStyle = st.gold ? `rgba(239,194,122,${a})` : `rgba(245,236,221,${a * 0.85})`;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(drawSky);
  }
  sizeSky(); addEventListener("resize", sizeSky); requestAnimationFrame(drawSky);

  /* ---------- card of the day ---------- */
  const DECK = [
    { name: "The Star", num: "XVII", glyph: "★", tint: "#8cc8ff", msg: "Healing is already happening, even if you can't feel it yet." },
    { name: "The Sun", num: "XIX", glyph: "☀︎", tint: "#ffc35a", msg: "Joy is closer than it looks. Let yourself enjoy today." },
    { name: "The Moon", num: "XVIII", glyph: "☾", tint: "#b6c0ff", msg: "Trust what you feel, even before you can explain it." },
    { name: "Strength", num: "VIII", glyph: "∞", tint: "#ff9e59", msg: "Your softness is not weakness. It's your power." },
    { name: "The Empress", num: "III", glyph: "♀︎", tint: "#ffa3c4", msg: "Stop chasing. What's meant for you is learning your name." },
    { name: "The Hermit", num: "IX", glyph: "✧", tint: "#e8d6a0", msg: "A quiet pause today will give you the answer you're looking for." },
    { name: "The Lovers", num: "VI", glyph: "♡", tint: "#ff8fb0", msg: "Choose from the heart. It already knows the way." },
    { name: "Temperance", num: "XIV", glyph: "⚗︎", tint: "#9ad8ff", msg: "Slow and steady. Balance comes back when you stop rushing." },
    { name: "The World", num: "XXI", glyph: "❂", tint: "#8de0b4", msg: "A chapter is closing beautifully. Make room for the next one." },
    { name: "The Magician", num: "I", glyph: "✦", tint: "#ffd27a", msg: "You already have everything you need to begin." },
    { name: "Wheel of Fortune", num: "X", glyph: "☸︎", tint: "#c9a8ff", msg: "Life is turning. Stay open to the surprise in it." },
    { name: "The High Priestess", num: "II", glyph: "☽", tint: "#a9b7ff", msg: "The answer is inside you. Listen before you ask anyone else." }
  ];
  if ($(".fan")) {
  const fan = $(".fan"), cards = $$(".tcard"), msg = $(".draw-msg"), more = $(".draw-more");
  let hand = [];
  function deal() {
    hand = DECK.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    cards.forEach((b, i) => {
      const c = hand[i], f = $(".front", b);
      f.style.setProperty("--tint", c.tint);
      f.innerHTML = `<span class="num">${c.num}</span><span class="glyph" aria-hidden="true">${c.glyph}</span><span class="name">${c.name}</span>`;
      b.classList.remove("is-chosen"); b.disabled = false; b.removeAttribute("aria-disabled");
    });
    fan.classList.remove("is-drawn"); msg.textContent = ""; more.hidden = true;
  }
  cards.forEach(b => b.addEventListener("click", () => {
    if (fan.classList.contains("is-drawn")) return;
    const c = hand[+b.dataset.i];
    fan.classList.add("is-drawn"); b.classList.add("is-chosen");
    cards.forEach(x => { if (x !== b) x.setAttribute("aria-disabled", "true"); });
    setTimeout(() => {
      msg.innerHTML = `<span class="card-name">${c.name}.</span> ${c.msg}`;
      more.hidden = false;
    }, reduceMotion ? 0 : 650);
  }));
  $("#reshuffle").addEventListener("click", deal);
  deal();
  }

  /* ---------- reading plans (home) ---------- */
  const plansEl = $("#plans");
  if (plansEl) plansEl.innerHTML = C.plans.map(p => `
    <article class="plan">
      <div class="spread" aria-hidden="true">${"<i></i>".repeat(p.questions)}</div>
      <h3>${p.name}</h3>
      <p class="meta">${qWord(p.questions)}</p>
      <p>${p.blurb}</p>
      ${p.was && C.offerLabel ? `<span class="offer">${C.offerLabel}</span>` : ""}
      <div class="price">${was(p)}${fmt(p.price)}</div>
      <a class="btn btn-gold" href="book.html?plan=${p.id}">Book ${p.name}</a>
    </article>`).join("");

  /* ---------- reviews (home) ---------- */
  const reviewEl = $("#reviewList");
  if (reviewEl) {
    const list = (C.reviews || []).filter(r => r && r.text);
    reviewEl.innerHTML = list.length
      ? list.map(r => {
          const n = Math.max(1, Math.min(5, r.stars || 5));
          return `<figure class="review">
            <p class="stars" aria-label="${n} out of 5 stars">${"★".repeat(n)}${"☆".repeat(5 - n)}</p>
            <blockquote>${esc(r.text)}</blockquote>
            <figcaption>${esc(r.name || "Anonymous")}${r.reading ? ` · <span>${esc(r.reading)}</span>` : ""}</figcaption>
          </figure>`;
        }).join("")
      : `<div class="review-empty">
          <p>Cosmitara is new, and the first reviews are on their way. Had a reading? Your words help the next person decide.</p>
          <a class="btn btn-ghost" href="${C.instagram}" target="_blank" rel="noopener">Share your experience on Instagram</a>
        </div>`;
  }

  /* ---------- booking page ---------- */
  const form = $("#readingForm");
  if (!form) return;
  $("#upiId").textContent = C.upiId;
  if (C.googleFormUrl) { $("#altForm").hidden = false; $("#gformLink").href = C.googleFormUrl; }

  const wanted = new URLSearchParams(location.search).get("plan");
  const startId = C.plans.some(p => p.id === wanted) ? wanted : C.plans[0].id;
  const pick = $("#planPick");
  pick.innerHTML = C.plans.map(p => `
    <label class="plan-opt">
      <input type="radio" name="plan" value="${p.id}" ${p.id === startId ? "checked" : ""}>
      <span class="dot" aria-hidden="true"></span>
      <span><b>${p.name}</b><span class="sub">${qWord(p.questions)}</span></span>
      <span class="amt">${was(p)}${fmt(p.price)}</span>
    </label>`).join("");
  const plan = () => C.plans.find(p => p.id === (form.querySelector('input[name="plan"]:checked') || {}).value) || C.plans[0];
  function showChosen() {
    const p = plan();
    $("#chosenName").textContent = p.name;
    $("#chosenMeta").textContent = qWord(p.questions);
    $("#chosenPrice").innerHTML = was(p) + fmt(p.price);
  }
  const changeBtn = $("#changePlan");
  changeBtn.addEventListener("click", () => {
    const open = pick.hidden;
    pick.hidden = !open; changeBtn.setAttribute("aria-expanded", String(open));
    changeBtn.textContent = open ? "Done" : "Change";
  });
  pick.addEventListener("change", () => {
    showChosen();
    if (step === 2) buildQuestions();
    if (step === 3) buildPay();
    pick.hidden = true; changeBtn.setAttribute("aria-expanded", "false"); changeBtn.textContent = "Change";
  });

  /* ---------- questions ---------- */
  const qBox = $("#questions");
  const saved = {};
  function buildQuestions() {
    $$("textarea", qBox).forEach(t => (saved[t.name] = t.value));
    const n = plan().questions;
    $("#qCountWord").textContent = n === 1 ? "question" : `${n} questions`;
    qBox.innerHTML = Array.from({ length: n }, (_, i) => `
      <label class="field"><span class="lab">${n === 1 ? "Your question" : `Question ${i + 1}`}${i > 0 && n === 5 ? " <em>optional</em>" : ""}</span>
        <textarea name="q${i + 1}" rows="3" ${i === 0 || n === 2 ? "required" : ""}
          placeholder="${["What do I need to know about…", "What energy surrounds…", "How can I move forward with…", "What is blocking me from…", "What should I focus on in…"][i]}">${saved["q" + (i + 1)] || ""}</textarea>
      </label>`).join("");
  }

  /* ---------- payment ---------- */
  function upiUrl() {
    const p = plan();
    const q = new URLSearchParams({ pa: C.upiId, pn: C.payeeName, am: p.price.toFixed(2), cu: "INR", tn: `Cosmitara ${p.name}` });
    return "upi://pay?" + q.toString().replace(/\+/g, "%20");
  }
  function buildPay() {
    const p = plan();
    $("#payPlan").textContent = p.name;
    $("#payPrice").textContent = fmt(p.price);
    $("#upiLink").href = upiUrl();
    const box = $("#qr"); box.innerHTML = "";
    if (window.CosmiQR) {
      const cv = document.createElement("canvas");
      window.CosmiQR(upiUrl(), cv, 400);
      box.appendChild(cv);
    } else {
      box.textContent = "QR unavailable. Pay to the UPI ID shown.";
    }
  }
  $("#copyUpi").addEventListener("click", async e => {
    try { await navigator.clipboard.writeText(C.upiId); e.target.textContent = "Copied"; }
    catch { e.target.textContent = "Select and copy"; }
    setTimeout(() => (e.target.textContent = "Copy"), 2000);
  });

  /* ---------- steps ---------- */
  let step = 1;
  showChosen();
  const steps = $$(".step"), dots = $$(".progress li");
  function go(n) {
    step = n;
    if (n === 2) buildQuestions();
    if (n === 3) buildPay();
    steps.forEach(s => s.classList.toggle("is-active", +s.dataset.step === n));
    dots.forEach(d => {
      const k = +d.dataset.stepDot;
      d.classList.toggle("is-active", k === n); d.classList.toggle("is-done", k < n);
      if (k === n) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current");
    });
    const active = steps[n - 1];
    const first = active.querySelector("input:not([type=radio]), select, textarea");
    if (first) first.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function setErr(el, text) {
    const wrap = el.closest(".field") || el.closest(".consent");
    if (!wrap) return;
    wrap.classList.toggle("is-invalid", !!text);
    let e = wrap.querySelector(".err");
    if (text && wrap.classList.contains("field")) {
      if (!e) { e = document.createElement("span"); e.className = "err"; wrap.appendChild(e); }
      e.textContent = text;
    } else if (e) e.remove();
    el.setAttribute("aria-invalid", text ? "true" : "false");
  }
  function message(el) {
    const v = el.value.trim();
    if (el.type === "checkbox") return el.checked ? "" : "Please confirm to continue.";
    if (el.required && !v) {
      if (el.name === "utr") return "Enter the transaction ID from your UPI app.";
      if (el.tagName === "SELECT") return "Choose an option.";
      return "This one's needed.";
    }
    if (el.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter an email like name@gmail.com.";
    if (el.name === "dob" && v && new Date(v) > new Date()) return "Date of birth can't be in the future.";
    if (el.name === "utr" && v && !/^[A-Za-z0-9]{8,22}$/.test(v.replace(/\s/g, ""))) return "That doesn't look like a UPI reference. It's usually 12 digits.";
    return "";
  }
  function validStep(n) {
    let ok = true, firstBad = null;
    $$("input, select, textarea", steps[n - 1]).forEach(el => {
      if (el.type === "radio" || el.classList.contains("hp")) return;
      const m = message(el);
      setErr(el, m);
      if (m && ok) { ok = false; firstBad = el; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }
  form.addEventListener("input", e => { if (e.target.getAttribute("aria-invalid") === "true") setErr(e.target, message(e.target)); });
  form.addEventListener("change", e => {
    if (e.target.name === "focus") $("#partner").hidden = e.target.value !== "Love & relationships";
  });
  $$("[data-next]").forEach(b => b.addEventListener("click", () => { if (validStep(step)) go(step + 1); }));
  $$("[data-back]").forEach(b => b.addEventListener("click", () => go(step - 1)));

  /* ---------- submit ---------- */
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validStep(3)) return;
    const err = $("#formError"); err.hidden = true;
    if (!configured(C.web3formsKey, "YOUR_")) {
      err.textContent = "This form isn't connected yet. Add your Web3Forms key in config.js, or message Cosmitara on Instagram.";
      err.hidden = false; return;
    }
    const p = plan(), fd = new FormData(form);
    const data = {
      access_key: C.web3formsKey,
      subject: `New reading: ${p.name} (${fmt(p.price)}) from ${fd.get("name")}`,
      from_name: "Cosmitara website",
      replyto: fd.get("email"),
      botcheck: fd.get("botcheck") ? true : "",
      "Reading": `${p.name} · ${fmt(p.price)}`,
      "Name": fd.get("name"), "Email": fd.get("email"), "Instagram": fd.get("instagram") || "-",
      "Date of birth": fd.get("dob"), "Time of birth": fd.get("birth_time") || "-", "Place of birth": fd.get("birth_place") || "-",
      "Topic": fd.get("focus"), "Deliver by": fd.get("delivery"),
      "Other person": [fd.get("partner_name"), fd.get("partner_dob")].filter(Boolean).join(", ") || "-"
    };
    for (let i = 1; i <= p.questions; i++) { const q = (fd.get("q" + i) || "").trim(); if (q) data[`Question ${i}`] = q; }
    data["Extra context"] = fd.get("context") || "-";
    data["UPI transaction ID"] = fd.get("utr").replace(/\s/g, "");
    const btn = $("#sendBtn"); btn.disabled = true; btn.textContent = "Sending…";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data)
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === false) throw new Error(out.message || res.status);
      steps.forEach(s => s.classList.remove("is-active"));
      $(".progress").hidden = true; $("#chosen").hidden = true; pick.hidden = true;
      const done = $("#done"); done.hidden = false; done.focus();
    } catch (x) {
      err.textContent = "Your request didn't go through. Check your connection and try again, or send it on Instagram.";
      err.hidden = false;
    } finally { btn.disabled = false; btn.textContent = "Send my request"; }
  });
})();
