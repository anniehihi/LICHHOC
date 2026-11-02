"use strict";
/* =====================================================================
   ẢNH MẪU
   - Mặc định là hình minh hoạ vẽ bằng SVG (khung 100x125, tỉ lệ 4:5).
   - Muốn dùng ẢNH THẬT: bỏ file vào thư mục  samples/  đặt tên  <món>-<góc>.jpg
     ví dụ  samples/pho-topdown.jpg  → app tự dùng ảnh thật thay cho hình vẽ.
   ===================================================================== */
const W = '<rect width="100" height="125" fill="#3b2f2a"/>';
const WL = '<rect width="100" height="125" fill="#c9b79c"/>';
const WALL = '<rect width="100" height="125" fill="#5b4a3f"/><rect width="100" height="62" fill="#8a7767"/>';
const steam = '<g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"><path d="M38 52q-6-9 0-17t0-14"/><path d="M52 50q-6-9 0-17t0-14"/><path d="M66 52q-6-9 0-17t0-14"/></g>';
const herbs = '<circle cx="40" cy="52" r="3" fill="#3fa34d"/><circle cx="58" cy="48" r="3.5" fill="#3fa34d"/><circle cx="62" cy="70" r="3" fill="#3fa34d"/><circle cx="45" cy="72" r="2.5" fill="#d6342c"/><circle cx="55" cy="60" r="2.5" fill="#d6342c"/>';
const noodle = '<g fill="none" stroke="#f5e6b8" stroke-width="3" stroke-linecap="round"><path d="M26 58q8-9 16 0t16 0t16 0"/><path d="M28 68q8-9 16 0t16 0t14 0"/></g>';
const beef = '<ellipse cx="38" cy="62" rx="7" ry="4" fill="#8b4a3b"/><ellipse cx="62" cy="55" rx="7" ry="4" fill="#9a5645"/>';
const chop = '<g stroke="#e3c48a" stroke-width="2" stroke-linecap="round"><path d="M92 12L60 52"/><path d="M97 18L64 56"/></g>';
const hand = '<g fill="#e0ac8a"><ellipse cx="14" cy="112" rx="16" ry="9"/><rect x="0" y="104" width="22" height="14" rx="6"/></g>';

const SM = {
  "pho-topdown": W + '<circle cx="50" cy="62" r="42" fill="#f2f2f2"/><circle cx="50" cy="62" r="35" fill="#c8893f"/>' + noodle + beef + herbs + chop,
  "pho-angle": WALL + '<ellipse cx="50" cy="82" rx="40" ry="13" fill="#f2f2f2"/><ellipse cx="50" cy="82" rx="34" ry="10" fill="#c8893f"/><path d="M14 84q36 44 72 0z" fill="#e9e9e9"/><path d="M30 80q8-5 16 0t16 0" stroke="#f5e6b8" stroke-width="3" fill="none"/>' + steam,
  "pho-close": W + '<ellipse cx="50" cy="112" rx="62" ry="30" fill="#f2f2f2"/><ellipse cx="50" cy="108" rx="52" ry="22" fill="#c8893f"/><g fill="none" stroke="#f5e6b8" stroke-width="3.2" stroke-linecap="round"><path d="M44 52q-8 14 2 28t-4 22"/><path d="M50 52q6 16-2 28t6 22"/><path d="M56 52q8 14 0 26t4 24"/></g><g stroke="#e3c48a" stroke-width="3" stroke-linecap="round"><path d="M92 6L46 54"/><path d="M98 14L54 58"/></g>',
  "pho-offset": WL + '<g stroke="#fff" stroke-opacity=".6" stroke-dasharray="2 2"><path d="M33 0v125M67 0v125M0 42v42M0 84h100"/></g><circle cx="67" cy="63" r="28" fill="#fff"/><circle cx="67" cy="63" r="23" fill="#c8893f"/><circle cx="60" cy="58" r="4" fill="#3fa34d"/><circle cx="73" cy="68" r="3" fill="#d6342c"/><circle cx="20" cy="40" r="11" fill="#a6c93a"/><path d="M9 40h22M20 29v22" stroke="#7d9e24" stroke-width="1.5"/><ellipse cx="22" cy="94" rx="8" ry="5" fill="#cfcfcf"/><path d="M30 94h14" stroke="#cfcfcf" stroke-width="3"/>',

  "table-topdown": W + '<circle cx="30" cy="34" r="19" fill="#f2f2f2"/><circle cx="30" cy="34" r="13" fill="#c8893f"/><circle cx="72" cy="40" r="16" fill="#eee"/><circle cx="72" cy="40" r="10" fill="#8dbb4a"/><rect x="18" y="68" width="38" height="28" rx="4" fill="#f2f2f2"/><rect x="24" y="73" width="26" height="18" rx="3" fill="#d96b3a"/><circle cx="76" cy="94" r="14" fill="#eee"/><circle cx="76" cy="94" r="8" fill="#e8c14a"/>',
  "table-angle": WALL + '<ellipse cx="28" cy="78" rx="24" ry="8" fill="#f2f2f2"/><ellipse cx="28" cy="77" rx="16" ry="5" fill="#c8893f"/><ellipse cx="72" cy="74" rx="22" ry="7" fill="#eee"/><ellipse cx="72" cy="73" rx="14" ry="4.5" fill="#8dbb4a"/><ellipse cx="50" cy="104" rx="34" ry="11" fill="#f2f2f2"/><ellipse cx="50" cy="103" rx="24" ry="7" fill="#d96b3a"/>',
  "table-hands": W + '<circle cx="62" cy="40" r="20" fill="#f2f2f2"/><circle cx="62" cy="40" r="14" fill="#c8893f"/><rect x="38" y="70" width="40" height="28" rx="4" fill="#f2f2f2"/><rect x="44" y="75" width="28" height="18" rx="3" fill="#d96b3a"/><circle cx="18" cy="30" r="12" fill="#eee"/>' + hand + '<g stroke="#e3c48a" stroke-width="2.2" stroke-linecap="round"><path d="M16 108L48 80"/><path d="M20 112L52 84"/></g>',

  "dish-angle": WALL + '<ellipse cx="50" cy="82" rx="42" ry="15" fill="#f2f2f2"/><ellipse cx="50" cy="80" rx="30" ry="9" fill="#e2b24f"/><path d="M30 76q20-26 40 0z" fill="#c9722f"/><circle cx="42" cy="70" r="3" fill="#3fa34d"/><circle cx="58" cy="72" r="3" fill="#d6342c"/><path d="M8 84q42 40 84 0z" fill="#e9e9e9"/>',
  "dish-topdown": W + '<circle cx="50" cy="62" r="42" fill="#f2f2f2"/><circle cx="50" cy="62" r="34" fill="#eee"/><circle cx="38" cy="52" r="12" fill="#c9722f"/><circle cx="62" cy="56" r="11" fill="#e2b24f"/><circle cx="50" cy="76" r="10" fill="#8dbb4a"/><circle cx="66" cy="74" r="4" fill="#d6342c"/>',
  "dish-low": WALL + '<rect x="6" y="92" width="88" height="6" rx="3" fill="#f2f2f2"/><rect x="24" y="46" width="52" height="10" rx="5" fill="#d9a05b"/><rect x="22" y="56" width="56" height="7" rx="3" fill="#5ea23a"/><rect x="24" y="63" width="52" height="10" rx="4" fill="#7b3f2e"/><rect x="22" y="73" width="56" height="6" rx="3" fill="#e8c14a"/><rect x="24" y="79" width="52" height="12" rx="5" fill="#d9a05b"/>',

  "drink-side": '<rect width="100" height="125" fill="#d8c7ae"/><circle cx="20" cy="22" r="10" fill="#fff" fill-opacity=".55"/><circle cx="82" cy="40" r="14" fill="#fff" fill-opacity=".4"/><path d="M30 24h40l-6 90H36z" fill="#e6f3f8" fill-opacity=".75" stroke="#fff" stroke-width="1.5"/><path d="M33 56h34l-4 58H37z" fill="#7a4a2b"/><path d="M33 56h34l-.8 10H33.8z" fill="#c9a074"/><path d="M58 8L52 70" stroke="#e24a4a" stroke-width="3" stroke-linecap="round"/>',
  "drink-topdown": W + '<circle cx="50" cy="62" r="40" fill="#f2f2f2"/><circle cx="50" cy="62" r="31" fill="#7a4a2b"/><path d="M50 78c-18-12-18-22-8-24 6-1 8 4 8 6 0-2 2-7 8-6 10 2 10 12-8 24z" fill="#f4e7d2"/>',
  "drink-hand": '<rect width="100" height="125" fill="#d8c7ae"/><path d="M32 18h36l-5 82H37z" fill="#e6f3f8" fill-opacity=".8" stroke="#fff" stroke-width="1.5"/><path d="M35 50h30l-3.5 50H38.5z" fill="#d9a05b"/><path d="M55 6L50 60" stroke="#e24a4a" stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="92" rx="26" ry="12" fill="#e0ac8a"/><rect x="24" y="92" width="52" height="33" rx="14" fill="#e0ac8a"/>',

  "shop-front": '<rect width="100" height="125" fill="#9fc3df"/><rect x="0" y="108" width="100" height="17" fill="#6d6d6d"/><rect x="12" y="34" width="76" height="74" fill="#c9a26a"/><rect x="8" y="22" width="84" height="16" rx="2" fill="#b3342c"/><text x="50" y="34" font-size="10" text-anchor="middle" fill="#ffd54a" font-weight="700">PHỞ QUÁN</text><rect x="20" y="50" width="26" height="58" fill="#4a3426"/><rect x="54" y="50" width="26" height="30" fill="#8cc4d9"/><g fill="#ffd54a"><circle cx="22" cy="44" r="2"/><circle cx="50" cy="44" r="2"/><circle cx="78" cy="44" r="2"/></g>',
  "shop-corner": '<rect width="100" height="125" fill="#9fc3df"/><path d="M0 100L52 82V30L0 18z" fill="#b97f55"/><path d="M52 82L100 96V24L52 30z" fill="#d3a272"/><path d="M0 100L52 82L100 96V125H0z" fill="#6d6d6d"/><path d="M4 28L48 38v10L4 38z" fill="#b3342c"/><rect x="62" y="44" width="28" height="36" fill="#4a3426"/><rect x="12" y="52" width="26" height="22" fill="#8cc4d9"/>',
  "shop-inside": '<rect width="100" height="125" fill="#4a3a30"/><rect x="20" y="14" width="60" height="50" fill="#6b5546"/><g fill="#ffd54a"><circle cx="30" cy="12" r="5"/><circle cx="50" cy="8" r="5"/><circle cx="70" cy="12" r="5"/></g><path d="M0 125L20 64h60l20 61z" fill="#8a6b52"/><rect x="26" y="78" width="20" height="10" fill="#d8c3a0"/><rect x="54" y="78" width="20" height="10" fill="#d8c3a0"/><rect x="12" y="100" width="32" height="14" fill="#e6d3b0"/><rect x="56" y="100" width="32" height="14" fill="#e6d3b0"/><circle cx="35" cy="96" r="4" fill="#e0ac8a"/><circle cx="66" cy="95" r="4" fill="#e0ac8a"/>',

  "portrait-face": WL + '<circle cx="46" cy="48" r="26" fill="#e8b996"/><path d="M20 44q4-26 28-26t28 20q-12-6-28-6t-28 12z" fill="#2a1f1a"/><circle cx="37" cy="48" r="2.5" fill="#222"/><circle cx="55" cy="48" r="2.5" fill="#222"/><path d="M38 60q8 8 16 0" stroke="#a3463f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M12 125q4-34 34-34t34 34z" fill="#3f7fbf"/><circle cx="76" cy="96" r="18" fill="#f2f2f2"/><circle cx="76" cy="96" r="13" fill="#c8893f"/>',
  "portrait-chop": WL + '<circle cx="40" cy="58" r="24" fill="#e8b996"/><path d="M16 54q4-26 26-26t24 20q-10-6-26-6t-24 12z" fill="#2a1f1a"/><circle cx="32" cy="58" r="2.5" fill="#222"/><circle cx="48" cy="58" r="2.5" fill="#222"/><ellipse cx="40" cy="70" rx="8" ry="5" fill="#a3463f"/><g stroke="#e3c48a" stroke-width="2.4" stroke-linecap="round"><path d="M92 12L52 66"/><path d="M98 20L58 72"/></g><g fill="none" stroke="#f5e6b8" stroke-width="3" stroke-linecap="round"><path d="M54 70q-6 10 2 18t-3 16"/><path d="M59 72q6 10-1 18t4 14"/></g><ellipse cx="50" cy="118" rx="44" ry="14" fill="#f2f2f2"/>',

  "grill-topdown": W + '<circle cx="50" cy="62" r="42" fill="#2b2b2b"/><circle cx="50" cy="62" r="36" fill="#3a3a3a"/><g fill="#a8442f"><ellipse cx="36" cy="48" rx="12" ry="7" transform="rotate(-20 36 48)"/><ellipse cx="62" cy="52" rx="12" ry="7" transform="rotate(15 62 52)"/><ellipse cx="44" cy="72" rx="12" ry="7" transform="rotate(10 44 72)"/><ellipse cx="66" cy="76" rx="10" ry="6" transform="rotate(-15 66 76)"/></g><g stroke="#5a1f14" stroke-width="1.2"><path d="M26 46l20 4M52 50l20 6M34 70l20 5"/></g><circle cx="52" cy="62" r="4" fill="#3fa34d"/><circle cx="30" cy="66" r="3" fill="#d6342c"/>',
  "grill-angle": WALL + '<ellipse cx="50" cy="84" rx="42" ry="15" fill="#2b2b2b"/><ellipse cx="50" cy="82" rx="36" ry="11" fill="#3a3a3a"/><g fill="#a8442f"><ellipse cx="36" cy="80" rx="12" ry="5"/><ellipse cx="62" cy="82" rx="12" ry="5"/></g><g fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"><path d="M40 70q-6-9 0-17t0-14"/><path d="M60 70q-6-9 0-17t0-14"/></g>',
  "hotpot-topdown": W + '<circle cx="50" cy="62" r="42" fill="#bdbdbd"/><path d="M50 22a40 40 0 0 1 0 80z" fill="#c9342c"/><path d="M50 22a40 40 0 0 0 0 80z" fill="#e8c14a"/><circle cx="68" cy="50" r="4" fill="#d6342c"/><circle cx="62" cy="72" r="4" fill="#8dbb4a"/><circle cx="34" cy="56" r="4" fill="#f2f2f2"/><circle cx="38" cy="78" r="4" fill="#8dbb4a"/>',
  "hotpot-angle": WALL + '<ellipse cx="50" cy="76" rx="40" ry="13" fill="#bdbdbd"/><ellipse cx="50" cy="76" rx="34" ry="10" fill="#c9342c"/><path d="M10 78q40 40 80 0z" fill="#9a9a9a"/><ellipse cx="26" cy="108" rx="18" ry="6" fill="#f2f2f2"/><ellipse cx="74" cy="108" rx="18" ry="6" fill="#f2f2f2"/><g fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"><path d="M38 62q-6-9 0-17t0-14"/><path d="M52 60q-6-9 0-17t0-14"/><path d="M66 62q-6-9 0-17t0-14"/></g>',
  "dessert-angle": WL + '<ellipse cx="50" cy="96" rx="40" ry="12" fill="#fff"/><path d="M22 90v-26a28 12 0 0 1 56 0v26a28 12 0 0 1-56 0z" fill="#f6c6d0"/><ellipse cx="50" cy="64" rx="28" ry="12" fill="#fbe1e6"/><circle cx="50" cy="56" r="6" fill="#c9342c"/><path d="M22 76q28 12 56 0" stroke="#fff" stroke-width="3" fill="none"/>',
  "dessert-side": WL + '<rect x="6" y="100" width="88" height="5" rx="2" fill="#fff"/><path d="M20 98L80 98L50 26z" fill="#f6c6d0"/><path d="M26 86h48" stroke="#fff" stroke-width="5"/><path d="M33 66h34" stroke="#8a4b2a" stroke-width="6"/><path d="M40 48h20" stroke="#fff" stroke-width="5"/><circle cx="50" cy="22" r="6" fill="#c9342c"/>',
  "menu-flat": '<rect width="100" height="125" fill="#3b2f2a"/><rect x="14" y="10" width="72" height="105" rx="3" fill="#fbf7ee"/><rect x="22" y="20" width="40" height="6" fill="#b3342c"/><g stroke="#555" stroke-width="2"><path d="M22 38h56M22 48h56M22 58h56M22 68h56M22 78h56M22 88h40"/></g>',
  "menu-wall": '<rect width="100" height="125" fill="#6b5546"/><rect x="12" y="20" width="76" height="84" rx="3" fill="#1d1d1d"/><rect x="18" y="26" width="64" height="8" fill="#ffd54a"/><g stroke="#fff" stroke-width="2" stroke-opacity=".8"><path d="M20 46h40M20 58h40M20 70h40M20 82h40"/><path d="M68 46h12M68 58h12M68 70h12M68 82h12"/></g>',
};

/* =====================================================================
   CÁC MÓN → NHIỀU GÓC CHỤP
   tilt: flat (máy nằm phẳng) | angle (nghiêng 45°) | upright (dựng thẳng) | none
   ===================================================================== */
const MODES = {
  pho: {
    icon: "🍜", name: "Tô phở / bún / mì", desc: "Tô nước, đang bốc khói", facing: "environment",
    subject: "tô phở",
    prep: [
      { icon: "🪟", head: "Dọn tô ra chỗ sáng", text: "Nhờ/dịch tô phở ra gần cửa sổ hoặc cửa quán. Đèn vàng trên trần làm nước dùng ngả vàng, kém ngon.", dg: "light" },
      { icon: "🧽", head: "Làm đẹp tô phở", text: "Lau giọt nước dùng bắn ra viền tô. Xếp rau thơm, chanh, ớt lên mặt tô hoặc để cạnh tô cho có màu." },
      { icon: "⏱️", head: "Chụp trong 30 giây", text: "Phở còn bốc khói thì ảnh mới 'ngon'. Chuẩn bị xong rồi mới bắt đầu. App không bật flash – đúng ý rồi đấy!" },
    ],
    angles: [
      { key: "topdown", name: "Từ trên xuống", desc: "Tô tròn, gọn, nhiều màu rau", tilt: "flat",
        guide: '<circle cx="50" cy="50" r="38"/>',
        frameTitle: "Vừa khít vòng tròn", frameDesc: "Đưa máy lên/xuống cho tô vừa trong vòng tròn, thấy trọn viền tô.",
        tips: ["Hợp nhất khi tô có nhiều topping, màu sắc đẹp.", "Đứng thẳng người phía trên tô, đừng để bóng đầu rơi lên nước dùng.", "Chừa chút viền bàn xung quanh tô."],
        shoot: "Bấm nút tròn trắng. Chụp liền 3 tấm." },
      { key: "angle", name: "Nghiêng 45°", desc: "Thấy khói, sợi và độ sâu", tilt: "angle",
        guide: '<ellipse cx="50" cy="62" rx="40" ry="26"/>',
        frameTitle: "Tô nằm giữa khung", frameDesc: "Hạ máy ngang gần tầm bàn, để khói bốc lên ở khoảng trống phía trên tô.",
        tips: ["Góc 'ngon' nhất để thấy khói và nước dùng.", "Chừa khoảng trống phía trên tô để khói có chỗ bay.", "Nền phía sau càng gọn càng tốt (tường, rèm, người ngồi mờ)."],
        shoot: "Bấm nút tròn trắng. Chụp ngay khi khói còn nhiều." },
      { key: "close", name: "Đũa gắp sợi (cận cảnh)", desc: "Nhờ người gắp sợi lên cho 'thèm'", tilt: "angle",
        guide: '<path d="M90 6L46 54M97 14L54 58"/><ellipse cx="50" cy="105" rx="52" ry="22"/>',
        frameTitle: "Tập trung vào sợi phở", frameDesc: "Nhờ người ngồi cùng gắp sợi phở nhấc lên khỏi tô, lại gần cho đũa và sợi chiếm giữa khung.",
        tips: ["Cần 2 người: một người gắp, một người chụp.", "Bước lại gần thay vì zoom.", "Chụp liên tục 4–5 tấm vì sợi phở rơi rất nhanh."],
        shoot: "Bấm nút tròn trắng khi đũa nhấc sợi lên cao nhất." },
      { key: "offset", name: "Lệch tâm + chanh/ớt", desc: "Ảnh có không gian, 'sang' hơn", tilt: "flat",
        guide: '<circle cx="67" cy="63" r="28"/>',
        frameTitle: "Tô ở 1/3 bên phải", frameDesc: "Đặt tô vào vòng tròn bên phải; bên trái để chanh, ớt, muỗng, hoặc để trống.",
        tips: ["Đặt tô ở chấm vàng bên phải (giao điểm lưới).", "Phần trống bên trái để chữ nếu đăng bài/menu.", "Bày chanh, ớt, đĩa quẩy cạnh tô cho có câu chuyện."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  table: {
    icon: "🍽️", name: "Cả bàn nhiều món", desc: "Bàn ăn, đồ ăn nhóm", facing: "environment",
    subject: "bàn ăn",
    prep: [
      { icon: "🧹", head: "Dọn bàn trước", text: "Bỏ chai lọ, khăn giấy, điện thoại, vỏ chai ra khỏi bàn. Bàn càng gọn ảnh càng đẹp." },
      { icon: "🍲", head: "Gom các món lại", text: "Đẩy các đĩa lại gần nhau, đủ chạm mép. Món chính ở giữa, món phụ xung quanh." },
      { icon: "🪟", head: "Ngồi chỗ sáng", text: "Chọn bàn gần cửa sổ/cửa ra vào. Tránh bàn nằm ngay dưới đèn vàng.", dg: "light" },
    ],
    angles: [
      { key: "topdown", name: "Từ trên xuống", desc: "Thấy hết các món, gọn gàng", tilt: "flat",
        guide: '<rect x="8" y="8" width="84" height="84" rx="6" stroke-dasharray="3 2"/>',
        frameTitle: "Thấy hết các món", frameDesc: "Đứng lên, giơ máy cao cho thấy tất cả các món, chừa chút viền quanh bàn.",
        tips: ["Đứng lên ghế/đứng lùi nếu bàn lớn.", "Đừng để bóng người đổ lên bàn.", "Chụp 2–3 tấm, mỗi tấm đổi nhẹ chỗ đứng."],
        shoot: "Bấm nút tròn trắng." },
      { key: "angle", name: "Nghiêng chéo 45°", desc: "Có chiều sâu, thấy không khí quán", tilt: "angle",
        guide: '<ellipse cx="50" cy="75" rx="44" ry="24"/>',
        frameTitle: "Món gần nằm dưới khung", frameDesc: "Đứng ở đầu bàn, nghiêng máy chéo xuống; món gần ở phía dưới, món xa ở phía trên.",
        tips: ["Món gần camera nên là món đẹp nhất.", "Phía xa có thể thấy tường/quán cho có không khí.", "Tránh để thấy rác, đĩa bẩn ở rìa khung."],
        shoot: "Bấm nút tròn trắng." },
      { key: "hands", name: "Có tay gắp món", desc: "Ảnh sống động, có người ăn", tilt: "flat",
        guide: '<rect x="8" y="8" width="84" height="84" rx="6" stroke-dasharray="3 2"/>',
        frameTitle: "Có tay trong khung", frameDesc: "Nhờ người cầm đũa/gắp món, hoặc cầm ly; để bàn tay vào một góc khung.",
        tips: ["Hai tay nên vào từ rìa khung, không che món.", "Chọn người tay gọn, không đeo đồ rối mắt.", "Chụp lúc đang gắp, đừng chụp lúc tay dừng cứng."],
        shoot: "Bấm nút tròn trắng khi tay đang gắp." },
    ],
  },
  dish: {
    icon: "🥘", name: "Một món cận cảnh", desc: "Cơm, gỏi, nướng, bánh…", facing: "environment",
    subject: "món ăn",
    prep: [
      { icon: "🪟", head: "Ánh sáng từ bên hông", text: "Ngồi sao cho cửa sổ nằm ở bên trái hoặc phải món. Ánh sáng chiếu ngang làm món bóng, nổi khối.", dg: "light" },
      { icon: "🧽", head: "Lau viền đĩa", text: "Lau vết nước sốt, dầu mỡ quanh viền đĩa. Chỉnh rau, chanh cho gọn mắt." },
      { icon: "👋", head: "Đừng để bóng tay", text: "Cẩn thận bóng tay và bóng điện thoại đổ lên món. Nếu có bóng, xoay nhẹ đĩa." },
    ],
    angles: [
      { key: "angle", name: "Nghiêng 45°", desc: "Góc đẹp nhất cho hầu hết món", tilt: "angle",
        guide: '<ellipse cx="50" cy="62" rx="40" ry="26"/>',
        frameTitle: "Bước lại gần", frameDesc: "Đừng zoom. Đưa máy lại gần cho món chiếm gần hết khung; chỗ ngon nhất đặt gần chấm vàng.",
        tips: ["Góc an toàn: món nào cũng đẹp.", "Để phần ngon nhất (nhiều sốt, nhiều topping) hướng về phía camera.", "Nền phía sau gọn gàng."],
        shoot: "Chạm nhẹ vào món trên màn hình để lấy nét rồi bấm nút chụp." },
      { key: "topdown", name: "Từ trên xuống", desc: "Món dẹt: pizza, bánh, cơm đĩa", tilt: "flat",
        guide: '<circle cx="50" cy="50" r="38"/>',
        frameTitle: "Đĩa nằm giữa khung", frameDesc: "Giơ máy phía trên đĩa cho đĩa nằm giữa vòng tròn, chừa viền bàn.",
        tips: ["Hợp món dẹt, trải rộng.", "Thêm đũa/muỗng/ly bên cạnh cho có bối cảnh.", "Tránh bóng người đổ lên đĩa."],
        shoot: "Bấm nút tròn trắng." },
      { key: "low", name: "Ngang tầm đĩa", desc: "Món cao: burger, bánh kem, bánh mì", tilt: "upright",
        guide: '<path d="M10 82h80"/><rect x="26" y="30" width="48" height="50" rx="4"/>',
        frameTitle: "Món nằm ở giữa", frameDesc: "Hạ thấp máy ngang bằng mặt đĩa, thẳng đứng, để thấy các lớp của món.",
        tips: ["Rất hợp burger, bánh mì kẹp, bánh nhiều tầng.", "Giữ máy thật thẳng để món không bị nghiêng.", "Nền phía sau để mờ/gọn."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  drink: {
    icon: "🧋", name: "Đồ uống", desc: "Cà phê, trà sữa, nước ép", facing: "environment",
    subject: "ly nước",
    prep: [
      { icon: "🪟", head: "Ly gần cửa sổ", text: "Đặt ly cạnh cửa sổ, ánh sáng từ sau hoặc bên hông làm đồ uống trong và lấp lánh.", dg: "light" },
      { icon: "🧻", head: "Lau ly", text: "Lau hơi nước và dấu vân tay trên ly. Đặt ly trên nền gọn (mặt bàn trơn, khăn, quyển sách)." },
    ],
    angles: [
      { key: "side", name: "Ngang tầm ly", desc: "Thấy màu và các lớp đồ uống", tilt: "upright",
        guide: '<path d="M32 12h36l-6 78H38z"/>',
        frameTitle: "Ly nằm giữa khung", frameDesc: "Máy ngang tầm giữa ly, ly nằm dọc giữa khung, chừa lề hai bên.",
        tips: ["Ánh sáng từ sau ly làm đồ uống trong và lấp lánh.", "Lau ly kỹ trước khi chụp.", "Ống hút nghiêng nhẹ nhìn tự nhiên hơn."],
        shoot: "Bấm nút tròn trắng." },
      { key: "topdown", name: "Từ trên xuống", desc: "Latte art, ly có topping", tilt: "flat",
        guide: '<circle cx="50" cy="50" r="34"/>',
        frameTitle: "Miệng ly vừa vòng tròn", frameDesc: "Giơ máy phía trên ly cho miệng ly nằm giữa vòng tròn.",
        tips: ["Hợp cà phê có latte art, trà sữa nhiều topping.", "Đặt ly cạnh sách/cây nhỏ cho có bối cảnh.", "Chú ý bóng điện thoại trên mặt nước."],
        shoot: "Bấm nút tròn trắng." },
      { key: "hand", name: "Cầm ly trên tay", desc: "Có người, thân thiện", tilt: "upright",
        guide: '<path d="M34 10h32l-5 70H39z"/>',
        frameTitle: "Tay cầm ly giữa khung", frameDesc: "Nhờ người cầm ly (hoặc tự cầm), giơ ly lên giữa khung, nền phía sau gọn.",
        tips: ["Cầm ly ở thân dưới, đừng che logo/nhãn.", "Tay sạch, móng gọn.", "Chọn nền xa, mờ phía sau."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  shop: {
    icon: "🏮", name: "Quán / biển hiệu", desc: "Mặt tiền, không gian quán", facing: "environment",
    subject: "biển hiệu",
    prep: [
      { icon: "🚶", head: "Lùi ra xa", text: "Đứng cách quán đủ xa để thấy cả biển hiệu và mặt tiền. Đừng chụp sát cửa." },
      { icon: "👥", head: "Chọn lúc có khách", text: "Quán có vài người ngồi ăn thì ảnh có không khí hơn quán vắng. Đợi người/xe đi qua khung rồi mới chụp." },
      { icon: "🌙", head: "Ban đêm", text: "Tối thì dựa vào tường/cột cho đỡ rung tay. Bật hẹn giờ 3 giây (nút ⏱ phía trên).", dg: "steady" },
    ],
    angles: [
      { key: "front", name: "Chính diện mặt tiền", desc: "Ảnh chính để đăng, làm bìa", tilt: "upright",
        guide: '<path d="M14 90V34h72v56M10 34h80"/>',
        frameTitle: "Thấy cả biển hiệu", frameDesc: "Lùi ra xa cho thấy toàn bộ biển hiệu và cửa quán, không bị cắt mất chữ.",
        tips: ["Đứng ngay chính giữa quán để hai bên cân đối.", "Giữ máy thật thẳng (đường xanh) để quán không méo.", "Đợi xe/người đi qua rồi mới chụp."],
        shoot: "Bấm nút tròn trắng." },
      { key: "corner", name: "Đứng chéo góc", desc: "Có chiều sâu, nhìn 'chuyên nghiệp'", tilt: "upright",
        guide: '<path d="M4 40L50 30v52L4 94zM50 30l46 8v44L50 82z"/>',
        frameTitle: "Thấy hai mặt quán", frameDesc: "Đứng chéo ở góc, cho thấy cả mặt tiền lẫn một bên hông quán.",
        tips: ["Cho thấy quán có không gian, đường phố.", "Đừng nghiêng máy – hãy xoay người để chéo.", "Chừa chút trời phía trên."],
        shoot: "Bấm nút tròn trắng." },
      { key: "inside", name: "Không gian bên trong", desc: "Bàn ghế, đèn, không khí", tilt: "upright",
        guide: '<path d="M0 125L20 64h60l20 61z"/>',
        frameTitle: "Thấy dãy bàn ghế", frameDesc: "Đứng ở cửa hoặc đầu quán, nhìn thẳng vào trong cho thấy dãy bàn và đèn.",
        tips: ["Chụp lúc có vài khách ngồi.", "Cầm máy ngang (xoay điện thoại nằm ngang) cho rộng hơn.", "Đứng gần cửa sổ để ánh sáng tự nhiên chiếu vào."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  portrait: {
    icon: "🙂", name: "Selfie cùng món", desc: "Chụp mặt, chụp cùng món", facing: "user",
    subject: "mặt bạn",
    prep: [
      { icon: "🪟", head: "Quay mặt về phía sáng", text: "Ngồi sao cho cửa sổ/cửa quán ở phía trước mặt hoặc bên cạnh, đừng để ở sau lưng.", dg: "light" },
      { icon: "🍜", head: "Đưa món vào khung", text: "Đặt món ăn cạnh mặt bạn, hoặc cầm đũa gắp giơ lên – ảnh sẽ có câu chuyện." },
    ],
    angles: [
      { key: "face", name: "Mặt + món bên cạnh", desc: "Cười cùng tô phở/ly nước", tilt: "none",
        guide: '<ellipse cx="46" cy="50" rx="24" ry="30"/>',
        frameTitle: "Mặt và món cùng vào khung", frameDesc: "Cầm máy ngang tầm mắt hoặc cao hơn một chút, mắt ở 1/3 phía trên, món ăn ở góc dưới.",
        tips: ["Nhìn thẳng vào camera trước, không nhìn màn hình.", "Cười tự nhiên: nghĩ đến món ngon rồi mới bấm.", "Món để thấp, đừng che mặt."],
        shoot: "Bấm nút tròn trắng." },
      { key: "chop", name: "Gắp món lên", desc: "Đũa gắp sợi phở lên miệng", tilt: "none",
        guide: '<ellipse cx="40" cy="55" rx="22" ry="28"/>',
        frameTitle: "Đũa và mặt trong khung", frameDesc: "Giơ đũa gắp món lên gần miệng, đưa cả mặt và món vào khung.",
        tips: ["Đừng ăn vội – giữ đũa ở khoảng cách chụp được.", "Nhờ người chụp sẽ đẹp hơn tự selfie.", "Cười sau khi gắp, không ngậm đầy miệng."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  grill: {
    icon: "🔥", name: "Đồ nướng", desc: "BBQ, thịt nướng, xiên", facing: "environment",
    subject: "đồ nướng",
    prep: [
      { icon: "💨", head: "Chụp lúc còn khói", text: "Thịt vừa lên bếp, còn xèo xèo và khói là đẹp nhất. Đừng để nguội." },
      { icon: "🧽", head: "Gọn vỉ nướng", text: "Gạt bớt mỡ cháy, tro, đồ thừa. Xếp rau, ớt, tỏi cạnh miếng thịt cho có màu." },
      { icon: "🪟", head: "Cần sáng hơn bình thường", text: "Quán nướng thường tối. Bật thêm đèn, hoặc nhờ người cầm đèn pin điện thoại soi nghiêng từ bên hông (không soi thẳng).", dg: "light" },
    ],
    angles: [
      { key: "topdown", name: "Từ trên xuống", desc: "Cả vỉ thịt, nhiều miếng", tilt: "flat",
        guide: '<circle cx="50" cy="50" r="38"/>',
        frameTitle: "Vỉ nướng vừa khung", frameDesc: "Giơ máy phía trên vỉ cho thấy cả vỉ nướng và các miếng thịt.",
        tips: ["Xếp thịt đều tay, đừng chồng lên nhau.", "Tránh bóng đầu đổ lên vỉ.", "Chụp nhanh khi thịt còn đỏ hồng và bóng mỡ."],
        shoot: "Bấm nút tròn trắng." },
      { key: "angle", name: "Nghiêng 45° (có khói)", desc: "Thấy khói và độ bóng", tilt: "angle",
        guide: '<ellipse cx="50" cy="68" rx="42" ry="22"/>',
        frameTitle: "Thịt ở giữa, chừa chỗ khói", frameDesc: "Hạ máy xuống, để khói bay lên ở phía trên khung.",
        tips: ["Nền tối phía sau làm khói nổi lên rất đẹp.", "Lấy nét vào miếng thịt gần nhất.", "Chụp liền vài tấm vì khói đổi hình liên tục."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  hotpot: {
    icon: "🍲", name: "Lẩu", desc: "Nồi lẩu, nhúng, bàn lẩu", facing: "environment",
    subject: "nồi lẩu",
    prep: [
      { icon: "🥬", head: "Bày nguyên liệu đẹp", text: "Xếp rau, thịt, nấm thành từng đĩa gọn quanh nồi trước khi chụp." },
      { icon: "♨️", head: "Chờ nước sôi nhẹ", text: "Nước vừa sôi, có hơi bốc lên nhưng chưa trào. Hơi nước làm ảnh có cảm giác nóng hổi." },
      { icon: "🪟", head: "Tránh hơi làm mờ ống kính", text: "Đừng giơ máy sát nồi, hơi nước làm mờ camera. Lau ống kính nếu bị mờ.", dg: "steady" },
    ],
    angles: [
      { key: "topdown", name: "Từ trên xuống", desc: "Nồi + đĩa nguyên liệu", tilt: "flat",
        guide: '<circle cx="50" cy="50" r="38"/>',
        frameTitle: "Nồi lẩu nằm giữa", frameDesc: "Đưa nồi vào giữa khung, đĩa nguyên liệu bao quanh.",
        tips: ["Nồi hai ngăn (cay/không cay) đẹp nhất khi chụp từ trên xuống.", "Để các đĩa quanh nồi cân đối.", "Tránh vật lạ, chai lọ trong khung."],
        shoot: "Bấm nút tròn trắng." },
      { key: "angle", name: "Nghiêng 45° (hơi nóng)", desc: "Thấy hơi bốc, đĩa phía trước", tilt: "angle",
        guide: '<ellipse cx="50" cy="68" rx="42" ry="22"/>',
        frameTitle: "Nồi + đĩa phía trước", frameDesc: "Nồi ở giữa, đĩa nguyên liệu nằm phía trước, hơi nóng bốc lên phía trên.",
        tips: ["Chụp lúc có hơi bốc lên nhiều.", "Đĩa gần camera nên là đĩa đẹp nhất.", "Nền sau gọn, tránh người đi lại."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  dessert: {
    icon: "🍰", name: "Bánh / tráng miệng", desc: "Bánh ngọt, kem, chè", facing: "environment",
    subject: "chiếc bánh",
    prep: [
      { icon: "🪟", head: "Gần cửa sổ, sáng nhẹ", text: "Bánh ngọt hợp ánh sáng sáng nhẹ từ bên hông. Đèn vàng làm kem trắng bị ngả vàng.", dg: "light" },
      { icon: "🧁", head: "Đặt trên nền sạch", text: "Dùng đĩa trắng hoặc nền trơn. Lau vụn bánh, vết kem quanh đĩa." },
    ],
    angles: [
      { key: "angle", name: "Nghiêng 45°", desc: "Góc đẹp cho bánh nhiều lớp", tilt: "angle",
        guide: '<ellipse cx="50" cy="62" rx="36" ry="26"/>',
        frameTitle: "Bánh ở giữa khung", frameDesc: "Lại gần cho bánh chiếm phần lớn khung; phần đẹp nhất hướng về camera.",
        tips: ["Để thấy được các lớp kem, bánh.", "Thêm nĩa/thìa cạnh đĩa cho có bối cảnh.", "Lấy nét vào phần kem hoặc topping."],
        shoot: "Bấm nút tròn trắng." },
      { key: "side", name: "Ngang tầm bánh", desc: "Thấy các lớp từ bên hông", tilt: "upright",
        guide: '<path d="M20 90L80 90L50 24z"/>',
        frameTitle: "Miếng bánh giữa khung", frameDesc: "Hạ máy ngang tầm, thẳng đứng, để thấy các lớp bánh.",
        tips: ["Hợp miếng bánh cắt sẵn, thấy rõ từng lớp.", "Giữ máy thật thẳng.", "Nền phía sau nên trơn, sáng."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
  menu: {
    icon: "📋", name: "Menu / bảng giá", desc: "Giấy menu, bảng viết", facing: "environment",
    subject: "menu",
    prep: [
      { icon: "🧼", head: "Làm phẳng menu", text: "Đặt menu lên mặt bàn phẳng, vuốt cho hết nhăn. Lau bụi bẩn, vết dầu." },
      { icon: "🪟", head: "Đủ sáng, không chói", text: "Tránh đèn chiếu thẳng gây loá chữ. Ánh sáng bên hông là tốt nhất.", dg: "light" },
    ],
    angles: [
      { key: "flat", name: "Chụp thẳng từ trên", desc: "Menu đặt trên bàn", tilt: "flat",
        guide: '<rect x="14" y="8" width="72" height="84" rx="3"/>',
        frameTitle: "Menu vừa khít khung", frameDesc: "Giơ máy phía trên, cho menu vừa trong khung, các cạnh thẳng song song với mép màn hình.",
        tips: ["Đừng để bóng điện thoại hoặc tay đổ lên chữ.", "Chữ nhỏ vẫn đọc được: đứng cao hơn một chút.", "Chụp từng trang riêng, đừng chụp lệch."],
        shoot: "Bấm nút tròn trắng." },
      { key: "wall", name: "Bảng giá trên tường", desc: "Bảng treo, bảng đen", tilt: "upright",
        guide: '<rect x="12" y="14" width="76" height="76" rx="3"/>',
        frameTitle: "Bảng nằm giữa khung", frameDesc: "Đứng đối diện chính giữa bảng, dựng máy thẳng, chừa chút lề xung quanh.",
        tips: ["Đứng thẳng trước bảng, đừng đứng chéo.", "Tránh chói phản chiếu: nghiêng người nhẹ nếu thấy loá.", "Giữ máy thật thẳng để chữ không bị méo."],
        shoot: "Bấm nút tròn trắng." },
    ],
  },
};
