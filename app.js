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
  const fan = $(".fan"), cards = $$(".fan .tcard"), msg = $(".draw-msg"), more = $(".draw-more");
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
  if (plansEl) plansEl.innerHTML = C.plans.filter(p => p.home !== false).map(p => `
    <article class="plan">
      <div class="spread" aria-hidden="true">${"<i></i>".repeat(p.questions)}</div>
      <h3>${p.name}</h3>
      <p class="meta">${qWord(p.questions)}</p>
      <p>${p.blurb}</p>
      ${p.was && C.offerLabel ? `<span class="offer">${C.offerLabel}</span>` : ""}
      <div class="price">${was(p)}${fmt(p.price)}</div>
      <a class="btn btn-gold" href="book.html?plan=${p.id}">Book ${p.name}</a>
    </article>`).join("");

  /* ---------- yes/no wheel (home) ---------- */
  const wheelSvg = $("#wheel");
  if (wheelSvg) {
    const YN = {
      yes: { label: "Yes", answer: "Yes.", cards: [
        { name: "The Sun", num: "XIX", glyph: "☀︎", tint: "#ffc35a", msg: "The energy around this is bright and open. Move toward it with confidence." },
        { name: "The Star", num: "XVII", glyph: "★", tint: "#8cc8ff", msg: "Hope is well placed here. Things are quietly lining up in your favour." },
        { name: "The World", num: "XXI", glyph: "❂", tint: "#8de0b4", msg: "This one comes full circle. Trust that it's moving toward completion." },
        { name: "The Magician", num: "I", glyph: "✦", tint: "#ffd27a", msg: "You have what it takes to make this happen. Take the first step." } ] },
      no: { label: "No", answer: "No, not like this.", cards: [
        { name: "The Tower", num: "XVI", glyph: "⚡︎", tint: "#ff8a4c", msg: "Something needs to shift before this can work. Don't force it." },
        { name: "Five of Cups", num: "CUPS", glyph: "☁︎", tint: "#9fb3ff", msg: "This path holds more disappointment than joy right now. Look at what's still standing." },
        { name: "Eight of Swords", num: "SWORDS", glyph: "⚔︎", tint: "#d0c4ff", msg: "Not this way. You have more choices than it feels like. Step back and look again." } ] },
      wait: { label: "Not yet", answer: "Not yet.", cards: [
        { name: "The Moon", num: "XVIII", glyph: "☾", tint: "#b6c0ff", msg: "It's not clear yet. Wait for more information before you decide." },
        { name: "The Hanged Man", num: "XII", glyph: "◐", tint: "#c9a8ff", msg: "Pause. Seeing this from a new angle will give you your answer." },
        { name: "Wheel of Fortune", num: "X", glyph: "☸︎", tint: "#e6b8ff", msg: "The timing is still turning. Ask again when things settle." } ] }
    };
    const SEG = ["yes", "no", "wait", "yes", "no", "yes", "wait", "no"];
    const N = SEG.length, step = 360 / N;
    const fill = { yes: "#efc27a", no: "#3b1f64", wait: "#6a3f9e" };
    const ink = { yes: "#120922", no: "#f5ecdd", wait: "#f5ecdd" };
    const pt = (deg, r) => { const t = (deg - 90) * Math.PI / 180; return [(r * Math.cos(t)).toFixed(2), (r * Math.sin(t)).toFixed(2)]; };
    wheelSvg.innerHTML = SEG.map((k, i) => {
      const a0 = i * step, a1 = a0 + step, [x0, y0] = pt(a0, 100), [x1, y1] = pt(a1, 100), [tx, ty] = pt(a0 + step / 2, 66);
      return `<path d="M0 0 L${x0} ${y0} A100 100 0 0 1 ${x1} ${y1} Z" fill="${fill[k]}" stroke="#efc27a" stroke-width="1.2"/>
        <text x="${tx}" y="${ty}" fill="${ink[k]}" font-size="${k === "wait" ? 11 : 13}" font-family="Poppins, sans-serif" font-weight="600"
          text-anchor="middle" dominant-baseline="middle" transform="rotate(${a0 + step / 2} ${tx} ${ty})">${YN[k].label}</text>`;
    }).join("") + `<circle r="104" fill="none" stroke="#efc27a" stroke-width="3"/>` +
      Array.from({ length: N }, (_, i) => { const [x, y] = pt(i * step, 104); return `<circle cx="${x}" cy="${y}" r="2.6" fill="#ffe2a8"/>`; }).join("");

    const ynForm = $("#ynForm"), q = $("#ynQ"), btn = $("#ynSpin"), res = $("#ynResult"), card = $(".yn-card"), err = $("#ynErr");
    const yesnoPlan = C.plans.find(p => p.id === "yesno");
    if (yesnoPlan) $("#ynPrice").textContent = fmt(yesnoPlan.price);
    let angle = 0, spinning = false;
    ynForm.addEventListener("submit", e => {
      e.preventDefault();
      if (spinning) return;
      const question = q.value.trim();
      if (!question) { err.hidden = false; q.focus(); return; }
      err.hidden = true;
      // draw a card uniformly, then land on a segment that matches its answer
      const all = Object.entries(YN).flatMap(([k, g]) => g.cards.map(c => ({ k, c })));
      const pick = all[Math.floor(Math.random() * all.length)];
      const slots = SEG.map((k, i) => (k === pick.k ? i : -1)).filter(i => i >= 0);
      const slot = slots[Math.floor(Math.random() * slots.length)];
      const jitter = (Math.random() - 0.5) * step * 0.6;
      const target = 360 - (slot * step + step / 2) + jitter;          // segment centre under the top pointer
      angle = angle - (angle % 360) + 360 * 5 + target;
      spinning = true; btn.disabled = true; res.hidden = true; card.classList.remove("is-chosen");
      wheelSvg.style.transition = reduceMotion ? "none" : "transform 4.2s cubic-bezier(.12,.7,.16,1)";
      wheelSvg.style.transform = `rotate(${angle}deg)`;
      setTimeout(() => {
        const f = $("#ynFront");
        f.style.setProperty("--tint", pick.c.tint);
        f.innerHTML = `<span class="num">${pick.c.num}</span><span class="glyph" aria-hidden="true">${pick.c.glyph}</span><span class="name">${pick.c.name}</span>`;
        $("#ynAsked").textContent = `“${question}”`;
        $("#ynAnswer").innerHTML = `<span>${pick.c.name}</span> ${YN[pick.k].answer}`;
        $("#ynMsg").textContent = pick.c.msg;
        $("#ynBook").href = `book.html?plan=yesno&q=${encodeURIComponent(question)}`;
        res.hidden = false; res.classList.add("is-shown");
        requestAnimationFrame(() => card.classList.add("is-chosen"));
        if (window.innerWidth < 900) res.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        spinning = false; btn.disabled = false; btn.textContent = "Spin again";
      }, reduceMotion ? 50 : 4300);
    });
    $("#ynAgain").addEventListener("click", () => {
      res.hidden = true; card.classList.remove("is-chosen"); q.value = ""; btn.textContent = "Spin the wheel"; q.focus();
    });
  }

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

  const params = new URLSearchParams(location.search);
  const wanted = params.get("plan");
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
  if (params.get("q")) saved.q1 = params.get("q").slice(0, 300);
  function buildQuestions() {
    $$("textarea", qBox).forEach(t => (saved[t.name] = t.value));
    const n = plan().questions, isYN = plan().id === "yesno";
    $("#qCountWord").textContent = isYN ? "yes/no question" : n === 1 ? "question" : `${n} questions`;
    const hint = $("#qHint");
    if (hint) hint.textContent = isYN
      ? "Ask one clear yes/no question. You'll get the card drawn, the answer, and what it means for you."
      : 'Open questions get the richest answers. Try "What do I need to know about…" rather than yes/no.';
    qBox.innerHTML = Array.from({ length: n }, (_, i) => `
      <label class="field"><span class="lab">${n === 1 ? "Your question" : `Question ${i + 1}`}${i > 0 && n === 5 ? " <em>optional</em>" : ""}</span>
        <textarea name="q${i + 1}" rows="3" ${i === 0 || n === 2 ? "required" : ""}
          placeholder="${isYN ? "Should I… ? Will… ? Is it the right time to… ?" : ["What do I need to know about…", "What energy surrounds…", "How can I move forward with…", "What is blocking me from…", "What should I focus on in…"][i]}">${esc(saved["q" + (i + 1)] || "")}</textarea>
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
