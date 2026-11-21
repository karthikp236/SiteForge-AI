// ─────────────────────────────────────────────────────────────────────────────
//  previewScript.js  (fixed)
//
//  What was wrong (nav links wrapping / overlapping in the preview):
//   1. RESPONSIVE_PREVIEW_CSS forced `min-width:0 !important; max-width:100%`
//      on nav, nav children and every <a>/<button>. In a flex row that lets
//      each link shrink BELOW its text width → "How It Works" wraps to 3 lines,
//      "Membership" overlaps "Success Stories", "Consultation" overlaps "Sign In".
//   2. `word-break:break-word` / `overflow-wrap:anywhere` on headings/paragraphs
//      shrinks min-content sizes, which makes flex/grid items squash further.
//   3. `[class*=container]{max-width:100%!important}` was applied globally,
//      overriding the site's own max-width (containers stretched edge-to-edge).
//   4. `[class*="header"]` was made sticky + white — it matched things like
//      `.section-header` and nested nav wrappers.
//   5. The hamburger only existed at <=768px, so a desktop-width preview that is
//      simply too narrow for the nav (like the screenshot) had no fallback.
//   6. Clicks on the hamburger / modal buttons were hijacked by the generic
//      handler and showed a bogus "Coming soon" toast.
//
//  What this version does:
//   • Nav links / logo never shrink or wrap on desktop (white-space:nowrap,
//     flex-shrink:0).
//   • A JS "fit" check measures the header. If the nav doesn't fit at the
//     current width (any width, not just <=768px) the header switches to the
//     hamburger layout (html.__ms-compact) instead of overlapping.
//   • Injected iframe JS is written with String.raw, so there is no fragile
//     double-escaping of \s, \/, \" etc.
// ─────────────────────────────────────────────────────────────────────────────

export const MODAL_CSS = `
.__ms-back{position:fixed;inset:0;background:rgba(15,17,21,.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:2147483646;animation:__ms-in .2s ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif}
.__ms-card{background:#fff;color:#0f172a;width:min(440px,92vw);border-radius:18px;box-shadow:0 30px 80px -10px rgba(0,0,0,.4);padding:28px;position:relative;animation:__ms-pop .25s cubic-bezier(.2,.9,.4,1.2)}
.__ms-x{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:8px;background:transparent;border:0;cursor:pointer;color:#64748b;font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center}
.__ms-x:hover{background:#f1f5f9;color:#0f172a}
.__ms-title{font-size:20px;font-weight:700;letter-spacing:-.02em;margin:0 0 4px}
.__ms-sub{font-size:13px;color:#64748b;margin:0 0 18px}
.__ms-fld{margin-bottom:12px}
.__ms-fld label{display:block;font-size:12px;font-weight:600;color:#334155;margin-bottom:6px}
.__ms-fld input,.__ms-fld textarea,.__ms-fld select{width:100%;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:inherit;color:#0f172a;background:#fff;outline:none;transition:border-color .15s,box-shadow .15s;box-sizing:border-box}
.__ms-fld input:focus,.__ms-fld textarea:focus,.__ms-fld select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
.__ms-fld textarea{min-height:80px;resize:vertical}
.__ms-go{width:100%;padding:11px;border-radius:10px;background:linear-gradient(135deg,#ff5c5c,#ff8a4c);color:#fff;font-weight:600;font-size:14px;border:0;cursor:pointer;margin-top:6px;transition:transform .15s,box-shadow .15s}
.__ms-go:hover{transform:translateY(-1px);box-shadow:0 10px 25px -8px rgba(255,138,76,.5)}
.__ms-ok{text-align:center;padding:14px 0}
.__ms-ok .__ms-tick{width:54px;height:54px;border-radius:50%;background:#dcfce7;color:#16a34a;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:28px}
.__ms-ok h3{font-size:18px;font-weight:700;margin:0 0 4px;color:#0f172a}
.__ms-ok p{font-size:13px;color:#64748b;margin:0 0 16px}
.__ms-foot{font-size:11px;color:#94a3b8;text-align:center;margin-top:10px}
.__ms-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:500;z-index:2147483647;box-shadow:0 20px 40px -10px rgba(0,0,0,.4);animation:__ms-toast-in .3s ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif}

/* ── Cart panel (slides in from right) ── */
.__ms-cart-back{justify-content:flex-end}
.__ms-cart-panel{background:#fff;color:#0f172a;width:min(440px,100vw);height:100vh;display:flex;flex-direction:column;animation:__ms-slide-in .25s cubic-bezier(.2,.9,.4,1)}
.__ms-cart-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #e2e8f0}
.__ms-cart-head h2{margin:0;font-size:18px;font-weight:700;letter-spacing:-.02em}
.__ms-cart-body{flex:1;overflow-y:auto;padding:8px 16px}
.__ms-cart-empty{text-align:center;padding:48px 16px;color:#64748b}
.__ms-cart-empty p{margin:8px 0 0;font-size:14px;font-weight:600;color:#0f172a}
.__ms-cart-empty-sub{font-size:12px!important;color:#94a3b8!important;font-weight:400!important;margin-top:4px!important}
.__ms-cart-row{display:grid;grid-template-columns:60px 1fr auto;gap:12px;align-items:center;padding:12px 8px;border-bottom:1px solid #f1f5f9}
.__ms-cart-row img{width:60px;height:60px;border-radius:10px;object-fit:cover;display:block}
.__ms-cart-imgph{width:60px;height:60px;border-radius:10px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:24px}
.__ms-cart-info{min-width:0}
.__ms-cart-name{font-size:14px;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.__ms-cart-price{font-size:13px;color:#64748b;margin-top:2px}
.__ms-cart-qty{display:flex;align-items:center;gap:6px}
.__ms-cart-qty button{width:28px;height:28px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;font-size:16px;line-height:1;color:#0f172a;display:flex;align-items:center;justify-content:center;padding:0}
.__ms-cart-qty button:hover{background:#f1f5f9}
.__ms-cart-qty span{min-width:18px;text-align:center;font-size:14px;font-weight:600}
.__ms-cart-foot{padding:16px 24px;border-top:1px solid #e2e8f0;background:#fafbfc}
.__ms-cart-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:15px}
.__ms-cart-total{font-weight:700;font-size:18px;color:#0f172a}
.__ms-cart-checkout{width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,#ff5c5c,#ff8a4c);color:#fff;font-weight:600;font-size:14px;border:0;cursor:pointer;transition:transform .15s,box-shadow .15s}
.__ms-cart-checkout:hover{transform:translateY(-1px);box-shadow:0 10px 25px -8px rgba(255,138,76,.5)}

/* ── Floating cart FAB (only shown if AI forgot a header cart icon) ── */
.__ms-fab{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#ff5c5c,#ff8a4c);color:#fff;font-size:22px;border:0;cursor:pointer;box-shadow:0 12px 28px -8px rgba(255,92,92,.55);z-index:2147483645;display:flex;align-items:center;justify-content:center;padding:0;font-family:inherit}
.__ms-fab .cart-count{position:absolute;top:-4px;right:-4px;background:#0f172a;color:#fff;font-size:11px;font-weight:700;border-radius:999px;min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;padding:0 5px}
.__ms-pulse{animation:__ms-pulse .35s ease}

@keyframes __ms-in{from{opacity:0}to{opacity:1}}
@keyframes __ms-pop{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes __ms-toast-in{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes __ms-slide-in{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes __ms-pulse{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Hamburger / compact-header CSS.
// Generated twice:
//   • prefix ""                    → inside @media(max-width:768px)  (CSS-only fallback)
//   • prefix "html.__ms-compact "  → applied by JS whenever the nav doesn't fit
// ─────────────────────────────────────────────────────────────────────────────
function compactCss(p) {
  return [
    `${p}.__ms-hamburger{display:inline-flex!important;margin-left:auto!important;order:99!important}`,
    // Hide the standalone auth buttons; they're cloned into the dropdown.
    `${p}.__ms-auth-original,${p}.__ms-auth-original-wrap{display:none!important}`,
    // Hide the nav until the hamburger opens it.
    `${p}nav.__ms-nav-collapsible,${p}.__ms-nav-collapsible{display:none!important}`,
    // Cloned auth block inside the open menu.
    `${p}.__ms-nav-open .__ms-auth-mobile{display:flex!important;flex-direction:column!important;gap:.4rem!important;width:100%!important;padding-top:.5rem!important;margin-top:.5rem!important;border-top:1px solid rgba(0,0,0,.08)!important}`,
    `${p}.__ms-auth-clone{display:block!important;width:100%!important;padding:.75rem 1rem!important;font-size:.95rem!important;text-align:center!important;border-radius:8px!important;color:#0f172a!important;border:1px solid rgba(0,0,0,.12)!important;text-decoration:none!important}`,
    `${p}.__ms-auth-clone.__ms-auth-primary{background:var(--primary,#1d4ed8)!important;color:#fff!important;border-color:var(--primary,#1d4ed8)!important;font-weight:600!important}`,
    // Open state: overlay dropdown anchored to the header.
    `${p}nav.__ms-nav-collapsible.__ms-nav-open,${p}.__ms-nav-collapsible.__ms-nav-open{display:flex!important;flex-direction:column!important;align-items:stretch!important;position:absolute!important;top:100%!important;left:0!important;right:0!important;width:100%!important;max-width:100%!important;background:#fff!important;color:#0f172a!important;padding:.5rem!important;gap:.15rem!important;box-shadow:0 18px 40px -8px rgba(0,0,0,.18)!important;border-top:1px solid rgba(0,0,0,.06)!important;z-index:60!important;max-height:calc(100vh - 60px)!important;overflow-y:auto!important}`,
    `${p}.__ms-nav-collapsible.__ms-nav-open a{display:block!important;width:100%!important;padding:.75rem 1rem!important;font-size:1rem!important;text-align:left!important;border-radius:8px!important;color:#0f172a!important;white-space:normal!important;line-height:1.3!important}`,
    `${p}.__ms-nav-collapsible.__ms-nav-open a:hover{background:rgba(0,0,0,.04)!important}`,
  ].join("\n");
}

// Defensive CSS injected into every preview so AI-generated pages can't
// blow up the layout.
export const FIX_CSS = `
<style id="__mintsite_fix__">
*,*::before,*::after{box-sizing:border-box}
body{overflow-x:hidden!important;position:relative;margin:0}
/* NOTE: no word-break:break-word — it shrinks min-content and squashes flex items */
h1,h2,h3,h4,p{overflow-wrap:break-word;max-width:100%}
img,svg,video,iframe{max-width:100%;height:auto}
.product-card img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block}
.blob,[class*="blob"],[class*="gradient-orb"],[class*="bg-blur"]{position:fixed!important;z-index:0!important;opacity:.15!important;pointer-events:none!important;max-width:500px!important;max-height:500px!important}
section,main,.hero,[id="home"],[id="features"],[id="pricing"],[id="testimonials"],[id="faq"],[id="contact"],[id="about"],[id="cta"],[id="how-it-works"],[id="products"],[id="menu"],[id="shop"],[id="portfolio"],article,.container{position:relative;z-index:1}

/* Sticky header is applied from JS (see __ms_headerBg), and ONLY to headers that are in normal
   flow. Forcing position/backdrop-filter from CSS broke off-canvas mobile menus (position:fixed
   drawers became in-flow lists) and trapped fixed children inside the header. */

/* ── Desktop nav protection: links and logo never shrink, wrap or overlap.
      If they don't fit, JS switches the header to hamburger mode. ── */
html.__ms-guard header a,html.__ms-guard header button,html.__ms-guard nav a,html.__ms-guard nav button{white-space:nowrap}
html.__ms-guard header .logo,html.__ms-guard header [class*="logo"],html.__ms-guard header [class*="brand"]{white-space:nowrap!important;flex-shrink:0!important}
html.__ms-guard:not(.__ms-compact) header nav,
html.__ms-guard:not(.__ms-compact) header nav li,
html.__ms-guard:not(.__ms-compact) header nav a,
html.__ms-guard:not(.__ms-compact) header [class*="nav-links"] > *,
html.__ms-guard:not(.__ms-compact) header [class*="nav-menu"] > *{flex-shrink:0}

.hero-card,[class*="hero-card"],[class*="hero-image"],[class*="hero-visual"]{max-width:100%;overflow:hidden}
[class*="grid"]{max-width:100%;overflow:hidden}

/* Card grids: never let columns collapse to one-letter-per-line. */
.product-grid,[class*="product-grid"],.grid-2,.grid-3,.grid-4,[class*="grid-2"],[class*="grid-3"],[class*="grid-4"]{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))!important;gap:1.5rem!important;align-items:stretch!important}
section>h1,section>h2,section>h3,section>p,section>.product-grid,section .container>h1,section .container>h2,section .container>h3,section .container>p,section .container>.product-grid{grid-column:1/-1!important}

.price,.add-to-cart,[data-add-to-cart]{white-space:nowrap!important}

section:not(.hero):not([class*="hero"]):not([id="home"]):not([id="hero"]){padding-top:clamp(2.5rem,5vw,4rem)!important;padding-bottom:clamp(2.5rem,5vw,4rem)!important}

/* A 2-column .hero reused as a simple centred page header */
.hero>.container,.hero-content,.hero .container{flex-wrap:wrap}
.hero>.container>h1,.hero>.container>h2,.hero>.container>h3,.hero>.container>p,.hero>.container>span,.hero>.container>.eyebrow,.hero>.container>.btn,.hero>.container>.ctas,.hero>.container>a{flex-basis:100%!important;max-width:100%!important}

/* CTA-band button must stay readable */
.cta-band .btn,.cta-band a.btn,.cta-band button,.cta-section .btn,.cta-section a.btn{background:#fff!important;color:var(--primary,#1d4ed8)!important;border-color:#fff!important}

/* ── Form fields ── */
form input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]),form textarea,form select{display:block!important;width:100%!important;box-sizing:border-box!important;padding:.7rem .9rem!important;margin-top:.35rem!important;border:1px solid rgba(15,23,42,.16)!important;border-radius:.6rem!important;background:#fff!important;color:#0f172a!important;font-size:.95rem!important;font-family:inherit!important;line-height:1.4!important}
form input::placeholder,form textarea::placeholder{color:#94a3b8!important}
form input:focus,form textarea:focus,form select:focus{outline:none!important;border-color:var(--primary,#6366f1)!important;box-shadow:0 0 0 3px rgba(99,102,241,.18)!important}
form textarea{min-height:120px!important;resize:vertical!important}
form label{display:block!important;margin-top:.9rem!important;margin-bottom:.1rem!important;font-size:.85rem!important;font-weight:600!important;color:#334155!important}
form button,form [type=submit]{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:.4rem!important;margin-top:1.1rem!important;padding:.75rem 1.4rem!important;border:0!important;border-radius:.6rem!important;background:linear-gradient(135deg,var(--primary,#1d4ed8),var(--accent,#6366f1))!important;color:#fff!important;font-weight:600!important;font-size:.95rem!important;cursor:pointer!important;width:auto!important}
button:not(.cart-icon):not(.__ms-hamburger):not(.__ms-x):not(.__ms-cart-checkout):not(.__ms-go){cursor:pointer;border-radius:.5rem;font-family:inherit}
a{text-decoration:none}

/* Auth cards */
.auth-card,[class*="auth-card"]{margin:1.5rem auto!important}
.auth-card h1,.auth-card h2,[class*="auth-card"] h1,[class*="auth-card"] h2{font-size:clamp(1.4rem,3.5vw,2rem)!important;line-height:1.2!important}
[id="signin"],[id="signup"],[id="login"],[data-page="signin"],[data-page="signup"]{min-height:auto!important}

/* Primary CTAs: single-hue gradient */
.add-to-cart,[data-add-to-cart],form button[type="submit"],.btn-primary,[class*="btn-primary"]{background:linear-gradient(135deg,var(--primary,#1d4ed8),color-mix(in srgb,var(--primary,#1d4ed8) 72%,#000))!important;color:#fff!important}

/* ── Hamburger button (hidden unless compact mode / <=768px) ── */
.__ms-hamburger{display:none;background:transparent;border:0;cursor:pointer;padding:8px;color:currentColor;border-radius:8px;align-items:center;justify-content:center;transition:background .15s}
.__ms-hamburger:hover{background:rgba(0,0,0,.06)}
.__ms-hamburger.__ms-hb-active{background:rgba(0,0,0,.08)}
.__ms-auth-mobile{display:none!important}

/* ── Tight header (JS adds html.__ms-tight when the nav is slightly too wide):
      shrink gaps/padding first, so the full nav stays visible on desktop. ── */
html.__ms-tight header nav,
html.__ms-tight header nav ul,
html.__ms-tight header [class*="nav-links"],
html.__ms-tight header [class*="nav-menu"],
html.__ms-tight header [class*="menu-links"]{gap:.9rem!important;column-gap:.9rem!important}
html.__ms-tight header nav li,
html.__ms-tight header nav a{margin-left:0!important;margin-right:0!important}
html.__ms-tight header nav a{padding-left:.25rem!important;padding-right:.25rem!important;font-size:.92em!important}
html.__ms-tight header .__ms-auth-original,
html.__ms-tight header .__ms-auth-original-wrap{gap:.5rem!important}
html.__ms-tight header .__ms-auth-original{padding-left:1rem!important;padding-right:1rem!important}
html.__ms-tight header .container,
html.__ms-tight header [class*="header-inner"],
html.__ms-tight header [class*="nav-inner"],
html.__ms-tight header > div{gap:1rem!important;column-gap:1rem!important}

/* ── Compact header (set by JS when the nav doesn't fit at ANY width) ── */
${compactCss("html.__ms-compact ")}

/* ── TABLET (<=768px) ── */
@media(max-width:768px){
.container,[class*=container]{padding-left:1rem!important;padding-right:1rem!important}
${compactCss("")}
.hero,[class*="hero-grid"],[id="home"]>div,[id="home"]>.container>div{display:flex!important;flex-direction:column!important;gap:1.5rem!important}
.hero-card,[class*="hero-card"],[class*="hero-image"],[class*="hero-visual"]{max-width:100%!important;margin:0 auto!important;width:100%!important}
[class*="grid-3"],[class*="grid-4"],.grid-3,.grid-4,[class*="grid-2"],.grid-2{grid-template-columns:1fr 1fr!important;gap:1rem!important}
.product-grid,[class*=product-grid]{grid-template-columns:1fr 1fr!important;gap:1rem!important}
h1{font-size:clamp(1.6rem,5vw,2.4rem)!important;line-height:1.15!important}
h2{font-size:clamp(1.3rem,4vw,1.9rem)!important;line-height:1.2!important}
h3{font-size:1rem!important}
p,.lead{font-size:.95rem!important}
section{padding:2.5rem 0!important}
.auth-card,[class*=auth-card]{max-width:100%!important;margin:2rem 1rem!important;padding:1.5rem!important}
}

/* ── PHONE (<=480px) ── */
@media(max-width:480px){
.container,[class*=container]{padding-left:.85rem!important;padding-right:.85rem!important}
header>div,header>nav,.nav>.inner{gap:.5rem!important;padding:.6rem 1rem!important;min-height:56px!important}
header .auth,[class*=auth-buttons],[class*=header-auth]{gap:.3rem!important}
header .auth a,[class*=auth-buttons] a{padding:.4rem .65rem!important;font-size:.78rem!important}
.logo{font-size:.95rem!important}
.cart-icon{padding:6px!important;font-size:18px!important}
.cart-count{font-size:10px!important;min-width:16px!important;height:16px!important}
.hero,[class*="hero-grid"]{gap:1rem!important;padding-top:1.5rem!important}
h1{font-size:clamp(1.4rem,7vw,1.9rem)!important}
h2{font-size:clamp(1.15rem,5vw,1.5rem)!important}
[class*="grid-3"],[class*="grid-4"],.grid-3,.grid-4,[class*="grid-2"],.grid-2,.product-grid,[class*="product-grid"]{grid-template-columns:1fr!important;gap:1rem!important}
.btn-primary,.btn-ghost,button[type=submit],.ctas a,.ctas button{min-height:44px!important;padding:.75rem 1.25rem!important;font-size:.9rem!important}
.ctas{flex-direction:column!important;gap:.6rem!important;width:100%!important}
.ctas>*{width:100%!important;text-align:center!important}
.product-card,.card,article{padding:1rem!important}
.auth-card,[class*=auth-card]{max-width:100%!important;margin:1.5rem .5rem!important;padding:1.5rem!important}
footer,[class*=footer]{text-align:center!important;padding:2rem 0 1.5rem!important}
footer .foot-grid,footer [class*=foot-grid],footer .columns{grid-template-columns:1fr!important;gap:1.5rem!important}
footer .brand-block,footer [class*=brand-block]{margin:0 auto!important;max-width:280px!important}
section{padding:2rem 0!important}
body>*{max-width:100vw!important}
}
footer,[class*="footer"]{position:relative!important;z-index:1}
</style>`;

// ─────────────────────────────────────────────────────────────────────────────
// Cart logic (injected JS, no <script> wrapper)
// ─────────────────────────────────────────────────────────────────────────────
export function buildCartScript() {
  return String.raw`
var __ms_cart=[];
function __ms_money(n){return '$'+(Math.round(n*100)/100).toFixed(2)}
function __ms_esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

// A "shop site" has real product buttons or an explicit cart icon.
function __ms_isShopSite(){
  if(document.querySelector('.add-to-cart,[data-add-to-cart]'))return true;
  if(document.querySelector('.cart-icon,.cart-btn,.cart-button,.cart-toggle,[data-cart-icon]'))return true;
  return false;
}

function __ms_updateBadge(){
  var count=__ms_cart.reduce(function(s,i){return s+i.qty},0);
  var badges=document.querySelectorAll('.cart-count,.cart-badge,.cart-quantity,[data-cart-count]');
  badges.forEach(function(b){b.textContent=String(count)});
  if(badges.length===0&&(count>0||__ms_isShopSite())){__ms_ensureFloatingCart(count)}
}

function __ms_ensureFloatingCart(count){
  var fab=document.getElementById('__ms_cart_fab');
  if(!fab){
    fab=document.createElement('button');
    fab.id='__ms_cart_fab';
    fab.className='__ms-fab';
    fab.innerHTML='🛒 <span class="cart-count" data-cart-count>0</span>';
    fab.addEventListener('click',function(e){e.preventDefault();__ms_openCart()});
    document.body.appendChild(fab);
  }
  fab.querySelector('.cart-count').textContent=String(count);
}

function __ms_addToCart(btn){
  var name=btn.getAttribute('data-name')||'Item';
  var price=parseFloat(btn.getAttribute('data-price')||'0')||0;
  var image=btn.getAttribute('data-image')||'';
  if(!image){
    var card=btn.closest('article,.product-card,.card,li,div');
    var img=card&&card.querySelector('img');
    if(img)image=img.getAttribute('src')||'';
  }
  var key=name.toLowerCase();
  var existing=null;
  for(var i=0;i<__ms_cart.length;i++){if(__ms_cart[i].key===key){existing=__ms_cart[i];break}}
  if(existing){existing.qty+=1}
  else{__ms_cart.push({key:key,name:name,price:price,image:image,qty:1})}
  __ms_updateBadge();
  __ms_toast('Added: '+name);
  __ms_pulseBadge();
}

function __ms_pulseBadge(){
  var b=document.querySelector('.cart-count,.cart-badge,.cart-quantity,[data-cart-count]');
  if(!b)return;
  b.classList.remove('__ms-pulse');
  void b.offsetWidth;
  b.classList.add('__ms-pulse');
}

function __ms_changeQty(key,delta){
  for(var i=0;i<__ms_cart.length;i++){
    if(__ms_cart[i].key===key){
      __ms_cart[i].qty+=delta;
      if(__ms_cart[i].qty<=0)__ms_cart.splice(i,1);
      break;
    }
  }
  __ms_updateBadge();
  __ms_renderCart();
}

function __ms_total(){return __ms_cart.reduce(function(s,i){return s+i.price*i.qty},0)}

function __ms_renderCart(){
  var body=document.querySelector('.__ms-cart-body');
  if(!body)return;
  var ft=document.querySelector('.__ms-cart-foot');
  if(__ms_cart.length===0){
    body.innerHTML='<div class="__ms-cart-empty"><div style="font-size:42px">🛒</div><p>Your cart is empty</p><p class="__ms-cart-empty-sub">Add some products to get started.</p></div>';
    if(ft)ft.style.display='none';
    return;
  }
  var rows=__ms_cart.map(function(it){
    var img=it.image?'<img src="'+__ms_esc(it.image)+'" alt="">':'<div class="__ms-cart-imgph">🛍️</div>';
    return '<div class="__ms-cart-row">'+img+
      '<div class="__ms-cart-info"><div class="__ms-cart-name">'+__ms_esc(it.name)+'</div>'+
      '<div class="__ms-cart-price">'+__ms_money(it.price)+'</div></div>'+
      '<div class="__ms-cart-qty">'+
      '<button data-qty-minus="'+__ms_esc(it.key)+'" aria-label="Decrease">−</button>'+
      '<span>'+it.qty+'</span>'+
      '<button data-qty-plus="'+__ms_esc(it.key)+'" aria-label="Increase">+</button>'+
      '</div>'+
    '</div>';
  }).join('');
  body.innerHTML=rows;
  if(ft)ft.style.display='';
  var tot=document.querySelector('.__ms-cart-total');if(tot)tot.textContent=__ms_money(__ms_total());
}

function __ms_openCart(){
  if(document.querySelector('.__ms-cart-back'))return;
  var back=document.createElement('div');
  back.className='__ms-cart-back __ms-back';
  back.innerHTML='<div class="__ms-cart-panel" role="dialog" aria-modal="true">'+
    '<div class="__ms-cart-head"><h2>Your cart</h2>'+
    '<button class="__ms-x" aria-label="Close">&times;</button></div>'+
    '<div class="__ms-cart-body"></div>'+
    '<div class="__ms-cart-foot"><div class="__ms-cart-total-row"><span>Total</span><span class="__ms-cart-total">$0.00</span></div>'+
    '<button class="__ms-cart-checkout">Checkout</button></div>'+
  '</div>';
  document.body.appendChild(back);
  back.addEventListener('click',function(e){if(e.target===back)__ms_closeCart()});
  back.querySelector('.__ms-x').addEventListener('click',__ms_closeCart);
  back.querySelector('.__ms-cart-checkout').addEventListener('click',function(){
    if(__ms_cart.length===0){__ms_toast('Cart is empty');return}
    var n=__ms_cart.reduce(function(s,i){return s+i.qty},0);
    var t=__ms_money(__ms_total());
    back.querySelector('.__ms-cart-panel').innerHTML='<div class="__ms-ok"><div class="__ms-tick">✓</div><h3>Order placed!</h3><p>'+n+' item'+(n===1?'':'s')+' · '+t+' — this is a demo confirmation.</p></div>';
    __ms_cart=[];__ms_updateBadge();
    setTimeout(__ms_closeCart,2200);
  });
  back.addEventListener('click',function(e){
    var t=e.target;
    var minus=t.getAttribute&&t.getAttribute('data-qty-minus');
    var plus=t.getAttribute&&t.getAttribute('data-qty-plus');
    if(minus){__ms_changeQty(minus,-1)}else if(plus){__ms_changeQty(plus,1)}
  });
  __ms_renderCart();
}

function __ms_closeCart(){var b=document.querySelector('.__ms-cart-back');if(b)b.remove()}

// Cart icon clicks
document.addEventListener('click',function(e){
  var icon=e.target.closest&&e.target.closest('.cart-icon,.cart-btn,.cart-button,.cart-toggle,.cart-link,[data-cart-icon],[data-cart-toggle],a[href="#cart"],[aria-label*="cart" i]');
  if(icon&&(icon.classList.contains('add-to-cart')||(icon.closest&&icon.closest('.add-to-cart,[data-add-to-cart]'))))icon=null;
  if(icon&&icon.closest&&icon.closest('.__ms-cart-back'))icon=null;
  if(icon){e.preventDefault();e.stopImmediatePropagation();__ms_openCart()}
},true);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',__ms_updateBadge);else __ms_updateBadge();
`;
}

// Returns true if the click was a cart action. Spliced into the main click handler.
export const ADD_TO_CART_HANDLER = String.raw`
var atc=e.target.closest&&e.target.closest('.add-to-cart,[data-add-to-cart]');
if(atc){e.preventDefault();e.stopPropagation();__ms_addToCart(atc);return}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Multi-page router (dormant unless there are 2+ [data-page] blocks)
// ─────────────────────────────────────────────────────────────────────────────
export function buildRouterScript() {
  return String.raw`
var __ms_routerActive=false;
var __ms_pages=[];
var __ms_currentPage='home';

// Only real page containers count — NOT nav links / buttons / logo that merely carry data-page.
function __ms_pageNodes(){
  var all=document.querySelectorAll('[data-page]'),out=[];
  for(var i=0;i<all.length;i++){
    var n=all[i],tg=n.tagName;
    if(tg==='A'||tg==='BUTTON'||tg==='LI'||tg==='SPAN'||tg==='INPUT'||tg==='IMG')continue;
    if(n.closest&&n.closest('header,nav'))continue;
    out.push(n);
  }
  return out;
}

function __ms_initRouter(){
  var nodes=__ms_pageNodes();
  if(nodes.length<2){__ms_routerActive=false;return false}
  __ms_routerActive=true;
  __ms_pages=[];
  for(var i=0;i<nodes.length;i++){
    var name=(nodes[i].getAttribute('data-page')||'').toLowerCase().trim();
    if(!name)continue;
    __ms_pages.push(name);
    nodes[i].setAttribute('data-page',name);
  }
  var initial=location.hash.replace('#','').toLowerCase();
  if(__ms_pages.indexOf(initial)===-1)initial=__ms_pages.indexOf('home')!==-1?'home':__ms_pages[0];
  __ms_showPage(initial,true);
  return true;
}

function __ms_resolvePage(target){
  if(!target)return null;
  target=String(target).toLowerCase()
    .replace(/^#/,'')
    .replace(/^https?:\/\/[^\/]+/,'')
    .replace(/[?#].*$/,'')
    .replace(/^\/+|\/+$/g,'')
    .replace(/\.[a-z]+$/,'');
  if(__ms_pages.indexOf(target)!==-1)return target;
  var aliases={products:['shop','catalog','store'],shop:['products','catalog','store'],menu:['shop','products'],work:['portfolio','projects','case-studies'],portfolio:['work','projects'],services:['features','offerings'],features:['services','offerings'],plans:['pricing','membership'],pricing:['plans','membership'],membership:['pricing','plans'],reach:['contact'],getintouch:['contact'],reservations:['reservation','book','booking'],reservation:['reservations','book','booking']};
  var alts=aliases[target]||[];
  for(var i=0;i<alts.length;i++)if(__ms_pages.indexOf(alts[i])!==-1)return alts[i];
  for(var j=0;j<__ms_pages.length;j++){if(__ms_pages[j].indexOf(target)!==-1||target.indexOf(__ms_pages[j])!==-1)return __ms_pages[j]}
  return null;
}

function __ms_showPage(name,silent){
  var nodes=__ms_pageNodes();
  var found=false;
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].getAttribute('data-page')===name){
      nodes[i].hidden=false;
      nodes[i].style.display='';
      found=true;
    }else{
      nodes[i].hidden=true;
      nodes[i].style.display='none';
    }
  }
  if(!found)return false;
  __ms_currentPage=name;
  var links=document.querySelectorAll('nav a');
  for(var j=0;j<links.length;j++){
    var h=(links[j].getAttribute('data-page')||links[j].getAttribute('href')||'').replace(/^#/,'').toLowerCase();
    if(!h)continue;
    var resolved=__ms_resolvePage(h);
    if(resolved===null)continue;
    if(resolved===name){links[j].setAttribute('aria-current','page');links[j].classList.add('__ms-active-nav');links[j].classList.add('active')}
    else{links[j].removeAttribute('aria-current');links[j].classList.remove('__ms-active-nav');links[j].classList.remove('active')}
  }
  if(!silent){
    try{history.replaceState(null,'','#'+name)}catch(_){}
    window.scrollTo({top:0,behavior:'smooth'});
  }
  return true;
}

function __ms_routerHandleLink(href){
  if(!__ms_routerActive)return false;
  var resolved=__ms_resolvePage(href);
  if(!resolved)return false;
  __ms_showPage(resolved,false);
  return true;
}

(function(){
  var s=document.createElement('style');
  s.textContent='.__ms-active-nav{font-weight:700;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:5px;text-decoration-color:var(--primary,#ff5c5c)}main[data-page],section[data-page],div[data-page],article[data-page]{animation:__ms_pageIn .3s ease}@keyframes __ms_pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}';
  document.head.appendChild(s);
})();

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',__ms_initRouter);else __ms_initRouter();
`;
}

// Spliced into the main click handler (uses `found` and `el`).
export const ROUTER_LINK_HANDLER = String.raw`
if(__ms_routerActive&&(found.kind==='a'||found.kind==='button')){
  var __dp=(el.getAttribute('data-page')||'').trim();
  var __h=(el.getAttribute('href')||'').trim();
  if(__dp&&__ms_routerHandleLink(__dp)){e.preventDefault();return}
  if(found.kind==='a'&&__h&&__h!=='#'&&__h.indexOf('javascript:')!==0){
    if(__ms_routerHandleLink(__h)){e.preventDefault();return}
  }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Hamburger + "does the nav fit?" logic
// ─────────────────────────────────────────────────────────────────────────────
export function buildHamburgerScript() {
  return String.raw`
var __ms_hb={header:null,nav:null,anchor:null,btn:null};

// A sticky header with NO background of its own would let content scroll underneath it.
// Give it one — dark if its links are light-coloured, light otherwise. Never override a real background.
function __ms_headerBg(){
  var hs=document.querySelectorAll('header:not(article header):not(section header):not(main header),.navbar,.site-header,body>nav,body>.nav');
  for(var i=0;i<hs.length;i++){
    var h=hs[i],cs=window.getComputedStyle(h);
    // Only touch headers in normal flow. fixed/absolute (headers AND off-canvas drawers) are left alone.
    if(cs.position!=='static'&&cs.position!=='relative'&&cs.position!=='sticky')continue;
    if(h.tagName==='NAV'&&!(h.parentNode===document.body&&h.querySelectorAll('a').length>1&&h.getBoundingClientRect().height<200))continue;
    h.style.setProperty('position','sticky','important');
    h.style.setProperty('top','0','important');
    h.style.setProperty('z-index','50','important');
    if(cs.backgroundImage&&cs.backgroundImage!=='none')continue;
    var bg=cs.backgroundColor,a=1,m=bg.match(/rgba?\(([^)]+)\)/);
    if(m){var p=m[1].split(',');a=p.length>3?parseFloat(p[3]):1}else if(bg==='transparent'){a=0}
    if(a>0.05)continue;
    var link=h.querySelector('a'),col=link?window.getComputedStyle(link).color:'rgb(0,0,0)';
    var c=col.match(/[\d.]+/g)||[0,0,0];
    var lum=0.299*c[0]+0.587*c[1]+0.114*c[2];
    h.style.setProperty('background',lum>150?'rgba(15,23,42,.94)':'rgba(255,255,255,.94)','important');
  }
}
(function(){
  function run(){try{__ms_headerBg()}catch(_){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  window.addEventListener('load',run);
  setTimeout(run,400);
})();

function __ms_findFlexParent(el,fallback){
  var n=el&&el.parentNode;
  while(n&&n!==document.body){
    var d=window.getComputedStyle(n).display;
    if(d==='flex'||d==='inline-flex')return n;
    if(n===fallback)return fallback;
    n=n.parentNode;
  }
  return fallback;
}

function __ms_hb_close(){
  var s=__ms_hb;
  if(!s.nav)return;
  s.nav.classList.remove('__ms-nav-open');
  if(s.btn){s.btn.classList.remove('__ms-hb-active');s.btn.setAttribute('aria-expanded','false')}
}

// Is this header control actually visible (not display:none, not in a hidden/mobile drawer)?
function __ms_hb_visible(el,header){
  var cs=window.getComputedStyle(el);
  if(cs.display==='none'||cs.visibility==='hidden'||cs.opacity==='0')return false;
  var n=el;
  while(n&&n!==header&&n!==document.body){
    if(n.getAttribute&&n.getAttribute('aria-hidden')==='true')return false;
    var c=(typeof n.className==='string')?n.className:'';
    if(/mobile|drawer|offcanvas|off-canvas|sidebar/i.test(c))return false;
    n=n.parentNode;
  }
  var r=el.getBoundingClientRect();
  if(r.width===0&&r.height===0)return false;
  return true;
}

// Does the header content overflow, wrap, or collide at the current layout?
function __ms_hb_overflows(){
  var s=__ms_hb,root=document.documentElement,vw=root.clientWidth;
  var hr=s.header.getBoundingClientRect(),hcs=window.getComputedStyle(s.header);
  var hLeft=hr.left+(parseFloat(hcs.paddingLeft)||0)-1,hRight=hr.right-(parseFloat(hcs.paddingRight)||0)+1;
  var els=s.header.querySelectorAll('a,button');
  for(var i=0;i<els.length;i++){
    var el=els[i];
    if(el.classList.contains('__ms-hamburger'))continue;
    if(!__ms_hb_visible(el,s.header))continue;
    var r=el.getBoundingClientRect();
    if(r.left>=vw||r.right<=0)continue;              // parked off-screen drawer, ignore
    if(r.right>Math.min(hRight,vw)+1||r.left<hLeft-1)return true;
  }
  // direct children of the flex row (logo / nav / auth / cta) must stay inside it
  var ar=s.anchor.getBoundingClientRect(),acs=window.getComputedStyle(s.anchor);
  var aRight=ar.right-(parseFloat(acs.paddingRight)||0)+1;
  var kids=s.anchor.children;
  for(var j=0;j<kids.length;j++){
    var kid=kids[j];
    if(kid.classList.contains('__ms-hamburger'))continue;
    var kcs=window.getComputedStyle(kid);
    if(kcs.display==='none'||kcs.position==='absolute'||kcs.position==='fixed')continue;
    var kr=kid.getBoundingClientRect();
    if(kr.width===0)continue;
    if(kr.right>aRight+1)return true;
  }
  // nav links wrapped onto a second row?
  var ls=s.nav.querySelectorAll('a'),tmin=1e9,tmax=-1e9,hmax=0;
  for(var k=0;k<ls.length;k++){
    if(!__ms_hb_visible(ls[k],s.header))continue;
    var rr=ls[k].getBoundingClientRect();
    tmin=Math.min(tmin,rr.top);tmax=Math.max(tmax,rr.top);hmax=Math.max(hmax,rr.height);
  }
  if(hmax>0&&tmax-tmin>hmax*0.6)return true;
  return false;
}

// Three levels: 1) normal desktop  2) tight spacing  3) hamburger
function __ms_hb_fit(){
  var s=__ms_hb;
  if(!s.header)return;
  var root=document.documentElement;
  root.classList.remove('__ms-compact');
  root.classList.remove('__ms-tight');
  if(window.innerWidth<=768){root.classList.add('__ms-compact');return}
  if(!__ms_hb_overflows()){__ms_hb_close();return}
  root.classList.add('__ms-tight');
  if(!__ms_hb_overflows()){__ms_hb_close();return}
  root.classList.remove('__ms-tight');
  root.classList.add('__ms-compact');
}

function __ms_hb_init(){
  var header=document.querySelector('header,.nav,.navbar,[class*=site-header]');
  if(!header)return;
  if(header.querySelector('.__ms-hamburger'))return;
  var nav=header.querySelector('nav,.links,[class*=nav-links],[class*=menu-links]');
  if(!nav)return;
  var links=nav.querySelectorAll('a');
  if(links.length<2)return;

  // The site already ships its own hamburger / mobile menu → leave its nav alone.
  var OWN_TOGGLE='[class*="hamburger" i],[class*="burger" i],[class*="menu-toggle" i],[class*="nav-toggle" i],[class*="menu-btn" i],[class*="menu-button" i],[class*="toggle-menu" i],[class*="mobile-toggle" i],[id*="hamburger" i],[id*="menu-toggle" i],[id*="menu-btn" i],button[aria-label*="menu" i],button[aria-expanded]';
  var own=header.querySelector(OWN_TOGGLE)||document.querySelector(OWN_TOGGLE);
  if(own&&!own.classList.contains('__ms-hamburger'))return;
  // A horizontally scrollable category strip is meant to scroll, not collapse.
  var ovn=window.getComputedStyle(nav).overflowX,ovp=window.getComputedStyle(nav.parentNode).overflowX;
  if(ovn==='auto'||ovn==='scroll'||ovp==='auto'||ovp==='scroll')return;

  document.documentElement.classList.add('__ms-guard');
  nav.classList.add('__ms-nav-collapsible');
  var hcs=window.getComputedStyle(header);
  if(hcs.position==='static')header.style.position='relative';

  // Find auth buttons by visible text (AI markup varies).
  var AUTH_RE=/^\s*(sign[\s-]*in|sign[\s-]*up|log[\s-]*in|log[\s-]*out|register|create\s+account|get\s+started\s+free|join\s+now|account)\s*$/i;
  var SIGNUP_RE=/sign[\s-]*up|register|create\s+account|join\s+now/i;
  var authNodes=[];
  var candidates=header.querySelectorAll('a,button');
  for(var ci=0;ci<candidates.length;ci++){
    var c=candidates[ci];
    if(c.classList.contains('__ms-hamburger'))continue;
    if(c.closest&&c.closest('.__ms-auth-mobile'))continue;
    var txt=(c.textContent||'').trim();
    if(AUTH_RE.test(txt))authNodes.push(c);
  }
  authNodes.forEach(function(n){
    n.classList.add('__ms-auth-original');
    if(n.parentNode&&n.parentNode!==header&&n.parentNode!==nav)n.parentNode.classList.add('__ms-auth-original-wrap');
  });
  if(authNodes.length>0){
    var section=document.createElement('div');
    section.className='__ms-auth-mobile';
    authNodes.forEach(function(n){
      var clone=n.cloneNode(true);
      clone.classList.remove('__ms-auth-original');
      clone.classList.add('__ms-auth-clone');
      var t=(n.textContent||'');
      if(n.classList.contains('primary')||SIGNUP_RE.test(t))clone.classList.add('__ms-auth-primary');
      section.appendChild(clone);
    });
    nav.appendChild(section);
  }

  var btn=document.createElement('button');
  btn.type='button';
  btn.className='__ms-hamburger';
  btn.setAttribute('aria-label','Toggle menu');
  btn.setAttribute('aria-expanded','false');
  btn.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18"></path><path d="M3 12h18"></path><path d="M3 18h18"></path></svg>';

  var anchor=__ms_findFlexParent(nav,header);
  anchor.appendChild(btn);

  __ms_hb.header=header;__ms_hb.nav=nav;__ms_hb.anchor=anchor;__ms_hb.btn=btn;

  btn.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    var open=nav.classList.toggle('__ms-nav-open');
    btn.classList.toggle('__ms-hb-active',open);
    btn.setAttribute('aria-expanded',String(open));
  });
  nav.addEventListener('click',function(e){
    if(e.target.closest('a,button'))requestAnimationFrame(__ms_hb_close);
  });
  document.addEventListener('click',function(e){if(!header.contains(e.target))__ms_hb_close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')__ms_hb_close()});

  // Re-check the fit whenever layout can change.
  var raf=0;
  function sched(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){raf=0;__ms_hb_fit()})}
  window.addEventListener('resize',sched);
  window.addEventListener('load',sched);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sched);
  setTimeout(sched,300);
  setTimeout(sched,1200);
  sched();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',__ms_hb_init);else __ms_hb_init();
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the injected <style>+<script> string for the preview iframe.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Off-canvas guard: a closed mobile-menu drawer that is parked mostly off the left edge
// but still pokes a few pixels into view (box sizing / padding / width differences inside the
// preview iframe) is hidden until the site itself opens it (class / style / aria change).
// ─────────────────────────────────────────────────────────────────────────────
export const OFF_CANVAS_GUARD = String.raw`
(function(){
  var NAME_RE=/menu|drawer|sidebar|side-nav|sidenav|offcanvas|off-canvas|mobile|nav/i;
  function mostlyOffLeft(r){return r.left<-8&&r.right>0&&r.right<=260}
  function hide(el){
    el.__msOc=true;
    var mo=new MutationObserver(function(){
      mo.takeRecords();
      el.style.removeProperty('visibility');          // the site changed it (probably opening) → let it show
      mo.takeRecords();
      setTimeout(function(){                         // after the transition, hide again if it is closed
        var r=el.getBoundingClientRect();
        if(mostlyOffLeft(r)){el.style.setProperty('visibility','hidden','important');mo.takeRecords()}
      },600);
    });
    mo.observe(el,{attributes:true,attributeFilter:['class','style','aria-hidden','hidden']});
    el.style.setProperty('visibility','hidden','important');
    mo.takeRecords();
  }
  function inScroller(el){
    var n=el.parentNode;
    while(n&&n!==document.body&&n.nodeType===1){
      var o=window.getComputedStyle(n).overflowX;
      if(o==='auto'||o==='scroll')return true;
      n=n.parentNode;
    }
    return false;
  }
  // Geometry only (no position/class assumptions): a narrow block with 3+ links/buttons whose left
  // part is off-screen but whose right edge still pokes into the viewport.
  function scan(){
    if(!document.body)return;
    var all=document.body.querySelectorAll('nav,aside,div,ul,section,ol');
    var n=Math.min(all.length,4000);
    for(var i=0;i<n;i++){
      var el=all[i];
      if(el.__msOc||(el.closest&&el.closest('[data-ms-oc]')))continue;
      var r=el.getBoundingClientRect();
      if(r.height<120||r.width<60||r.width>460||!mostlyOffLeft(r))continue;
      if(el.querySelectorAll('a,button').length<3)continue;
      if(inScroller(el))continue;
      el.setAttribute('data-ms-oc','1');
      hide(el);
    }
  }
  function run(){try{scan()}catch(_){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  window.addEventListener('load',run);
  window.addEventListener('resize',run);
  setTimeout(run,400);setTimeout(run,1500);setTimeout(run,3500);
})();
`;

// ── DEBUG SWITCHES ──────────────────────────────────────────────────────────
// If a generated site renders wrong, flip these one at a time (set to false)
// and reload the preview. Whichever flag fixes it is the layer to blame.
export const PREVIEW_FLAGS = {
  fixCss: true,         // FIX_CSS (sticky header, grids, forms, nav nowrap...)
  responsiveCss: true,  // RESPONSIVE_PREVIEW_CSS
  router: true,         // multi-page [data-page] router
  hamburger: true,      // nav fit check + hamburger + header background
  stripScripts: true,   // removal of small AI router-only scripts
  offCanvas: true,      // hides closed off-canvas mobile drawers that poke into view
};

export function buildPreviewScript(marker, flags = PREVIEW_FLAGS) {
  const helpers = String.raw`
function findClickable(t){
  while(t&&t!==document&&t!==document.body){
    var tag=t.tagName;
    if(tag==="A")return{kind:"a",el:t};
    if(tag==="BUTTON")return{kind:"button",el:t};
    if(t.getAttribute&&t.getAttribute("role")==="button")return{kind:"button",el:t};
    t=t.parentNode;
  }
  return null;
}

function pathToAnchor(href){
  var clean=href.replace(/^https?:\/\/[^\/]+/,"").replace(/[?#].*$/,"").replace(/^\/+|\/+$/g,"").replace(/\.[a-z]+$/i,"");
  if(!clean)return"";
  if(clean.indexOf("/")!==-1)clean=clean.split("/").pop();
  return clean.toLowerCase().replace(/[^a-z0-9\-_]/g,"-");
}

// exact id → substring → alias → heading text
function scrollToId(id){
  if(!id){window.scrollTo({top:0,behavior:"smooth"});return true}
  id=String(id).toLowerCase();
  var el=document.getElementById(id);
  if(el){el.scrollIntoView({behavior:"smooth",block:"start"});return true}
  var all=document.querySelectorAll("[id]");
  for(var i=0;i<all.length;i++){
    var aid=all[i].id.toLowerCase();
    if(aid===id||aid.indexOf(id)!==-1||id.indexOf(aid)!==-1){all[i].scrollIntoView({behavior:"smooth",block:"start"});return true}
  }
  var aliases={shop:["products","menu","store","catalog"],products:["shop","menu","store"],menu:["products","shop"],services:["features","what-we-do"],features:["services","benefits"],plans:["pricing","membership"],pricing:["plans","membership"],work:["projects","portfolio","case-studies"],projects:["work","portfolio"],team:["about","people"],story:["about"],reviews:["testimonials"],testimonials:["reviews"],questions:["faq"],faq:["questions"],reach:["contact"]};
  var alts=aliases[id]||[];
  for(var j=0;j<alts.length;j++){var hit=document.getElementById(alts[j]);if(hit){hit.scrollIntoView({behavior:"smooth",block:"start"});return true}}
  var heads=document.querySelectorAll("h1,h2,h3,section,nav");
  for(var k=0;k<heads.length;k++){
    var txt=(heads[k].innerText||"").toLowerCase();
    if(txt&&txt.indexOf(id.replace(/-/g," "))!==-1){heads[k].scrollIntoView({behavior:"smooth",block:"start"});return true}
  }
  return false;
}

function nextSection(fromEl){
  var sections=document.querySelectorAll("section");
  var from=fromEl.getBoundingClientRect().top+window.scrollY;
  var best=null,bestD=Infinity;
  for(var i=0;i<sections.length;i++){
    var d=sections[i].getBoundingClientRect().top+window.scrollY-from;
    if(d>50&&d<bestD){bestD=d;best=sections[i]}
  }
  return best;
}

// button text → action
function categorize(text){
  var t=(text||"").toLowerCase().trim();
  if(!t)return null;
  if(/order|checkout|buy\s*now/.test(t))return"order";
  if(/book|reserve|appointment|schedule|reservation/.test(t))return"book";
  if(/sign\s*in|log\s*in|login/.test(t))return"signin";
  if(/sign\s*up|register|join|create\s*account|get\s*started|try\s*free|start\s*free|start\s*your|begin|journey/.test(t))return"signup";
  if(/contact|email\s*us|talk|message\s*us|get\s*in\s*touch|reach\s*us/.test(t))return"contact";
  if(/subscribe|newsletter|notify|updates/.test(t))return"subscribe";
  if(/donate|give|support\s*us/.test(t))return"signup";
  if(/home|top/.test(t))return"scroll-top";
  if(/about|learn|more|how|explore|story|mission/.test(t))return"scroll-about";
  if(/feature|service|why\s*us|benefit/.test(t))return"scroll-features";
  if(/price|plan|premium|upgrade|membership|ticket/.test(t))return"scroll-pricing";
  if(/product|shop|menu|catalog|browse/.test(t))return"scroll-products";
  if(/portfolio|work|project|case|gallery/.test(t))return"scroll-portfolio";
  if(/team|people|staff/.test(t))return"scroll-team";
  if(/testimonial|review/.test(t))return"scroll-testimonials";
  if(/faq|question/.test(t))return"scroll-faq";
  return null;
}

function scrollByHint(hint,el){
  var ids={
    "scroll-top":[""],
    "scroll-about":["about","story","mission","how","how-it-works"],
    "scroll-features":["features","services","benefits","why","why-us"],
    "scroll-pricing":["pricing","plans","membership","price","tickets"],
    "scroll-products":["products","shop","menu","catalog","featured-products"],
    "scroll-portfolio":["portfolio","work","projects","gallery","case-studies"],
    "scroll-team":["team","people","staff","speakers"],
    "scroll-testimonials":["testimonials","reviews","customers"],
    "scroll-faq":["faq","questions"]
  }[hint]||[];
  // Router-aware: in multi-page mode prefer page-swap over scroll
  if(__ms_routerActive){for(var p=0;p<ids.length;p++){if(__ms_routerHandleLink(ids[p]))return true}}
  for(var i=0;i<ids.length;i++)if(scrollToId(ids[i]))return true;
  var sec=nextSection(el);
  if(sec){sec.scrollIntoView({behavior:"smooth",block:"start"});return true}
  return false;
}

var MODALS={
  order:{t:"Place your order",s:"Tell us what you need — we'll handle the rest.",f:[{l:"Full name",n:"name",t:"text",r:true},{l:"Phone",n:"phone",t:"tel",r:true},{l:"Delivery address",n:"address",t:"text",r:true},{l:"Notes (optional)",n:"notes",t:"textarea"}],g:"Place order",ok:"Order placed!",okm:"We'll send confirmation to your phone shortly."},
  book:{t:"Book a slot",s:"Pick a time and we'll confirm by email.",f:[{l:"Full name",n:"name",t:"text",r:true},{l:"Email",n:"email",t:"email",r:true},{l:"Preferred date",n:"date",t:"date",r:true},{l:"Notes (optional)",n:"notes",t:"textarea"}],g:"Request booking",ok:"Booking requested!",okm:"We'll confirm your slot within an hour."},
  signin:{t:"Sign in",s:"Welcome back.",f:[{l:"Email",n:"email",t:"email",r:true},{l:"Password",n:"password",t:"password",r:true}],g:"Sign in",ok:"Signed in!",okm:"Welcome back — this is a demo confirmation."},
  signup:{t:"Create your account",s:"It takes less than a minute.",f:[{l:"Full name",n:"name",t:"text",r:true},{l:"Email",n:"email",t:"email",r:true},{l:"Password",n:"password",t:"password",r:true}],g:"Create account",ok:"Account created!",okm:"Welcome aboard — this is a demo confirmation."},
  contact:{t:"Contact us",s:"We typically reply within a few hours.",f:[{l:"Your name",n:"name",t:"text",r:true},{l:"Email",n:"email",t:"email",r:true},{l:"Message",n:"message",t:"textarea",r:true}],g:"Send message",ok:"Message sent!",okm:"Thanks — we'll be in touch soon."},
  subscribe:{t:"Get updates",s:"No spam. Unsubscribe anytime.",f:[{l:"Email",n:"email",t:"email",r:true}],g:"Subscribe",ok:"You're subscribed!",okm:"Thanks for joining the list."}
};

function openModal(kind){
  var m=MODALS[kind];
  if(!m)return;
  closeModal();
  var back=document.createElement("div");
  back.className="__ms-back";
  var fields=m.f.map(function(f){
    var input=f.t==="textarea"
      ? '<textarea name="'+f.n+'"'+(f.r?' required':'')+'></textarea>'
      : '<input name="'+f.n+'" type="'+f.t+'"'+(f.r?' required':'')+'>';
    return '<div class="__ms-fld"><label>'+f.l+'</label>'+input+'</div>';
  }).join("");
  back.innerHTML='<div class="__ms-card" role="dialog" aria-modal="true"><button class="__ms-x" aria-label="Close">&times;</button><h2 class="__ms-title">'+m.t+'</h2><p class="__ms-sub">'+m.s+'</p><form class="__ms-form">'+fields+'<button type="submit" class="__ms-go">'+m.g+'</button></form><p class="__ms-foot">Demo · No data is sent</p></div>';
  document.body.appendChild(back);
  back.addEventListener("click",function(e){if(e.target===back)closeModal()});
  back.querySelector(".__ms-x").addEventListener("click",closeModal);
  back.querySelector(".__ms-form").addEventListener("submit",function(e){
    e.preventDefault();
    back.querySelector(".__ms-card").innerHTML='<div class="__ms-ok"><div class="__ms-tick">✓</div><h3>'+m.ok+'</h3><p>'+m.okm+'</p></div>';
    setTimeout(closeModal,2000);
  });
}
function closeModal(){var b=document.querySelector(".__ms-back");if(b)b.remove()}
function __ms_toast(msg){
  var t=document.createElement("div");
  t.className="__ms-toast";
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(function(){t.remove()},2200);
}
window.__ms_toast=__ms_toast;
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){closeModal();var c=document.querySelector(".__ms-cart-back");if(c)c.remove()}
});
`;

  // Image fallback chain: loremflickr → picsum → neutral SVG placeholder (no text).
  const imageFallback = String.raw`
document.addEventListener("error",function(e){
  var t=e.target;
  if(!t||t.tagName!=="IMG")return;
  t.onerror=null;
  var step=parseInt(t.dataset.__msFallback||"0",10);
  var alt=t.alt||t.getAttribute("data-name")||"product";
  var kw=alt.toLowerCase().replace(/[^a-z0-9 ]/g," ").trim().split(/\s+/).slice(0,3).join(",")||"abstract";
  if(step===0){
    t.dataset.__msFallback="1";
    t.src="https://loremflickr.com/600/600/"+encodeURIComponent(kw)+"?lock="+Math.floor(Math.random()*100000);
  }else if(step===1){
    t.dataset.__msFallback="2";
    t.src="https://picsum.photos/seed/"+encodeURIComponent(kw)+"/600/600";
  }else if(step===2){
    t.dataset.__msFallback="3";
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23eef2f7"/><stop offset="1" stop-color="%23dde4ec"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g)"/><g fill="none" stroke="%23aab4c2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="158" y="115" width="84" height="70" rx="8"/><circle cx="182" cy="140" r="9"/><path d="M160 172l26-22 18 15 24-20 14 12"/></g></svg>';
    t.src='data:image/svg+xml;utf8,'+svg;
  }
},true);
`;

  // Main click handler. ADD_TO_CART_HANDLER and ROUTER_LINK_HANDLER are spliced in.
  const clickHandler =
    'document.addEventListener("click",function(e){\n' +
    ADD_TO_CART_HANDLER +
    String.raw`
var found=findClickable(e.target);
if(!found)return;
var el=found.el;
if(el.closest&&el.closest(".cart-icon,.cart-btn,.cart-button,.cart-toggle,.cart-link,[data-cart-icon],[data-cart-toggle]"))return;
// Never hijack our own UI (hamburger, modals, cart panel, floating cart).
if(el.closest&&el.closest(".__ms-hamburger,.__ms-back,.__ms-cart-back,.__ms-fab"))return;
var text=(el.innerText||el.textContent||"").trim();
` +
    ROUTER_LINK_HANDLER +
    String.raw`
if(found.kind==="a"){
  var href=(el.getAttribute("href")||"").trim();
  if(href.charAt(0)==="#"&&href.length>1){e.preventDefault();scrollToId(href.slice(1));return}
  if(href&&href!=="#"&&href.indexOf("javascript:")!==0){
    e.preventDefault();
    var guess=pathToAnchor(href);
    if(guess&&scrollToId(guess))return;
  }else{e.preventDefault()}
}else if(found.kind==="button"){
  if(el.type==="submit"&&el.closest&&el.closest("form"))return;
  e.preventDefault();
}
var cat=categorize(text);
if(cat&&MODALS[cat]){openModal(cat);return}
if(cat&&cat.indexOf("scroll-")===0){scrollByHint(cat,el);return}
var isCtaLike=el.classList&&(el.classList.contains("btn-primary")||el.classList.contains("cta")||(el.closest&&el.closest("[class*=cta]")));
if(isCtaLike){openModal("signup");return}
__ms_toast("Coming soon");
},true);
`;

  // Form submits never reload the iframe; show contextual demo feedback.
  const submitHandler = String.raw`
document.addEventListener("submit",function(e){
  var f=e.target;
  if(f.closest&&(f.closest(".__ms-back")||f.closest(".__ms-cart-back")))return;
  e.preventDefault();
  var btn=f.querySelector&&f.querySelector("button[type=submit],[type=submit],button");
  var t=((btn&&btn.textContent)||"").toLowerCase();
  var hasPw=f.querySelector&&f.querySelector("input[type=password]");
  var msg="✓ Thanks! — this is a demo";
  if(hasPw&&/sign\s*up|create|register|join/.test(t))msg="✓ Account created — this is a demo";
  else if(hasPw||/sign\s*in|log\s*in/.test(t))msg="✓ Signed in — this is a demo";
  else if(/subscribe|newsletter|notify/.test(t))msg="✓ Subscribed — this is a demo";
  else if(/book|reserv/.test(t))msg="✓ Reservation requested — this is a demo";
  else if(/send|message|contact/.test(t))msg="✓ Message sent — this is a demo";
  __ms_toast(msg);
},true);
`;

  return [
    "<style>" + MODAL_CSS + "</style>",
    '<script id="' + marker + '">',
    "(function(){if(window.__mintsiteSafePreview)return;window.__mintsiteSafePreview=true;",
    flags.router ? buildRouterScript() : "var __ms_routerActive=false;function __ms_routerHandleLink(){return false}",
    flags.hamburger ? buildHamburgerScript() : "",
    flags.offCanvas ? OFF_CANVAS_GUARD : "",
    helpers,
    buildCartScript(),
    imageFallback,
    clickHandler,
    submitHandler,
    "})();",
    "</" + "script>",
  ].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Responsive defaults for generated pages inside the preview iframe.
// NOTE: nav / links / buttons are intentionally NOT given min-width:0 or
// max-width:100% here — that was what made nav items shrink, wrap and overlap.
// ─────────────────────────────────────────────────────────────────────────────
export const RESPONSIVE_PREVIEW_CSS = `
<style id="__mintsite_responsive_preview">
  *, *::before, *::after { box-sizing: border-box !important; }

  html, body {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
    overflow-x: hidden !important;
  }

  body { position: relative; }

  img, video, iframe, svg, canvas { max-width: 100% !important; }

  table { max-width: 100%; }
  pre { max-width: 100%; overflow-x: auto; }

  /* Only block-level page regions may shrink inside flex/grid parents.
     Header / nav / links are deliberately excluded. */
  main, section, article, aside, footer { min-width: 0 !important; }

  @media (max-width: 768px) {
    html, body { width: 100% !important; min-width: 0 !important; }

    .container, [class*="container"] {
      width: 100% !important;
      max-width: 100% !important;
    }

    .hero, [class*="hero-grid"] { max-width: 100% !important; }
  }

  @media (max-width: 480px) {
    [class*="grid-2"], [class*="grid-3"], [class*="grid-4"],
    .grid-2, .grid-3, .grid-4 {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    .hero, [class*="hero-grid"] {
      grid-template-columns: minmax(0, 1fr) !important;
      flex-direction: column !important;
    }
  }
</style>`;

// Remove AI-written page-router scripts. The platform handles multi-page
// routing; the AI's own version can hide every page and leave the site blank.
function stripAiPageRouterScripts(html) {
  return html.replace(
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    (full, body) => {
      if (/__mintsite/.test(full)) return full;
      if (!(/(data-page|page-route)/.test(body) && /hidden/.test(body))) return full;
      // Keep real app scripts (they render content, toggle menus, fetch data...).
      // Only drop small, router-only snippets.
      if (body.length > 2500) return full;
      if (/innerHTML|insertAdjacentHTML|createElement|appendChild|fetch\(|localStorage|sessionStorage|XMLHttpRequest/.test(body)) return full;
      return "";
    },
  );
}

const MARKER = "__mintsite_safe_preview__";

// Returns safe, iframe-ready HTML with viewport metadata, defensive CSS,
// and the preview interaction script injected exactly once.
export function safePreviewHtml(html) {
  if (!html) return html;
  if (html.indexOf(MARKER) !== -1) return html;

  if (PREVIEW_FLAGS.stripScripts) html = stripAiPageRouterScripts(html);

  const hasViewport = /<meta\s+[^>]*name=["']viewport["']/i.test(html);
  const viewportTag = hasViewport
    ? ""
    : '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">';
  const injection =
    (PREVIEW_FLAGS.fixCss ? FIX_CSS : "") + "\n" +
    (PREVIEW_FLAGS.responsiveCss ? RESPONSIVE_PREVIEW_CSS : "") + "\n" +
    buildPreviewScript(MARKER, PREVIEW_FLAGS);

  if (/<head[\s>]/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, (match, attrs) => `<head${attrs}>${viewportTag}${injection}`);
  }

  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, (match, attrs) =>
      `<html${attrs}><head>${viewportTag}${injection}</head>`,
    );
  }

  return `<!DOCTYPE html><html><head>${viewportTag}${injection}</head><body>${html}</body></html>`;
}
