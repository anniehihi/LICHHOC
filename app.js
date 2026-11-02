"use strict";

/* ====== Dữ liệu các chế độ chụp (tập trung đồ ăn & quán ăn) ====== */
const MODES = {
  pho: {
    icon: "🍜", name: "Tô phở / bún / mì", desc: "Tô nước có hơi nóng", facing: "environment", topdown: true,
    guide: '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="24"/><path d="M78 20L60 48" stroke-dasharray="none"/>',
    tips: [
      "Chụp NGAY khi tô còn bốc khói – khói là thứ làm ảnh phở 'ngon' nhất. Đừng sắp xếp quá lâu.",
      "Chụp từ trên xuống: giữ máy song song mặt bàn, tô nằm gọn trong vòng tròn.",
      "Muốn thấy sợi phở và thịt: nghiêng máy khoảng 45°, đứng sát mép bàn.",
      "Xếp rau thơm, chanh, ớt lên mặt tô hoặc để cạnh tô cho có màu.",
      "Lau sạch giọt nước dùng bắn ra viền tô trước khi chụp.",
      "Đưa đôi đũa gắp sợi lên (nhờ người ngồi cùng) – ảnh sẽ sống động hơn hẳn.",
      "Tắt flash! Flash làm nước dùng bóng loáng và mất màu.",
    ],
  },
  table: {
    icon: "🍽️", name: "Bàn nhiều món", desc: "Cả bàn, đồ ăn nhóm", facing: "environment", topdown: true,
    guide: '<circle cx="30" cy="35" r="16"/><circle cx="68" cy="40" r="14"/><rect x="25" y="62" width="32" height="22" rx="3"/><circle cx="76" cy="72" r="9"/>',
    tips: [
      "Đứng lên hoặc giơ máy cao, chụp thẳng từ trên xuống để thấy hết các món.",
      "Dồn các món lại gần nhau, bỏ bớt chai lọ, khăn giấy, điện thoại ra khỏi khung.",
      "Đặt món chính ở giao điểm lưới, các món phụ ở xung quanh.",
      "Chừa thêm tay người đang gắp/cầm ly vào khung cho ảnh có 'hồn'.",
      "Chụp 2–3 tấm với bố cục khác nhau rồi chọn tấm đẹp nhất.",
    ],
  },
  dish: {
    icon: "🥘", name: "Món ăn cận cảnh", desc: "Cơm, gỏi, nướng, bánh…", facing: "environment",
    guide: '<ellipse cx="50" cy="55" rx="36" ry="22"/><ellipse cx="50" cy="52" rx="24" ry="13"/>',
    tips: [
      "Nghiêng máy 30–45° so với mặt bàn – góc đẹp nhất cho hầu hết món ăn.",
      "Lại gần món (bước chân, đừng zoom) và để phần ngon nhất ở giao điểm lưới.",
      "Ánh sáng chiếu từ bên hông hoặc phía sau món sẽ làm món bóng, hấp dẫn.",
      "Đừng để bóng tay/điện thoại đổ lên món.",
      "Món nhiều màu: thêm rau, chanh, ớt; món nâu đen: chụp sáng hơn một chút.",
    ],
  },
  drink: {
    icon: "🧋", name: "Đồ uống", desc: "Cà phê, trà sữa, nước ép", facing: "environment",
    guide: '<path d="M36 25h28l-4 55H40z"/><path d="M36 38h28"/>',
    tips: [
      "Đặt ly gần cửa sổ, ánh sáng từ sau hoặc bên hông làm đồ uống trong và bóng.",
      "Chụp ngang tầm ly cho ly cao, chụp từ trên xuống cho ly có latte art.",
      "Lau hơi nước/vân tay trên ly trước khi chụp.",
      "Cầm ly hoặc để cạnh quyển sách, cây nhỏ cho ảnh có bối cảnh.",
    ],
  },
  shop: {
    icon: "🏮", name: "Quán / không gian", desc: "Bên ngoài, bên trong quán", facing: "environment",
    guide: '<path d="M0 62h100"/><rect x="22" y="30" width="56" height="32"/><path d="M22 30L50 14l28 16"/>',
    tips: [
      "Chụp biển hiệu và mặt tiền quán cho thẳng: đường giữa màn hình phải màu xanh.",
      "Đứng lùi ra xa để lấy cả quán, đừng chụp từ sát cửa.",
      "Bên trong quán: chụp lúc đông khách một chút, có người ăn cho ảnh có không khí.",
      "Cầm máy dọc để chụp biển hiệu cao, cầm ngang để chụp không gian rộng.",
      "Đứng chỗ có ánh sáng tự nhiên hoặc đợi người đi qua khung rồi mới chụp.",
      "Ban đêm: chạm giữ máy chắc, dùng hẹn giờ 3 giây để đỡ mờ.",
    ],
  },
  portrait: {
    icon: "🙂", name: "Selfie / người", desc: "Chụp mặt, chụp cùng món", facing: "user",
    guide: '<ellipse cx="50" cy="38" rx="17" ry="22"/><path d="M18 100c0-22 14-32 32-32s32 10 32 32"/>',
    tips: [
      "Ngồi gần cửa sổ hoặc cửa quán, quay mặt về phía ánh sáng.",
      "Cầm máy ngang tầm mắt hoặc cao hơn một chút.",
      "Đưa món ăn vào khung, cạnh mặt, cho ảnh có câu chuyện.",
      "Đèn quán vàng: lùi ra khỏi đèn sát đầu để mặt không bị bóng tối dưới mắt.",
    ],
  },
};

/* ====== Tham chiếu DOM ====== */
const $ = id => document.getElementById(id);
const video = $("video"), gridCv = $("grid"), guide = $("guide");
const screens = ["home", "camera", "review", "gallery"];
let mode = null, facing = "environment", stream = null;
let showGrid = true, timer = 0, tipIdx = 0, tipInterval = null, analyzeInterval = null;
let tiltMsg = null, tiltOK = null, shots = [], lastReview = null;
let metrics = { bright: 128, sharp: 99, backlit: false };

function show(id) { screens.forEach(s => $(s).classList.toggle("active", s === id)); }
const safe = (fn, d) => { try { return fn(); } catch { return d; } };

/* ====== Màn hình chính ====== */
$("modes").innerHTML = Object.entries(MODES).map(([k, m]) =>
  `<button class="mode" data-k="${k}"><span class="ico">${m.icon}</span><b>${m.name}</b><small>${m.desc}</small></button>`).join("");
$("modes").addEventListener("click", e => {
  const b = e.target.closest(".mode"); if (b) openCamera(b.dataset.k);
});
$("openGallery").onclick = () => { renderGallery(); show("gallery"); };
$("galleryBack").onclick = () => show("home");
$("introOk").onclick = () => { $("intro").classList.add("hidden"); safe(() => localStorage.setItem("seenIntro", "1")); };
if (!safe(() => localStorage.getItem("seenIntro"))) $("intro").classList.remove("hidden");

/* ====== Camera ====== */
async function openCamera(k) {
  mode = MODES[k]; facing = mode.facing;
  $("modeName").textContent = mode.icon + " " + mode.name;
  guide.innerHTML = mode.guide;
  tipIdx = 0; rotateTip();
  show("camera");
  await startStream();
  requestTilt();
  clearInterval(tipInterval); tipInterval = setInterval(rotateTip, 7000);
  clearInterval(analyzeInterval); analyzeInterval = setInterval(analyze, 400);
  drawGrid();
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
        ? "Bạn chưa cho phép dùng camera. Hãy bấm vào biểu tượng ổ khoá trên thanh địa chỉ → Cho phép Camera, rồi tải lại trang."
        : "Không mở được camera: " + err.message;
    const e = $("error"); e.textContent = msg; e.classList.remove("hidden");
  }
}
function stopStream() { if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; }

function closeCamera() {
  stopStream(); clearInterval(tipInterval); clearInterval(analyzeInterval);
  window.removeEventListener("deviceorientation", onTilt);
  show("home");
}
$("back").onclick = closeCamera;
$("flip").onclick = () => { facing = facing === "user" ? "environment" : "user"; startStream(); };

/* ====== Lưới & bật/tắt ====== */
function drawGrid() {
  const r = gridCv.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  gridCv.width = r.width * dpr; gridCv.height = r.height * dpr;
  const c = gridCv.getContext("2d"); c.scale(dpr, dpr); c.clearRect(0, 0, r.width, r.height);
  if (!showGrid) return;
  c.strokeStyle = "rgba(255,255,255,.45)"; c.lineWidth = 1; c.beginPath();
  for (let i = 1; i < 3; i++) {
    c.moveTo(r.width * i / 3, 0); c.lineTo(r.width * i / 3, r.height);
    c.moveTo(0, r.height * i / 3); c.lineTo(r.width, r.height * i / 3);
  }
  c.stroke();
  c.fillStyle = "rgba(255,213,74,.9)";
  for (let i = 1; i < 3; i++) for (let j = 1; j < 3; j++) {
    c.beginPath(); c.arc(r.width * i / 3, r.height * j / 3, 4, 0, 7); c.fill();
  }
}
addEventListener("resize", drawGrid);
$("toggleGrid").onclick = e => {
  showGrid = !showGrid; e.currentTarget.classList.toggle("on", showGrid);
  guide.style.display = showGrid ? "" : "none"; drawGrid();
};
$("timerBtn").onclick = () => { timer = timer === 0 ? 3 : timer === 3 ? 10 : 0; $("timerVal").textContent = timer; };

/* ====== Gợi ý cố định xoay vòng ====== */
function rotateTip() {
  $("staticTip").textContent = "💡 " + mode.tips[tipIdx++ % mode.tips.length];
}

/* ====== Cảm biến nghiêng ====== */
async function requestTilt() {
  if (!("DeviceOrientationEvent" in window)) { $("level").classList.add("hide"); return; }
  try {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      const p = await DeviceOrientationEvent.requestPermission();
      if (p !== "granted") { $("level").classList.add("hide"); return; }
    }
    window.addEventListener("deviceorientation", onTilt);
  } catch { $("level").classList.add("hide"); }
}
function onTilt(e) {
  if (e.gamma == null || e.beta == null) { $("level").classList.add("hide"); return; }
  $("level").classList.remove("hide");
  // Máy cầm dọc: gamma = nghiêng trái/phải. Máy cầm ngang: dùng beta.
  if (mode && mode.topdown) {
    // Chụp từ trên xuống: máy phải nằm song song mặt bàn (beta, gamma ≈ 0)
    const off = Math.hypot(e.beta, e.gamma);
    tiltOK = off < 12;
    $("level").classList.add("hide");
    tiltMsg = tiltOK ? null : off < 40 ? "📱 Hạ máy cho song song mặt bàn (chụp từ trên xuống)" : null;
    if (off >= 40) tiltOK = true; // đang cầm nghiêng 45° chủ ý, không cảnh báo
    return;
  }
  const portrait = innerHeight >= innerWidth;
  let roll = portrait ? e.gamma : (e.beta > 0 ? 90 - e.beta : -90 - e.beta);
  roll = Math.max(-45, Math.min(45, roll));
  const flat = Math.abs(roll) < 2.5;
  tiltOK = Math.abs(roll) < 5;
  $("level").classList.toggle("flat", flat);
  $("level").firstElementChild.style.transform = `rotate(${-roll}deg)`;
}

/* ====== Phân tích ảnh trực tiếp: sáng / nét / ngược sáng ====== */
const probe = document.createElement("canvas"); probe.width = 96; probe.height = 96;
const pctx = probe.getContext("2d", { willReadFrequently: true });
let prevSharp = [];
function analyze() {
  if (!video.videoWidth) return;
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
  // độ nét: phương sai Laplacian
  let s = 0, s2 = 0, n = 0;
  for (let r = 1; r < 95; r++) for (let x = 1; x < 95; x++) {
    const i = r * 96 + x;
    const l = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - 96] - lum[i + 96];
    s += l; s2 += l * l; n++;
  }
  const sharp = s2 / n - (s / n) ** 2;
  prevSharp.push(sharp); if (prevSharp.length > 4) prevSharp.shift();
  const avgSharp = prevSharp.reduce((a, b) => a + b, 0) / prevSharp.length;
  metrics = { bright, sharp: avgSharp, warm: rs / (bs + 1) > 1.55, backlit: edge / en - centre / cn > 45 && centre / cn < 100 };
  updateLiveTip();
}

function updateLiveTip() {
  const el = $("liveTip"), m = metrics;
  let msg, cls = "warn";
  if (m.bright < 55) msg = "🌑 Quá tối – tìm chỗ sáng hơn hoặc bật đèn";
  else if (m.bright > 205) msg = "☀️ Quá sáng – tránh nắng gắt, che bớt ánh sáng";
  else if (m.backlit) msg = "🔦 Ngược sáng – xoay người để ánh sáng chiếu vào chủ thể";
  else if (m.warm) msg = "💡 Đèn vàng làm món ngả màu – ngồi gần cửa sổ/ánh sáng trắng hơn";
  else if (tiltOK === false) msg = tiltMsg || "📐 Máy đang nghiêng – xoay cho đường giữa thành màu xanh";
  else if (m.sharp < 6 && m.bright >= 55) msg = "🤚 Ảnh mờ/rung – giữ chắc tay, hoặc lau ống kính";
  else { msg = "✅ Tuyệt! Ánh sáng và độ nét tốt – chụp đi"; cls = "ok"; }
  el.textContent = msg; el.className = "liveTip " + cls;
  $("shutter").classList.toggle("good", cls === "ok");
}

/* ====== Chụp ====== */
$("shutter").onclick = () => {
  if (!stream) return;
  if (!timer) return snap();
  let n = timer; const cd = $("countdown"); cd.textContent = n;
  const t = setInterval(() => {
    n--; if (n <= 0) { clearInterval(t); cd.textContent = ""; snap(); } else cd.textContent = n;
  }, 1000);
};

function snap() {
  const w = video.videoWidth, h = video.videoHeight;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d");
  if (facing === "user") { x.translate(w, 0); x.scale(-1, 1); }
  x.drawImage(video, 0, 0, w, h);
  const f = $("flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  const snapshotMetrics = { ...metrics, tilt: tiltOK };
  c.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    shots.unshift(url);
    updateCount();
    lastReview = { url, m: snapshotMetrics };
    setTimeout(showReview, 250);
  }, "image/jpeg", 0.92);
}

function showReview() {
  $("reviewImg").src = lastReview.url;
  const dl = $("download"); dl.href = lastReview.url; dl.download = "chup-dep-" + Date.now() + ".jpg";
  const m = lastReview.m, notes = [];
  if (m.bright < 55) notes.push("Ảnh hơi <b>tối</b> – lần sau chụp gần cửa sổ/đèn.");
  if (m.bright > 205) notes.push("Ảnh bị <b>cháy sáng</b> – tránh nắng trực tiếp.");
  if (m.backlit) notes.push("Chủ thể bị <b>ngược sáng</b> – xoay để nguồn sáng ở phía sau người chụp.");
  if (m.warm) notes.push("Màu ảnh bị <b>ngả vàng</b> do đèn quán – lần sau ngồi gần cửa sổ hoặc ra ánh sáng tự nhiên.");
  if (m.tilt === false) notes.push("Ảnh hơi <b>nghiêng</b> – lần sau canh máy thẳng/song song mặt bàn.");
  if (m.sharp < 6) notes.push("Ảnh hơi <b>mờ</b> – dùng hẹn giờ 3s để không rung tay.");
  $("reviewCoach").innerHTML = notes.length
    ? "<b>Góp ý:</b><br>" + notes.join("<br>")
    : "🎉 <b>Ảnh đẹp!</b> Ánh sáng, độ nét và độ thẳng đều ổn.";
  show("review");
}
$("retake").onclick = () => show(stream ? "camera" : "home");

/* ====== Thư viện ====== */
function updateCount() {
  $("count").textContent = shots.length;
  const t = $("lastThumb"); t.style.backgroundImage = shots[0] ? `url(${shots[0]})` : "";
}
$("lastThumb").onclick = () => { if (shots[0]) { lastReview = { url: shots[0], m: { bright: 128, sharp: 99 } }; showReview(); } };
function renderGallery() {
  $("galleryGrid").innerHTML = shots.length
    ? shots.map((u, i) => `<img src="${u}" data-i="${i}" alt="Ảnh ${i + 1}">`).join("")
    : "<p>Chưa có ảnh nào. Hãy chụp thử nhé!</p>";
}
$("galleryGrid").addEventListener("click", e => {
  const i = e.target.dataset?.i; if (i == null) return;
  lastReview = { url: shots[i], m: { bright: 128, sharp: 99 } }; showReview();
});

/* Dừng camera khi tab bị ẩn */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopStream();
  else if ($("camera").classList.contains("active")) startStream();
});

/* Chạm vào món để lấy nét (nếu trình duyệt/camera hỗ trợ) */
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
