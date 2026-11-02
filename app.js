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

/* =====================================================================
   Từng chủ đề: thẻ chuẩn bị + các bước chụp
   ===================================================================== */
const MODES = {
  pho: {
    icon: "🍜", name: "Tô phở / bún / mì", desc: "Tô nước, đang bốc khói", facing: "environment",
    guide: '<circle cx="50" cy="50" r="36"/>',
    prep: [
      { icon: "🪟", head: "Dọn tô ra chỗ sáng", text: "Nhờ/dịch tô phở ra gần cửa sổ hoặc cửa quán. Đèn vàng trên trần làm nước dùng ngả vàng, kém ngon.", dg: "light" },
      { icon: "🧽", head: "Làm đẹp tô phở", text: "Lau giọt nước dùng bắn ra viền tô. Xếp rau thơm, chanh, ớt lên mặt tô hoặc để cạnh tô cho có màu." },
      { icon: "⏱️", head: "Chụp trong 30 giây", text: "Phở còn bốc khói thì ảnh mới 'ngon'. Hãy chuẩn bị xong rồi mới bắt đầu. App không bật flash – đúng ý rồi đấy!" },
    ],
    steps: [
      S.light("tô phở"),
      S.flat("tô phở"),
      S.frame("Vừa khít vòng tròn", "Đưa máy lên hoặc xuống cho tô vừa vặn trong vòng tròn trắng, thấy trọn viền tô."),
      S.steady(),
      S.shoot("Bấm nút tròn trắng. Chụp liền 3 tấm rồi chọn tấm đẹp nhất."),
    ],
  },
  table: {
    icon: "🍽️", name: "Cả bàn nhiều món", desc: "Bàn ăn, đồ ăn nhóm", facing: "environment",
    guide: '<rect x="8" y="8" width="84" height="84" rx="6" stroke-dasharray="3 2"/>',
    prep: [
      { icon: "🧹", head: "Dọn bàn trước", text: "Bỏ chai lọ, khăn giấy, điện thoại, vỏ chai ra khỏi bàn. Bàn càng gọn ảnh càng đẹp." },
      { icon: "🍲", head: "Gom các món lại", text: "Đẩy các đĩa lại gần nhau, đủ chạm mép. Món chính ở giữa, món phụ xung quanh." },
      { icon: "🪟", head: "Ngồi chỗ sáng", text: "Chọn bàn gần cửa sổ/cửa ra vào. Tránh bàn nằm ngay dưới đèn vàng.", dg: "light" },
    ],
    steps: [
      S.light("cả bàn"),
      S.flat("bàn ăn"),
      S.frame("Thấy hết các món", "Đứng lên, giơ máy cao cho thấy tất cả các món, chừa chút viền quanh bàn."),
      S.steady(),
      S.shoot("Bấm nút tròn trắng. Chụp 2–3 tấm, lần sau đổi chỗ đứng một chút."),
    ],
  },
  dish: {
    icon: "🥘", name: "Một món cận cảnh", desc: "Cơm, gỏi, nướng, bánh…", facing: "environment",
    guide: '<ellipse cx="50" cy="52" rx="38" ry="26"/>',
    prep: [
      { icon: "🪟", head: "Ánh sáng từ bên hông", text: "Ngồi sao cho cửa sổ nằm ở bên trái hoặc phải món. Ánh sáng chiếu ngang làm món bóng, nổi khối.", dg: "light" },
      { icon: "🧽", head: "Lau viền đĩa", text: "Lau vết nước sốt, dầu mỡ quanh viền đĩa. Chỉnh rau, chanh cho gọn mắt." },
      { icon: "👋", head: "Đừng để bóng tay", text: "Cẩn thận bóng tay và bóng điện thoại đổ lên món. Nếu có bóng, xoay nhẹ đĩa." },
    ],
    steps: [
      S.light("món ăn"),
      S.angle("món ăn"),
      S.frame("Bước lại gần", "Đừng zoom bằng ngón tay. Đưa máy lại gần cho món chiếm gần hết khung; chỗ ngon nhất đặt gần chấm vàng."),
      S.steady(),
      S.shoot("Bấm nút tròn trắng. Chạm nhẹ vào món trên màn hình để lấy nét."),
    ],
  },
  drink: {
    icon: "🧋", name: "Đồ uống", desc: "Cà phê, trà sữa, nước ép", facing: "environment",
    guide: '<path d="M34 12h32l-5 78H39z"/>',
    prep: [
      { icon: "🪟", head: "Ly gần cửa sổ", text: "Đặt ly cạnh cửa sổ, ánh sáng từ sau hoặc bên hông làm đồ uống trong và lấp lánh.", dg: "light" },
      { icon: "🧻", head: "Lau ly", text: "Lau hơi nước và dấu vân tay trên ly. Đặt ly trên nền gọn (mặt bàn trơn, khăn, quyển sách)." },
    ],
    steps: [
      S.light("ly nước"),
      S.upright("ly"),
      S.frame("Ly nằm giữa khung", "Đưa máy ra xa hoặc lại gần cho ly nằm dọc giữa khung hình, chừa lề hai bên."),
      S.steady(),
      S.shoot("Bấm nút tròn trắng. Ly có latte art thì thử chụp từ trên xuống."),
    ],
  },
  shop: {
    icon: "🏮", name: "Quán / biển hiệu", desc: "Mặt tiền, không gian quán", facing: "environment",
    guide: '<path d="M20 90V38h60v52M14 38L50 12l36 26"/>',
    prep: [
      { icon: "🚶", head: "Lùi ra xa", text: "Đứng cách quán đủ xa để thấy cả biển hiệu và mặt tiền. Đừng chụp sát cửa." },
      { icon: "👥", head: "Chọn lúc có khách", text: "Quán có vài người ngồi ăn thì ảnh có không khí hơn quán vắng. Đợi người/xe đi qua khung rồi mới chụp." },
      { icon: "🌙", head: "Ban đêm", text: "Tối thì dựa vào tường/cột cho đỡ rung tay. Bật hẹn giờ 3 giây (nút ⏱ phía trên).", dg: "steady" },
    ],
    steps: [
      S.light("quán"),
      S.upright("biển hiệu"),
      S.frame("Thấy cả biển hiệu", "Lùi ra xa cho thấy toàn bộ biển hiệu và cửa quán, không bị cắt mất chữ."),
      S.steady(),
      S.shoot("Bấm nút tròn trắng. Chụp thêm 1 tấm cầm máy ngang để lấy rộng hơn."),
    ],
  },
  portrait: {
    icon: "🙂", name: "Selfie cùng món", desc: "Chụp mặt, chụp cùng món", facing: "user",
    guide: '<ellipse cx="50" cy="40" rx="18" ry="24"/>',
    prep: [
      { icon: "🪟", head: "Quay mặt về phía sáng", text: "Ngồi sao cho cửa sổ/cửa quán ở phía trước mặt hoặc bên cạnh, đừng để ở sau lưng.", dg: "light" },
      { icon: "🍜", head: "Đưa món vào khung", text: "Đặt món ăn cạnh mặt bạn, hoặc cầm đũa gắp giơ lên – ảnh sẽ có câu chuyện." },
    ],
    steps: [
      S.light("mặt bạn"),
      S.frame("Mặt nằm trong khung", "Đưa mặt (và món ăn) vào khung hình, mắt ở khoảng 1/3 phía trên màn hình."),
      S.steady(),
      S.shoot("Bấm nút tròn trắng. Cười tự nhiên rồi mới bấm."),
    ],
  },
};

/* ====== DOM & trạng thái ====== */
const $ = id => document.getElementById(id);
const video = $("video"), gridCv = $("grid"), guide = $("guide");
const screens = ["home", "prep", "camera", "review", "gallery"];
let mode = null, facing = "environment", stream = null;
let showGrid = true, timer = 0, analyzeInterval = null;
let orient = null, shots = [], lastReview = null;
let metrics = { bright: 128, sharp: 99, backlit: false, warm: false };
let stepState = [], curStep = 0, curSince = 0, prepIdx = 0;
function show(id) { screens.forEach(s => $(s).classList.toggle("active", s === id)); }

/* ====== Màn hình chính ====== */
$("modes").innerHTML = Object.entries(MODES).map(([k, m]) =>
  `<button class="mode" data-k="${k}"><span class="ico">${m.icon}</span><b>${m.name}</b><small>${m.desc}</small></button>`).join("");
$("modes").addEventListener("click", e => { const b = e.target.closest(".mode"); if (b) openPrep(b.dataset.k); });
$("openGallery").onclick = () => { renderGallery(); show("gallery"); };
$("galleryBack").onclick = () => show("home");

/* ====== Chuẩn bị (thẻ từng bước) ====== */
function openPrep(k) {
  mode = MODES[k]; prepIdx = 0;
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
  $("prepNext").textContent = last ? "📷 Mở camera" : "Tiếp →";
}
$("prepNext").onclick = () => { if (prepIdx < mode.prep.length - 1) { prepIdx++; renderPrep(); } else openCamera(); };
$("prepSkip").onclick = () => openCamera();
$("prepBack").onclick = () => { if (prepIdx > 0) { prepIdx--; renderPrep(); } else show("home"); };

/* ====== Camera ====== */
async function openCamera() {
  // iOS bắt buộc xin quyền cảm biến ngay trong lúc bấm nút → gọi trước mọi "await"
  const tilt = requestTilt();
  facing = mode.facing;
  $("modeName").textContent = mode.icon + " " + mode.name;
  guide.innerHTML = mode.guide;
  stepState = mode.steps.map(() => ({ done: false, okc: 0, badc: 0, res: null, skipped: false }));
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

function closeCamera() {
  stopStream(); clearInterval(analyzeInterval);
  window.removeEventListener("deviceorientation", onTilt);
  orient = null; show("home");
}
$("back").onclick = closeCamera;
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
  mode.steps.forEach((st, i) => {
    if (!st.check) return;
    const ss = stepState[i];
    const r = CHECK[st.check](metrics, orient);
    ss.res = r;
    if (r.manual) return;
    if (r.ok) { ss.okc++; ss.badc = 0; if (!ss.done && ss.okc >= 3) ss.done = true; }
    else { ss.badc++; ss.okc = 0; if (ss.done && !ss.skipped && ss.badc >= 5) ss.done = false; }
  });
  const first = stepState.findIndex((s, i) => !s.done && !mode.steps[i].shoot);
  const next = first === -1 ? mode.steps.length - 1 : first;
  if (next !== curStep) { curStep = next; curSince = Date.now(); }
  renderStep();
}

function renderStep() {
  const st = mode.steps[curStep], ss = stepState[curStep], box = $("stepBox");
  const n = mode.steps.length;
  $("stepLabel").textContent = st.shoot ? "SẴN SÀNG!" : `BƯỚC ${curStep + 1}/${n - 1}`;
  $("stepDots").innerHTML = mode.steps.slice(0, -1).map((_, i) =>
    `<i class="${i === curStep ? "on" : stepState[i].done ? "done" : ""}"></i>`).join("");
  $("stepTitle").textContent = st.title;
  $("stepDesc").textContent = st.desc;
  $("stepDiagram").innerHTML = st.diagram ? DG[st.diagram] : "";

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

/* ====== Chụp ====== */
$("shutter").onclick = () => {
  if (!stream) return;
  if (!timer) return snap();
  let n = timer; const cd = $("countdown"); cd.textContent = n;
  const t = setInterval(() => { n--; if (n <= 0) { clearInterval(t); cd.textContent = ""; snap(); } else cd.textContent = n; }, 1000);
};

function snap() {
  const w = video.videoWidth, h = video.videoHeight;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d");
  if (facing === "user") { x.translate(w, 0); x.scale(-1, 1); }
  x.drawImage(video, 0, 0, w, h);
  const f = $("flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  const m = { ...metrics };
  const tiltRes = mode.steps.map((st, i) => ["flat", "angle", "upright"].includes(st.check) ? stepState[i].res : null).find(Boolean);
  m.tiltBad = !!(tiltRes && tiltRes.ok === false);
  c.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    shots.unshift(url); updateCount();
    lastReview = { url, m };
    setTimeout(showReview, 250);
  }, "image/jpeg", 0.92);
}

function showReview() {
  $("reviewImg").src = lastReview.url;
  const dl = $("download"); dl.href = lastReview.url; dl.download = "chup-dep-" + Date.now() + ".jpg";
  const m = lastReview.m, notes = [];
  if (m.bright < 55) notes.push("🌑 Ảnh <b>tối</b> → dịch món sát cửa sổ rồi chụp lại.");
  if (m.bright > 205) notes.push("☀️ Ảnh <b>cháy sáng</b> → tránh nắng gắt, lùi vào bóng râm.");
  if (m.backlit) notes.push("🔦 <b>Ngược sáng</b> → xoay món/xoay người để ánh sáng chiếu vào món.");
  if (m.warm) notes.push("💡 Màu <b>ngả vàng</b> → ngồi gần cửa sổ để màu món chuẩn hơn.");
  if (m.tiltBad) notes.push("📐 Máy <b>chưa đúng góc</b> → làm lại bước chỉnh góc máy.");
  if (m.sharp < 6) notes.push("🤚 Ảnh hơi <b>mờ</b> → bật hẹn giờ 3 giây (nút ⏱) để khỏi rung tay.");
  const stars = Math.max(1, 5 - notes.length);
  $("reviewCoach").innerHTML = `<b>${"⭐".repeat(stars)}${"☆".repeat(5 - stars)}</b><br>` +
    (notes.length ? notes.join("<br>") : "🎉 <b>Ảnh đẹp!</b> Đủ sáng, nét và đúng góc. Lưu lại nhé.");
  show("review");
}
$("retake").onclick = () => show(stream ? "camera" : "home");

/* ====== Thư viện ====== */
function updateCount() {
  $("count").textContent = shots.length;
  $("lastThumb").style.backgroundImage = shots[0] ? `url(${shots[0]})` : "";
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
