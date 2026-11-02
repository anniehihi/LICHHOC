"use strict";

/* =====================================================================
   Hình minh hoạ nhỏ (nhìn từ bên cạnh) để người mới hiểu cách cầm máy
   ===================================================================== */
const DG = {
  flat: `<svg viewBox="0 0 140 90"><rect class="ph" x="40" y="14" width="60" height="7" rx="3"/>
    <path class="ar" d="M70 28v22M63 43l7 8 7-8"/>
    <path class="ln" d="M10 78h120"/><path class="fd" d="M42 78c0-14 12-20 28-20s28 6 28 20z"/>
    <text class="tx" x="70" y="9" text-anchor="middle">máy nằm phẳng</text></svg>`,
  angle: `<svg viewBox="0 0 140 90"><g transform="rotate(-40 40 30)"><rect class="ph" x="22" y="26" width="46" height="7" rx="3"/></g>
    <path class="ar" d="M62 40l22 14M80 46l6 10-11 2"/>
    <path class="ln" d="M10 78h120"/><path class="fd" d="M70 78c0-12 10-18 24-18s24 6 24 18z"/>
    <text class="tx" x="70" y="12" text-anchor="middle">nghiêng ~45°</text></svg>`,
  upright: `<svg viewBox="0 0 140 90"><rect class="ph" x="30" y="10" width="7" height="58" rx="3"/>
    <path class="ar" d="M46 40h30M69 33l8 7-8 7"/>
    <path class="ln" d="M10 78h120"/><rect class="fd" x="92" y="40" width="30" height="38" rx="3"/>
    <text class="tx" x="70" y="87" text-anchor="middle">máy dựng thẳng</text></svg>`,
  frame: `<svg viewBox="0 0 140 90"><rect class="ln" x="30" y="6" width="80" height="78" rx="6"/>
    <circle class="fd" cx="70" cy="45" r="26"/><path class="ar" d="M30 6l10 10M110 6l-10 10M30 84l10-10M110 84l-10-10"/></svg>`,
  light: `<svg viewBox="0 0 140 90"><rect class="ln" x="10" y="10" width="34" height="46" rx="3"/>
    <path class="ln" d="M27 10v46M10 33h34"/><path class="ar" d="M50 28l22 8M50 38l22 4"/>
    <path class="ln" d="M10 80h120"/><path class="fd" d="M82 80c0-12 10-18 24-18s24 6 24 18z"/>
    <text class="tx" x="27" y="68" text-anchor="middle">cửa sổ</text></svg>`,
  steady: `<svg viewBox="0 0 140 90"><rect class="ph" x="52" y="14" width="36" height="60" rx="6"/>
    <path class="ln" d="M36 30c-6 10-6 20 0 30M104 30c6 10 6 20 0 30"/></svg>`,
};

/* =====================================================================
   Các bước kiểm tra tự động dùng cảm biến + phân tích hình ảnh
   m = {bright, sharp, backlit, warm}   o = {beta, gamma, roll} hoặc null
   ===================================================================== */
const CHECK = {
  light: (m) => {
    if (m.bright < 55) return { ok: false, msg: "🌑 Còn tối. Dịch món ra sát cửa sổ / cửa quán, hoặc chỗ có đèn trắng." };
    if (m.bright > 205) return { ok: false, msg: "☀️ Quá chói. Tránh nắng gắt chiếu thẳng vào món, lùi vào bóng râm." };
    if (m.backlit) return { ok: false, msg: "🔦 Ngược sáng. Xoay người/xoay món để ánh sáng chiếu vào món, không chiếu thẳng vào camera." };
    return { ok: true, note: m.warm ? "Hơi ngả vàng do đèn quán – được, nhưng gần cửa sổ sẽ đẹp hơn." : "" };
  },
  flat: (m, o) => {
    if (!o) return { manual: true };
    const off = Math.round(Math.hypot(o.beta, o.gamma));
    return off < 10 ? { ok: true } : { ok: false, msg: `📱 Máy đang nghiêng ${off}°. Hạ đầu máy xuống cho mặt máy nằm phẳng (về 0°).` };
  },
  angle: (m, o) => {
    if (!o) return { manual: true };
    if (Math.abs(o.gamma) > 15) return { ok: false, msg: "↔️ Máy bị lệch trái/phải. Giữ máy cân hai bên." };
    if (o.beta > 65) return { ok: false, msg: `📱 Đang dựng quá thẳng (${Math.round(o.beta)}°). Cúi đầu máy xuống thêm một chút.` };
    if (o.beta < 25) return { ok: false, msg: `📱 Đang cúi quá (${Math.round(o.beta)}°). Dựng máy lên một chút.` };
    return { ok: true };
  },
  upright: (m, o) => {
    if (!o) return { manual: true };
    if (Math.abs(o.roll) > 3) return { ok: false, msg: `📐 Máy bị nghiêng ${Math.round(Math.abs(o.roll))}°. Xoay cho đường kẻ giữa màn hình thành màu xanh.` };
    if (o.beta < 78 || o.beta > 102) return { ok: false, msg: "📱 Máy đang ngửa/cúi. Dựng máy thẳng đứng, đừng ngước lên hay cúi xuống." };
    return { ok: true };
  },
  steady: (m) => m.sharp >= 6 ? { ok: true } : { ok: false, msg: "🤚 Hình đang mờ/rung. Hai tay giữ chắc, thở đều. Nếu vẫn mờ, lau ống kính bằng góc áo." },
};

const S = {
  light: (what) => ({ title: "Đủ ánh sáng", desc: `Hướng camera về ${what}. Chờ khung này viền xanh.`, diagram: "light", check: "light" }),
  flat: (what) => ({ title: "Giơ máy phía trên", desc: `Giơ máy lên trên ${what}, mặt máy hướng xuống, nằm phẳng song song mặt bàn.`, diagram: "flat", check: "flat" }),
  angle: (what) => ({ title: "Nghiêng máy 45°", desc: `Đứng sát mép bàn, nghiêng máy như đang nhìn xuống ${what} theo góc chéo.`, diagram: "angle", check: "angle" }),
  upright: (what) => ({ title: "Giữ máy thẳng", desc: `Dựng máy thẳng đứng, ngang tầm ${what}.`, diagram: "upright", check: "upright" }),
  frame: (title, desc) => ({ title, desc, diagram: "frame", manual: true }),
  steady: () => ({ title: "Giữ yên 2 giây", desc: "Hai khuỷu tay ép sát người, giữ máy thật yên.", diagram: "steady", check: "steady" }),
  shoot: (desc) => ({ title: "CHỤP NGAY!", desc, shoot: true }),
};

/* Tạo danh sách bước cho một góc chụp */
function stepsFor(m, ang) {
  const st = [S.light(m.subject)];
  if (ang.tilt && ang.tilt !== "none") st.push(S[ang.tilt](m.subject));
  st.push({ title: ang.frameTitle, desc: ang.frameDesc, diagram: "sample", manual: true });
  st.push(S.steady());
  st.push(S.shoot(ang.shoot));
  return st;
}

/* Ảnh mẫu: dùng ảnh thật trong samples/ nếu có, không thì dùng hình minh hoạ */
function sampleHTML(modeKey, ang) {
  const id = modeKey + "-" + ang.key;
  return `<div class="sample"><svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice">${SM[id] || ""}</svg>` +
    `<img src="samples/${id}.jpg" alt="" onload="this.parentNode.classList.add('photo')"><span class="tag">minh hoạ</span></div>`;
}

/* ====== DOM & trạng thái ====== */
const $ = id => document.getElementById(id);
const video = $("video"), gridCv = $("grid"), guide = $("guide");
const screens = ["home", "prep", "angles", "camera", "review", "gallery", "list"];
let mode = null, modeKey = null, angle = null, steps = [], doneAngles = {}, seenPrep = {}, facing = "environment", stream = null;
let showGrid = true, timer = 0, analyzeInterval = null;
let orient = null, shots = [];
let metrics = { bright: 128, sharp: 99, backlit: false, warm: false };
let stepState = [], curStep = 0, curSince = 0, prepIdx = 0;
const safe = (fn, d) => { try { return fn(); } catch { return d; } };
function show(id) { screens.forEach(s => $(s).classList.toggle("active", s === id)); }

/* ====== Màn hình chính ====== */
$("modes").innerHTML = Object.entries(MODES).map(([k, m]) =>
  `<button class="mode" data-k="${k}"><span class="ico">${m.icon}</span><b>${m.name}</b><small>${m.desc} · ${m.angles.length} góc</small></button>`).join("");
$("modes").addEventListener("click", e => { const b = e.target.closest(".mode"); if (b) openMode(b.dataset.k); });
$("openGallery").onclick = () => { renderGallery(); show("gallery"); };
$("galleryBack").onclick = () => show("home");

/* ====== Chuẩn bị (thẻ từng bước) ====== */
function openMode(k) {
  modeKey = k; mode = MODES[k];
  if (seenPrep[k]) openAngles(); else openPrep();
}
function openPrep() {
  prepIdx = 0;
  $("prepTitle").textContent = mode.name;
  renderPrep(); show("prep");
}
function renderPrep() {
  const c = mode.prep[prepIdx], last = prepIdx === mode.prep.length - 1;
  $("prepIcon").textContent = c.icon;
  $("prepHead").textContent = c.head;
  $("prepText").textContent = c.text;
  $("prepDiagram").innerHTML = c.dg ? DG[c.dg] : "";
  $("prepDots").innerHTML = mode.prep.map((_, i) => `<i class="${i === prepIdx ? "on" : i < prepIdx ? "done" : ""}"></i>`).join("");
  $("prepNext").textContent = last ? "Chọn góc chụp →" : "Tiếp →";
}
$("prepNext").onclick = () => { if (prepIdx < mode.prep.length - 1) { prepIdx++; renderPrep(); } else { seenPrep[modeKey] = true; openAngles(); } };
$("prepSkip").onclick = () => { seenPrep[modeKey] = true; openAngles(); };
$("prepBack").onclick = () => { if (prepIdx > 0) { prepIdx--; renderPrep(); } else show("home"); };

/* ====== Chọn góc chụp ====== */
function openAngles() {
  if (!mode) return show("home");
  stopStream(); clearInterval(analyzeInterval);
  window.removeEventListener("deviceorientation", onTilt);
  const done = doneAngles[modeKey] || (doneAngles[modeKey] = new Set());
  $("anglesTitle").textContent = mode.icon + " " + mode.name;
  $("anglesHint").textContent = `Chụp đủ ${mode.angles.length} góc rồi chọn tấm đẹp nhất. Đã chụp ${done.size}/${mode.angles.length}.`;
  $("angleList").innerHTML = mode.angles.map((a, i) =>
    `<button class="angleCard${done.has(a.key) ? " done" : ""}" data-i="${i}">${sampleHTML(modeKey, a)}` +
    `<b>${i + 1}. ${a.name}</b><small>${a.desc}</small>${done.has(a.key) ? '<span class="check">✓</span>' : ""}</button>`).join("");
  show("angles");
}
$("angleList").addEventListener("click", e => {
  const b = e.target.closest(".angleCard"); if (!b) return;
  angle = mode.angles[+b.dataset.i]; openCamera();
});
$("anglesBack").onclick = () => show("home");
$("reviewPrep").onclick = () => openPrep();

/* Ảnh mẫu to khi đang chụp */
function openSample() {
  $("sampleBig").innerHTML = sampleHTML(modeKey, angle);
  $("sampleName").textContent = angle.name;
  $("sampleDesc").textContent = angle.desc;
  $("sampleTips").innerHTML = angle.tips.map(t => `<li>${t}</li>`).join("");
  $("sampleModal").classList.remove("hidden");
}
$("sampleBtn").onclick = openSample;
$("sampleClose").onclick = () => $("sampleModal").classList.add("hidden");

/* ====== Camera ====== */
async function openCamera() {
  // iOS bắt buộc xin quyền cảm biến ngay trong lúc bấm nút → gọi trước mọi "await"
  const tilt = requestTilt();
  facing = mode.facing;
  $("modeName").textContent = mode.icon + " " + angle.name;
  guide.innerHTML = angle.guide;
  steps = stepsFor(mode, angle);
  stepState = steps.map(() => ({ done: false, okc: 0, badc: 0, res: null, skipped: false }));
  curStep = 0; curSince = Date.now();
  show("camera"); drawGrid(); renderStep();
  await startStream();
  await tilt;
  clearInterval(analyzeInterval); analyzeInterval = setInterval(analyze, 400);
}

async function startStream() {
  stopStream();
  $("error").classList.add("hidden");
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false,
    });
    video.srcObject = stream;
    video.classList.toggle("mirror", facing === "user");
  } catch (err) {
    const msg = !navigator.mediaDevices
      ? "Trình duyệt cần mở bằng HTTPS (hoặc localhost) mới dùng được camera."
      : err.name === "NotAllowedError"
        ? "Bạn chưa cho phép dùng camera. Trên iPhone: Cài đặt → Safari → Camera → Cho phép, rồi tải lại trang."
        : "Không mở được camera: " + err.message;
    const e = $("error"); e.textContent = msg; e.classList.remove("hidden");
  }
}
function stopStream() { if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; }

$("back").onclick = () => { orient = null; openAngles(); };
$("flip").onclick = () => { facing = facing === "user" ? "environment" : "user"; startStream(); };

/* ====== Lưới ====== */
function drawGrid() {
  const r = gridCv.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  gridCv.width = r.width * dpr; gridCv.height = r.height * dpr;
  const c = gridCv.getContext("2d"); c.scale(dpr, dpr); c.clearRect(0, 0, r.width, r.height);
  if (!showGrid) return;
  c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1; c.beginPath();
  for (let i = 1; i < 3; i++) {
    c.moveTo(r.width * i / 3, 0); c.lineTo(r.width * i / 3, r.height);
    c.moveTo(0, r.height * i / 3); c.lineTo(r.width, r.height * i / 3);
  }
  c.stroke();
  c.fillStyle = "rgba(255,213,74,.9)";
  for (let i = 1; i < 3; i++) for (let j = 1; j < 3; j++) { c.beginPath(); c.arc(r.width * i / 3, r.height * j / 3, 4, 0, 7); c.fill(); }
}
addEventListener("resize", drawGrid);
$("toggleGrid").onclick = e => {
  showGrid = !showGrid; e.currentTarget.classList.toggle("on", showGrid);
  guide.style.display = showGrid ? "" : "none"; drawGrid();
};
$("timerBtn").onclick = () => { timer = timer === 0 ? 3 : timer === 3 ? 10 : 0; $("timerVal").textContent = timer; };

/* ====== Cảm biến nghiêng ====== */
async function requestTilt() {
  if (!("DeviceOrientationEvent" in window)) return;
  try {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      const p = await DeviceOrientationEvent.requestPermission();
      if (p === "denied") return;
    }
    window.addEventListener("deviceorientation", onTilt);
  } catch { /* không có cảm biến → các bước sẽ chuyển sang nút "Xong" */ }
}
function onTilt(e) {
  if (e.gamma == null || e.beta == null) return;
  const portrait = innerHeight >= innerWidth;
  let roll = portrait ? e.gamma : (e.beta > 0 ? 90 - e.beta : -90 - e.beta);
  roll = Math.max(-45, Math.min(45, roll));
  orient = { beta: e.beta, gamma: e.gamma, roll };
  const lv = $("level");
  lv.classList.toggle("flat", Math.abs(roll) < 3);
  lv.firstElementChild.style.transform = `rotate(${-roll}deg)`;
}

/* ====== Phân tích hình ảnh trực tiếp ====== */
const probe = document.createElement("canvas"); probe.width = 96; probe.height = 96;
const pctx = probe.getContext("2d", { willReadFrequently: true });
let prevSharp = [];
function analyze() {
  if (video.videoWidth) {
    pctx.drawImage(video, 0, 0, 96, 96);
    const d = pctx.getImageData(0, 0, 96, 96).data;
    const lum = new Float32Array(96 * 96);
    let rs = 0, bs = 0, sum = 0, centre = 0, cn = 0, edge = 0, en = 0;
    for (let i = 0; i < lum.length; i++) {
      const y = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
      lum[i] = y; sum += y; rs += d[i * 4]; bs += d[i * 4 + 2];
      const x = i % 96, r = (i / 96) | 0;
      if (x > 28 && x < 68 && r > 28 && r < 68) { centre += y; cn++; } else { edge += y; en++; }
    }
    const bright = sum / lum.length;
    let s = 0, s2 = 0, n = 0;
    for (let r = 1; r < 95; r++) for (let x = 1; x < 95; x++) {
      const i = r * 96 + x;
      const l = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - 96] - lum[i + 96];
      s += l; s2 += l * l; n++;
    }
    prevSharp.push(s2 / n - (s / n) ** 2); if (prevSharp.length > 4) prevSharp.shift();
    metrics = {
      bright, sharp: prevSharp.reduce((a, b) => a + b, 0) / prevSharp.length,
      warm: rs / (bs + 1) > 1.55, backlit: edge / en - centre / cn > 45 && centre / cn < 100,
    };
  }
  evalSteps();
}

/* ====== Hệ thống từng bước ====== */
function evalSteps() {
  steps.forEach((st, i) => {
    if (!st.check) return;
    const ss = stepState[i];
    const r = CHECK[st.check](metrics, orient);
    ss.res = r;
    if (r.manual) return;
    if (r.ok) { ss.okc++; ss.badc = 0; if (!ss.done && ss.okc >= 3) ss.done = true; }
    else { ss.badc++; ss.okc = 0; if (ss.done && !ss.skipped && ss.badc >= 5) ss.done = false; }
  });
  const first = stepState.findIndex((s, i) => !s.done && !steps[i].shoot);
  const next = first === -1 ? steps.length - 1 : first;
  if (next !== curStep) { curStep = next; curSince = Date.now(); }
  renderStep();
}

function renderStep() {
  const st = steps[curStep], ss = stepState[curStep], box = $("stepBox");
  const n = steps.length;
  $("stepLabel").textContent = st.shoot ? "SẴN SÀNG!" : `BƯỚC ${curStep + 1}/${n - 1}`;
  $("stepDots").innerHTML = steps.slice(0, -1).map((_, i) =>
    `<i class="${i === curStep ? "on" : stepState[i].done ? "done" : ""}"></i>`).join("");
  $("stepTitle").textContent = st.title;
  $("stepDesc").textContent = st.desc;
  $("stepDiagram").innerHTML = st.diagram === "sample" ? sampleHTML(modeKey, angle) : st.diagram ? DG[st.diagram] : "";

  const r = ss.res, status = $("stepStatus");
  let cls = "", txt = "", needDone = false;
  if (st.shoot) { cls = "ok"; txt = "✓ Mọi thứ đều tốt!"; }
  else if (st.manual || (r && r.manual)) { needDone = true; }
  else if (r && r.ok) { cls = "ok"; txt = "✓ Tốt! Giữ nguyên…" + (r.note ? " " + r.note : ""); }
  else if (r) { cls = "bad"; txt = r.msg; }
  status.className = "stepStatus " + cls; status.textContent = txt;
  box.className = "stepBox " + cls;

  const done = $("stepDone"), skip = $("stepSkip");
  done.classList.toggle("hidden", !needDone);
  done.textContent = r && r.manual && !st.manual ? "Xong, máy đã đúng ✓" : "Xong ✓";
  skip.classList.toggle("hidden", needDone || st.shoot || Date.now() - curSince < 10000);
  $("shutter").classList.toggle("ready", !!st.shoot);
  $("level").classList.toggle("hide", !(st.check === "upright" && orient));
  guide.style.opacity = st.manual || st.shoot ? .9 : .45;
}
$("stepDone").onclick = () => { stepState[curStep].done = true; stepState[curStep].skipped = true; evalSteps(); };
$("stepSkip").onclick = $("stepDone").onclick;

/* ====== Lưu trữ lâu dài (IndexedDB) ====== */
const DB = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open("chupdep", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("shots", { keyPath: "id" });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const tx = async (m, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction("shots", m); const rq = fn(t.objectStore("shots"));
      t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error);
    });
  };
  return { all: () => tx("readonly", s => s.getAll()), put: v => tx("readwrite", s => s.put(v)), del: id => tx("readwrite", s => s.delete(id)) };
})();

async function loadShots() {
  try {
    const all = await DB.all(); all.sort((a, b) => b.ts - a.ts);
    shots = all.map(s => ({ ...s, url: URL.createObjectURL(s.blob) }));
  } catch { /* chế độ riêng tư: vẫn chạy, chỉ không lưu lâu dài */ }
  rebuildDone(); updateCount();
}
function rebuildDone() {
  doneAngles = {};
  shots.forEach(s => (doneAngles[s.mode] || (doneAngles[s.mode] = new Set())).add(s.angle));
}
function updateCount() {
  $("count").textContent = shots.length;
  $("lastThumb").style.backgroundImage = shots[0] ? `url(${shots[0].url})` : "";
  const total = Object.values(MODES).reduce((n, m) => n + m.angles.length, 0);
  const done = Object.values(doneAngles).reduce((n, s) => n + s.size, 0);
  $("listCount").textContent = `${done}/${total}`;
}

/* ====== Chụp (có chế độ chụp 3 tấm chọn tấm nét nhất) ====== */
let burst = false, snapping = false;
$("burstBtn").onclick = e => { burst = !burst; e.currentTarget.classList.toggle("on", burst); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

$("shutter").onclick = () => {
  if (!stream || snapping) return;
  if (!timer) return snap();
  let n = timer; const cd = $("countdown"); cd.textContent = n;
  const t = setInterval(() => { n--; if (n <= 0) { clearInterval(t); cd.textContent = ""; snap(); } else cd.textContent = n; }, 1000);
};

function grab() {
  const w = video.videoWidth, h = video.videoHeight;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d");
  if (facing === "user") { x.translate(w, 0); x.scale(-1, 1); }
  x.drawImage(video, 0, 0, w, h);
  return c;
}
function sharpnessOf(c) {
  const W = 160, H = Math.round(160 * c.height / c.width);
  const t = document.createElement("canvas"); t.width = W; t.height = H;
  const x = t.getContext("2d", { willReadFrequently: true }); x.drawImage(c, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data, L = new Float32Array(W * H);
  for (let i = 0; i < L.length; i++) L[i] = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2];
  let s = 0, s2 = 0, n = 0;
  for (let r = 1; r < H - 1; r++) for (let q = 1; q < W - 1; q++) {
    const i = r * W + q, l = 4 * L[i] - L[i - 1] - L[i + 1] - L[i - W] - L[i + W];
    s += l; s2 += l * l; n++;
  }
  return s2 / n - (s / n) ** 2;
}

async function snap() {
  snapping = true;
  const f = $("flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  let best = grab();
  if (burst) {
    let bs = sharpnessOf(best);
    for (let i = 0; i < 2; i++) { await sleep(220); const c = grab(), sc = sharpnessOf(c); if (sc > bs) { bs = sc; best = c; } }
  }
  const m = { ...metrics };
  const tiltRes = steps.map((st, i) => ["flat", "angle", "upright"].includes(st.check) ? stepState[i].res : null).find(Boolean);
  m.tiltBad = !!(tiltRes && tiltRes.ok === false);
  best.toBlob(blob => {
    snapping = false;
    if (!blob) return;
    const shot = { id: Date.now() + "-" + Math.random().toString(36).slice(2, 6), blob, mode: modeKey, angle: angle.key, ts: Date.now() };
    shot.url = URL.createObjectURL(blob);
    shots.unshift(shot); rebuildDone(); updateCount();
    DB.put({ id: shot.id, blob, mode: shot.mode, angle: shot.angle, ts: shot.ts }).catch(() => {});
    setTimeout(() => showReview(shot, m), 250);
  }, "image/jpeg", 0.92);
}

/* ====== Xem lại + làm đẹp ảnh ====== */
let cur = null, edited = null, renderTok = 0, pendingRender = null, editUrl = null;
const edit = { ratio: "orig", enhance: true, caption: safe(() => localStorage.getItem("caption") || "", "") };

function coachHTML(m) {
  if (!m) return `<b>Ảnh đã lưu trong máy.</b> Bạn có thể làm đẹp, cắt tỉ lệ, chèn chữ rồi lưu/chia sẻ.`;
  const notes = [];
  if (m.bright < 55) notes.push("🌑 Ảnh <b>tối</b> → dịch món sát cửa sổ rồi chụp lại.");
  if (m.bright > 205) notes.push("☀️ Ảnh <b>cháy sáng</b> → tránh nắng gắt, lùi vào bóng râm.");
  if (m.backlit) notes.push("🔦 <b>Ngược sáng</b> → xoay món/xoay người để ánh sáng chiếu vào món.");
  if (m.warm) notes.push("💡 Màu <b>ngả vàng</b> → app đã tự chỉnh khi bạn bật ✨ Làm đẹp; lần sau ngồi gần cửa sổ sẽ chuẩn hơn.");
  if (m.tiltBad) notes.push("📐 Máy <b>chưa đúng góc</b> → làm lại bước chỉnh góc máy.");
  if (m.sharp < 6) notes.push("🤚 Ảnh hơi <b>mờ</b> → bật hẹn giờ 3 giây (⏱) hoặc chế độ 3× để khỏi rung tay.");
  const stars = Math.max(1, 5 - notes.length);
  let h = `<b>${"⭐".repeat(stars)}${"☆".repeat(5 - stars)}</b><br>` +
    (notes.length ? notes.join("<br>") : "🎉 <b>Ảnh đẹp!</b> Đủ sáng, nét và đúng góc.");
  const dn = doneAngles[modeKey], nxt = mode && mode.angles.find(a => !(dn && dn.has(a.key)));
  h += nxt ? `<br><br>👉 <b>Chụp thêm góc "${nxt.name}"</b> để có nhiều ảnh chọn.` : `<br><br>✅ Đã chụp đủ các góc, giờ chọn tấm đẹp nhất nhé!`;
  return h;
}

function showReview(shot, m) {
  cur = shot;
  if (MODES[shot.mode]) { modeKey = shot.mode; mode = MODES[shot.mode]; }
  $("reviewCoach").innerHTML = coachHTML(m);
  $("capInput").value = edit.caption;
  syncEditUI();
  scheduleRender();
  show("review");
}
function syncEditUI() {
  document.querySelectorAll("#ratioChips button").forEach(b => b.classList.toggle("on", b.dataset.r === edit.ratio));
  $("enhanceBtn").classList.toggle("on", edit.enhance);
}
function scheduleRender() { pendingRender = renderEdited(); return pendingRender; }

const loadImg = url => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });

async function renderEdited() {
  const tok = ++renderTok;
  const img = await loadImg(cur.url);
  const canvas = processImage(img, edit);
  const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.92));
  if (tok !== renderTok) return;
  edited = blob;
  if (editUrl) URL.revokeObjectURL(editUrl);
  editUrl = URL.createObjectURL(blob);
  $("reviewImg").src = editUrl;
}

function processImage(img, ed) {
  const w = img.naturalWidth, h = img.naturalHeight;
  let sx = 0, sy = 0, sw = w, sh = h;
  if (ed.ratio !== "orig") {
    const [rw, rh] = ed.ratio.split(":").map(Number), t = rw / rh;
    if (w / h > t) { sw = Math.round(h * t); sx = Math.round((w - sw) / 2); }
    else { sh = Math.round(w / t); sy = Math.round((h - sh) / 2); }
  }
  const sc = Math.min(1, 1920 / Math.max(sw, sh));
  const cw = Math.round(sw * sc), ch = Math.round(sh * sc);
  const c = document.createElement("canvas"); c.width = cw; c.height = ch;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  if (ed.enhance) enhancePixels(x, cw, ch);
  if (ed.caption.trim()) drawCaption(x, cw, ch, ed.caption.trim());
  return c;
}

/* Làm đẹp tự động: sáng vừa phải, bớt ngả vàng, màu tươi hơn, tương phản nhẹ */
function enhancePixels(x, w, h) {
  const id = x.getImageData(0, 0, w, h), d = id.data;
  let sum = 0, rs = 0, bs = 0, n = 0;
  for (let i = 0; i < d.length; i += 64) { sum += .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]; rs += d[i]; bs += d[i + 2]; n++; }
  const gain = Math.min(1.35, Math.max(.9, 125 / (sum / n)));
  const wb = rs / (bs + 1);
  let rg = 1, bg = 1;
  if (wb > 1.25) { const k = Math.min(.12, (wb - 1.25) * .2); rg = 1 - k; bg = 1 + k; }
  const sat = 1.18, con = 1.06;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] * gain * rg, g = d[i + 1] * gain, b = d[i + 2] * gain * bg;
    r = (r - 128) * con + 128; g = (g - 128) * con + 128; b = (b - 128) * con + 128;
    const l = .299 * r + .587 * g + .114 * b;
    r = l + (r - l) * sat; g = l + (g - l) * sat; b = l + (b - l) * sat;
    d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g; d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }
  x.putImageData(id, 0, 0);
}

function drawCaption(x, w, h, text) {
  const bar = Math.round(Math.min(w, h) * .2);
  const g = x.createLinearGradient(0, h - bar, 0, h);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.6)");
  x.fillStyle = g; x.fillRect(0, h - bar, w, bar);
  let size = Math.round(w * .055);
  const font = s => `700 ${s}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  x.font = font(size);
  while (x.measureText(text).width > w * .92 && size > 12) { size -= 2; x.font = font(size); }
  x.fillStyle = "#fff"; x.textBaseline = "alphabetic"; x.shadowColor = "rgba(0,0,0,.6)"; x.shadowBlur = size * .2;
  x.fillText(text, w * .04, h - w * .035);
  x.shadowBlur = 0;
}

document.querySelectorAll("#ratioChips button").forEach(b => b.onclick = () => { edit.ratio = b.dataset.r; syncEditUI(); scheduleRender(); });
$("enhanceBtn").onclick = () => { edit.enhance = !edit.enhance; syncEditUI(); scheduleRender(); };
let capTimer;
$("capInput").oninput = e => {
  edit.caption = e.target.value; safe(() => localStorage.setItem("caption", edit.caption));
  clearTimeout(capTimer); capTimer = setTimeout(scheduleRender, 250);
};

/* Lưu / chia sẻ: trên iPhone mở bảng chia sẻ → chọn "Lưu hình ảnh" */
$("saveBtn").onclick = async () => {
  if (pendingRender) await pendingRender;
  if (!edited) return;
  const file = new File([edited], "chup-dep-" + Date.now() + ".jpg", { type: "image/jpeg" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(edited); a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
};
$("delBtn").onclick = async () => {
  if (!cur || !confirm("Xoá ảnh này khỏi máy?")) return;
  shots = shots.filter(s => s.id !== cur.id);
  DB.del(cur.id).catch(() => {});
  rebuildDone(); updateCount(); renderGallery(); show("gallery");
};
$("retake").onclick = () => show(stream ? "camera" : "angles");
$("nextAngle").onclick = () => openAngles();

/* ====== Thư viện ====== */
$("lastThumb").onclick = () => { if (shots[0]) showReview(shots[0], null); };
function renderGallery() {
  $("galleryGrid").innerHTML = shots.length
    ? shots.map((s, i) => `<img src="${s.url}" data-i="${i}" alt="Ảnh ${i + 1}">`).join("")
    : "<p>Chưa có ảnh nào. Hãy chụp thử nhé!</p>";
}
$("galleryGrid").addEventListener("click", e => {
  const i = e.target.dataset?.i; if (i == null) return;
  showReview(shots[i], null);
});

/* ====== Danh sách chụp cả quán ====== */
function openList() {
  const html = Object.entries(MODES).map(([k, m]) => {
    const ds = doneAngles[k] || new Set();
    return `<h3>${m.icon} ${m.name} <small>${ds.size}/${m.angles.length}</small></h3>` +
      m.angles.map(a => `<button class="listRow${ds.has(a.key) ? " done" : ""}" data-m="${k}" data-a="${a.key}">` +
        `<span class="tick">${ds.has(a.key) ? "✓" : ""}</span><span><b>${a.name}</b><small>${a.desc}</small></span></button>`).join("");
  }).join("");
  $("listBody").innerHTML = html;
  show("list");
}
$("listBody").addEventListener("click", e => {
  const b = e.target.closest(".listRow"); if (!b) return;
  modeKey = b.dataset.m; mode = MODES[modeKey];
  angle = mode.angles.find(a => a.key === b.dataset.a); openCamera();
});
$("openList").onclick = openList;
$("listBack").onclick = () => show("home");

/* ====== Khác ====== */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopStream();
  else if ($("camera").classList.contains("active")) startStream();
});

/* Chạm vào màn hình để lấy nét (nếu thiết bị hỗ trợ) */
video.addEventListener("click", async () => {
  const t = stream && stream.getVideoTracks()[0]; if (!t) return;
  const caps = t.getCapabilities ? t.getCapabilities() : {};
  try {
    if (caps.focusMode && caps.focusMode.includes("single-shot")) {
      await t.applyConstraints({ advanced: [{ focusMode: "single-shot" }] });
      setTimeout(() => t.applyConstraints({ advanced: [{ focusMode: "continuous" }] }).catch(() => {}), 1500);
    }
  } catch {}
});

loadShots();
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
