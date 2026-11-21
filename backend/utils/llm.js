// AI generation engine — builds the prompt, calls the LLM (Gemini/Groq),
// and cleans up the returned HTML.


// ══ PROMPTS ══


export const ENHANCE_SYSTEM = `Turn the user's website idea into a tight design brief.


LITERAL INTERPRETATION (NON-NEGOTIABLE)


The brand name must represent the user's exact idea, not an adjacent concept.


- "banking system website" means a real bank, not a card-management SaaS.
- "fruits website" means a fruit shop, not generic ecommerce.
- "doctor portfolio" means a doctor's practice, not healthtech SaaS.
- "wedding photography" means a photographer's studio, not a wedding planner.


If the prompt is vague, interpret it literally. Never pivot to an adjacent concept.


Classify into exactly one type: ecommerce | restaurant | portfolio | agency | saas | event | nonprofit | generic.


For banking, finance, and insurance, use saas only if the user explicitly says platform or dashboard. Otherwise use generic and make the brand a real bank/business.


Respect detailed prompts exactly: preserve requested pages, sections, features, colours, and copy.


Layout: single-page only if the user asks for a single page, one page, or landing page. Otherwise multi-page.


Choose a harmonious modern palette with a distinctive saturated accent. Use a rich primary colour, a vivid complementary accent, a soft off-white/light-tint background, and near-black ink. Avoid bland grey-only palettes and clashing colours. Match the industry mood.


Output exactly this format, with no extra text:


Type: <type>


Layout: <single-page or multi-page>


Brand: <short brand name>


Audience: <one sentence>


Tone: <3 adjectives>


Palette: primary #hex, accent #hex, bg #hex, ink #hex


Fonts: <heading Google font>, <body Google font>


Hero headline: <max 8 words, specific to the brand>


Hero subhead: <one brand-specific sentence>


Image keyword: <2-3 words>


Pages: <comma-separated list>


Products: <only for ecommerce/restaurant: 6 lines as Name | desc | keywords | price>


Unique touch: <one specific idea>


PAGE MATRIX (always include Sign Up at the end; Sign In optional):


ecommerce: Home, Shop, About, Contact, Sign Up


restaurant: Home, Menu, About, Reservations, Contact, Sign Up


portfolio: Home, Work, About, Contact, Sign Up


agency: Home, Services, Work, About, Contact, Sign Up


saas: Home, Features, Pricing, About, Contact, Sign Up


event: Home, Schedule, Speakers, Tickets, Contact, Sign Up


nonprofit: Home, Programs, Impact, Donate, Contact, Sign Up


generic: Home, Features, About, Contact, Sign Up


Use industry-specific vocabulary. Never use generic corporate phrases such as "empowering teams" or "transforming the industry". For clothes use silhouettes and fabrics; for food use menu and flavours; for technology use precise product language.`;


// Builds the system prompt that tells the LLM how to generate the website HTML.
export function buildGenerateSystem({ summaryOpen = '', summaryClose = '' } = {}) {

  return `You are SiteForge AI: a senior product designer, brand designer and frontend engineer.


Create a premium, customer-ready website from the supplied design brief. The result must feel purpose-built for this exact business, not like a repeated template.


SOURCE OF TRUTH


The user's brief and design brief are authoritative. Preserve the exact business, brand, audience, requested pages, features, content, colours and layout. Interpret the business literally; never turn a real-world business into an unrelated SaaS product. Do not invent facts, awards, customer names, testimonials, metrics, contact details, addresses, social profiles or integrations. When the brief does not provide business contact information, use a clearly labelled contact form without fabricated phone numbers, addresses or email addresses. Never add fake ratings, customer counts or performance claims.


DESIGN DIRECTION — PREMIUM, NOT GENERIC


Design differentiation is mandatory: do not reuse the same hero composition, card treatment, section order, or visual motif for every business. Select a visual direction from the actual industry and brief, then make the whole site feel like one coherent brand. A boutique cafe should feel editorial and atmospheric; a finance product should feel precise and trustworthy; a portfolio should foreground the creator's work; a fashion store should feel like a considered lookbook.
Design the site like a professional studio designed it for this exact brand. Do not default to a centred text-only hero. Choose a layout that suits the industry: editorial, cinematic, product-led, boutique, architectural, playful or minimal as appropriate. The first screen must have a clear visual composition: a balanced two-column hero with a strong relevant image/product mockup, or a deliberate full-bleed image composition. Never leave a huge empty gap between the header and hero. Keep the hero vertically balanced, with content and image aligned, a controlled max-width, and a clear CTA group. Use a coherent design system with CSS variables for primary, accent, background, surface, ink, muted text, borders, radius, shadows and spacing. Use one distinctive heading font and a highly readable body font; establish a clear type scale, consistent button styles, consistent card radii and a restrained shadow system. Carry the same visual identity across every page while varying section layouts to avoid repetition. Use a consistent spacing scale (8, 12, 16, 24, 32, 48, 64, 80px). Desktop section padding is generally 64-88px; mobile 40-56px. Keep 20-28px between cards, 24-32px between section headings and content, 20-28px card padding, and 12-16px between form controls. Use a centred 1120-1200px content container with consistent gutters. Avoid giant headings: desktop hero h1 should normally be clamp(2.5rem,5vw,4.5rem), line-height 1.02-1.12; mobile clamp(2rem,9vw,3rem). Body copy should be 16-20px with line-height 1.55-1.75 and max-width 60-68 characters. Do not make every section centred; vary composition while maintaining alignment. Use intentional whitespace, high-quality photography, considered crops, strong typography, subtle borders and restrained shadows. No cramped controls, touching bars, overlapping cards, awkward line breaks, or oversized blank regions.


COLOUR AND CONTRAST — CRITICAL


Set explicit foreground and background colours for every major region; never rely on inherited browser defaults. Header/navigation must have readable contrast: on a light header use dark ink links (#172033 or a suitable palette ink); on a dark header use white/light links. Never use white text on a white/light background or dark text on a dark background. Give nav links, logo, buttons, active states, muted text and footer their own explicit colours. Body text must remain comfortably readable. Maintain WCAG AA contrast where practical (4.5:1 normal text, 3:1 large text and UI boundaries). Buttons must have explicit text and background colours in every state, including hover and focus. Do not set opacity on entire navigation or text containers. Avoid pale grey text on white. The active navigation item needs a visible underline, pill or accent indicator that does not reduce text contrast.


VISUAL QUALITY


Use real, relevant imagery rather than empty gradients or decorative blobs. The hero must contain at least one large relevant image, editorial collage or realistic product UI mockup. Use 2-4 meaningful images on the home page where appropriate, plus product/service imagery on relevant pages. Use varied image aspect ratios intentionally (hero 4:3 or 5:4, cards 4:3 or 3:2). Add subtle image overlays only when text contrast requires them. Avoid repeated generic Unsplash-style imagery, unrelated photos, broken placeholders, emoji as the only visual design, and stock-photo overload. For software products, create a convincing interface preview with HTML/CSS instead of unrelated photography. For theatre, restaurants, fashion, travel, events and hospitality, use relevant atmospheric photography and specific visual details.


LAYOUT MODE


- SINGLE-PAGE only when the user explicitly asks for a single page, one-page site or landing page. Use visible sections with unique IDs and normal anchor links. Do not use hidden pages or data-page attributes.


- MULTI-PAGE by default. Create one <main data-page="slug" class="page-route"> for every requested page. Home is visible; every other page starts with the hidden attribute. Header and footer remain outside the page containers. Use lowercase hyphenated slugs.


NAVIGATION AND TABS MUST WORK


This is a critical requirement. Every navigation item must be a real anchor: <a href="#features">Features</a>. In multi-page mode, the hash must exactly match a data-page value (for example href="#features" matches data-page="features"). Do not use buttons or JavaScript-only fake navigation for page tabs. Every requested page must have a matching navigation destination and a real, non-empty page body. Sign In and Sign Up links must open their corresponding pages. Every footer navigation link must also resolve to a real page. Never use href="#", missing IDs, misspelled slugs, /path links or .html links. For in-page tabs/widgets, wrap each group in [data-tabs], use accessible buttons with role="tab", aria-controls and matching role="tabpanel" IDs, and use the shared scoped tab handler when available. Include aria-selected, keyboard support and visible active states. Do not let one tab group control another. For mobile navigation, use a button with data-menu-toggle and aria-controls pointing to a nav element with data-mobile-menu and hidden; the platform handler opens and closes it.


HEADER AND AUTHENTICATION UNIQUENESS — NON-NEGOTIABLE


Build exactly ONE site header and exactly ONE desktop navigation row. Never duplicate a navigation item or account action. In the header, render at most one Sign In link and at most one Sign Up link; do not render two Sign In buttons, repeated account buttons, or a second copy of the same CTA. If Sign Up is requested, show it once. If Sign In is included, show it once. Do not put account links in both the main navigation and a separate duplicate header action group.


Desktop behaviour (viewport wider than 1200px): show the logo, primary navigation links and any single account CTA in one clean horizontal row. Hide the hamburger/menu-toggle control completely. Do not show a hamburger icon beside a full desktop navigation. Keep the logo on one line using white-space:nowrap; do not allow the logo to wrap into stacked words. Use flex alignment, a consistent gap, min-width:0 on flexible children, and a single-row header. Do not use absolute positioning for ordinary nav items.


Tablet/mobile behaviour (viewport 1200px and narrower): show one hamburger control and hide the desktop navigation links until the menu is opened. The menu must open and close, have aria-expanded and aria-controls, and show each navigation/account link only once. The logo remains on one line where space permits; shrink its font slightly before allowing a wrap. The mobile menu must not create duplicate copies of account actions. Do not create both a generated hamburger and a second platform hamburger; use the provided data-menu-toggle control when available.


Use one semantic header, one nav element for primary navigation, and one account-action group. Do not add a second nav, duplicate login links, or decorative menu icons that are not functional. Before output, count the visible header links and verify that every label appears only once.

RESPONSIVE DESIGN AND BUILDER VIEWPORT QA — NON-NEGOTIABLE


Treat the rendered iframe width as the actual website viewport. Build fluid layouts that respond to that width; never assume the preview is always a full desktop screen. Use a fluid outer page width, a centred max-width content container, clamp() for responsive type and spacing, minmax(0, 1fr) for grid tracks, min-width:0 for flex/grid children, and width:100%/max-width:100% for media. Do not use fixed pixel widths for page sections, navigation rows, cards, hero columns or forms. Fixed dimensions are acceptable only for small controls and deliberate image aspect ratios.


At widths above 1200px, use the full desktop composition with a single horizontal header, balanced multi-column sections and readable content widths. At 1200px and below, reduce gutters and gaps, reflow crowded layouts, and use a compact header with one menu toggle; stack hero content and visual cleanly; make card grids one or two columns according to available width; stack footer columns; and keep buttons and form controls comfortably tappable. At 480px and below, use a single-column layout where needed, avoid side-by-side CTAs that become cramped, preserve image aspect ratios, and keep at least 16px page gutters where space allows.


Never solve overflow by hiding the page's content or applying overflow:hidden to every section, grid, card or wrapper. Do not globally force all grids, all sections, all headings, all buttons, all navigation bars or all images into the same layout. Let the intended design reflow naturally. Avoid fixed heights on content sections, negative horizontal margins, absolute-positioned main content, viewport-width elements that include padding, and 100vw children inside padded containers. Use min-height only for deliberate visual sections. The document must scroll vertically normally.


INTERACTION QUALITY CHECKLIST


Every visible interactive element must have a clear, implemented behaviour: navigation changes page/section; mobile menu toggles and closes after selection; tabs switch only their own panels; accordions expand/collapse; carousels have previous/next controls and accessible labels; filters actually filter the displayed items; search returns matching items or a clear empty state; forms validate and show a truthful local success state without pretending to contact a server; modal dialogs open, close by close button/Escape/backdrop where appropriate, and trap focus only if implemented correctly. Buttons that cannot perform an action must be rendered as non-interactive text rather than fake buttons. Add hover, focus-visible, active, disabled and loading states where relevant. Respect prefers-reduced-motion. Use event listeners scoped to the widget and avoid global handlers that interfere with other widgets.


FINAL VISUAL QA AT THREE VIEWPORTS


Before returning the document, mentally inspect the layout at 1440px, 768px and 390px. Confirm: no horizontal page overflow; no overlapping or duplicated header items; no clipped logo or nav; no one-word-per-line text; no cards narrower than their readable content; no cropped CTA labels; no image distortion; no hidden content caused by fixed heights; and all visible controls have working interactions. If a three-column layout cannot fit, reduce the number of columns rather than shrinking cards until they break.


TECHNICAL OUTPUT


Return one complete, self-contained HTML document beginning with <!doctype html>. Include lang, charset, viewport, title and meta description. Put CSS in one <style> block in <head>. Use semantic HTML5, vanilla JavaScript only, no JSX and no unnecessary dependencies. Google Fonts via a stylesheet link are acceptable. Close all tags. Keep scripts small, scoped and defensive. Do not overwrite platform integration hooks, IDs, classes or data attributes supplied in the brief. Include responsive breakpoints around 1200px, 768px and 480px; reflow columns before they become cramped; keep at least 16px between adjacent mobile controls; prevent horizontal overflow and all element collisions; use touch targets of at least 44px, visible focus states and prefers-reduced-motion support.


FOOTER


Create a polished responsive footer with brand summary, useful page links, account links where relevant and social links only when real URLs are provided or requested. Do not invent social profiles.


FINAL CHECK BEFORE OUTPUT


Check every requested page exists; every navigation hash matches a page or section; every tab has a matching panel and working switching behaviour; buttons and links are not dead; forms have labels; images have alt text; no fake claims; mobile layout works; active navigation states are visible; and the HTML is complete. Fix errors before responding.


AFTER THE HTML — FRIENDLY SUMMARY


After </html>, include a short, friendly, non-technical summary describing the website and its useful features. Do not mention code, HTML, CSS, tags, classes or variables.


${summaryOpen}


<2 short friendly sentences about what you built, mentioning the brand and a useful detail>


**Try next:**


- <one useful suggestion>


- <one useful suggestion>


${summaryClose}


ITERATIVE EDITS


If previous HTML is supplied, preserve the brand, topic, layout mode, existing working integrations and unrelated pages. Return the full updated HTML. Change only what the user requested.


Return the complete HTML followed by the friendly summary. Nothing else.`;
}


// ══ LLM CALL (Gemini / Groq) ══


const PROVIDERS = {

  gemini: {

    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',

    keyEnv: 'GEMINI_API_KEY',

    models: [

      'gemini-3.6-flash',

      'gemini-3-flash-preview',

      'gemini-flash-latest',
            'gemini-3.5-flash-lite',

      'gemini-3.1-flash-lite',

      'gemini-flash-lite-latest',

    ],

    maxOutputTokens: 30000,

  },

  groq: {

    url: 'https://api.groq.com/openai/v1/chat/completions',

    keyEnv: 'GROQ_API_KEY',

    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],

    maxOutputTokens: 8000,

  },

};


const PRIORITY = ['gemini', 'groq'];


export function isLLMConfigured() {

  return PRIORITY.some((name) => Boolean(process.env[PROVIDERS[name].keyEnv]));

}


function buildAttempts() {

  const attempts = [];


  for (const provider of PRIORITY) {

    const cfg = PROVIDERS[provider];


    if (!process.env[cfg.keyEnv]) continue;


    for (const model of cfg.models) {

      attempts.push({ provider, model, cfg });

    }

  }


  return attempts;

}


export function isQuotaError(err) {

  return Boolean(err && err.quotaExhausted);

}


function sleep(ms) {

  return new Promise((resolve) => setTimeout(resolve, ms));

}


function parseRetryAfter(message) {

  if (!message) return null;


  const match =

    message.match(/(?:try again|retry) in ([\d.]+)\s*s/i) ||

    message.match(/retry-after[:\s]+([\d.]+)/i);


  if (!match) return null;


  return Math.min(5, Math.ceil(Number.parseFloat(match[1])) + 1);

}


function isQuotaExhausted(err) {

  if (err.status !== 429) return false;


  const message = `${err.message || ''} ${err.code || ''}`;


  return /quota exceeded|resource_exhausted|exceeded your current quota|free_tier_requests|tokens per day|requests per day|per day/i.test(

    message

  );

}


function looksDead(err) {

  return (

    err.status === 404 ||

    err.code === 'model_decommissioned' ||

    err.code === 'model_not_found' ||

    /decommissioned|does not exist|not found|not available|invalid_model/i.test(

      err.message || ''

    )

  );

}


async function callOnce(provider, model, cfg, messages, { temperature, maxTokens }) {

  const key = process.env[cfg.keyEnv];

  const effectiveMaxTokens = Math.min(maxTokens, cfg.maxOutputTokens);


  console.log(`[ai]   trying ${model}...`);

  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), 120000);


  let response;

  let responseText;


  try {

    response = await fetch(cfg.url, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        Authorization: `Bearer ${key}`,

      },

      body: JSON.stringify({

        model,

        messages,

        temperature,

        max_tokens: effectiveMaxTokens,

      }),

      signal: controller.signal,

    });


    responseText = await response.text();

  } finally {

    clearTimeout(timer);

  }


  if (!response.ok) {

    let parsed = null;


    try {

      parsed = JSON.parse(responseText);

    } catch {

      // Provider did not return JSON.

    }


    const providerMessage =

      parsed?.error?.message ||

      `${provider}/${model} returned ${response.status}`;


    const err = new Error(providerMessage);

    err.status = response.status;

    err.code = parsed?.error?.code;

    err.providerName = provider;


    throw err;

  }


  let data;


  try {

    data = JSON.parse(responseText);

  } catch {

    throw new Error(`${provider}/${model} returned invalid JSON`);

  }


  const content = data.choices?.[0]?.message?.content || '';


  if (content.trim().length < 20) {

    const err = new Error(`${provider}/${model} returned an empty response`);

    err.emptyResponse = true;

    throw err;

  }


  console.log(`[ai]   ${model} responded (${content.length} chars)`);

  return content;

}
export async function callLLM(messages, opts = {}) {

  const attempts = buildAttempts();


  if (!attempts.length) {

    throw new Error('No LLM provider configured');

  }


  const options = { temperature: 0.7, maxTokens: 6000, ...opts };

  const MAX_RETRIES = 2;

  const deadProviders = new Set();

  let lastError;


  for (const { provider, model, cfg } of attempts) {

    if (deadProviders.has(provider)) continue;


    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

      try {

        return await callOnce(provider, model, cfg, messages, options);

      } catch (err) {

        lastError = err;


        if (err.status === 401 || err.status === 403) {

          deadProviders.add(provider);

          console.log(

            `[ai]   ${provider}'s API key was rejected; trying the next provider...`

          );

          break;

        }


        if (looksDead(err) || isQuotaExhausted(err)) {

          if (isQuotaExhausted(err)) err.quotaExhausted = true;


          console.log(

            `[ai]   ${model} is unavailable or its limit is reached; trying the next model...`

          );

          break;

        }


        const transient =

          [429, 502, 503, 504].includes(err.status) ||

          err.name === 'AbortError';


        if (transient && attempt < MAX_RETRIES) {

          const wait = Math.min(5, parseRetryAfter(err.message) || attempt);


          console.log(

            `[ai]   ${model} is temporarily unavailable; retrying in ${wait}s (${attempt}/${MAX_RETRIES})...`

          );


          await sleep(wait * 1000);

          continue;

        }


        console.log(

          `[ai]   ${model} did not respond; trying the next model...`

        );

        break;

      }

    }

  }


  throw lastError || new Error('All configured LLM models failed');

}


// ══ POST-PROCESS ══


function sanitizeLinks(html) {

  if (!html) return html;


  return html.replace(

    /<a\b([^>]*?)href\s*=\s*(["'])([^"']*)\2([^>]*)>/gi,

    (match, before, quote, href, after) => {

      const target = (href || '').trim();


      if (

        target.startsWith('#') ||

        /^(?:javascript:|mailto:|tel:)/i.test(target) ||

        target === ''

      ) {

        return match;

      }


      if (/\btarget\s*=/i.test(before + after)) return match;


      return `<a${before}href=${quote}${target}${quote}${after} target="_blank" rel="noopener noreferrer">`;

    }

  );

}


function ensureSmoothScroll(html) {

  if (!html || /scroll-behavior\s*:/i.test(html)) return html;


  return html.replace(/<html\b([^>]*)>/i, (match, attrs) => {

    if (/\bstyle\s*=/i.test(attrs)) {

      return match.replace(

        /style\s*=\s*(["'])([^"']*)\1/i,

        (_m, quote, style) =>

          `style=${quote}${style};scroll-behavior:smooth${quote}`

      );

    }


    return `<html${attrs} style="scroll-behavior:smooth">`;

  });

}
const SCRIPT_CLOSE = '<' + '/script>';


const LINK_INTERCEPTOR =

  '<script id="__mintsite_link_interceptor__">' +

  '(function(){' +

  'if(window.__mintsiteLinkInterceptor)return;' +

  'window.__mintsiteLinkInterceptor=true;' +

  'function pages(){return Array.prototype.slice.call(document.querySelectorAll("main[data-page], [data-page].page-route"));}' +

  'function findPage(name){name=(name||"").replace(/^#/,"").toLowerCase();return pages().find(function(p){return (p.getAttribute("data-page")||"").toLowerCase()===name;});}' +

  'function setActiveLinks(name){document.querySelectorAll("a").forEach(function(a){var href=a.getAttribute("href")||"";if(href.charAt(0)!=="#")return;var active=href.slice(1).toLowerCase()===name;if(active){a.setAttribute("aria-current","page");a.classList.add("active");}else{a.removeAttribute("aria-current");a.classList.remove("active");}});}' +

  'function showPage(name,writeHistory){var list=pages();if(list.length<2)return false;var target=findPage(name);if(!target)return false;list.forEach(function(p){var active=p===target;p.hidden=!active;p.setAttribute("aria-hidden",active?"false":"true");});name=(target.getAttribute("data-page")||"").toLowerCase();setActiveLinks(name);if(writeHistory&&window.location.hash!=="#"+name){window.history.pushState({siteforgePage:name},"","#"+name);}window.scrollTo({top:0,behavior:"smooth"});closeMenu();return true;}' +

  'function closeMenu(){document.querySelectorAll("[data-mobile-menu]").forEach(function(menu){menu.hidden=true;});document.querySelectorAll("[data-menu-toggle][aria-expanded]").forEach(function(btn){btn.setAttribute("aria-expanded","false");});}' +

  'function routeFromLocation(){var name=(window.location.hash||"").slice(1);if(name&&showPage(name,false))return;}' +

  'function activateTab(tab){var controls=tab.getAttribute("aria-controls")||tab.getAttribute("data-tab-target");if(!controls)return false;var panel=document.getElementById(controls.replace(/^#/,""));if(!panel)return false;var list=tab.closest("[role=tablist]");var root=tab.closest("[data-tabs]")||(list&&list.parentElement)||tab.parentElement;var tabs=root?root.querySelectorAll("[role=tab][aria-controls], [role=tab][data-tab-target]"):[];tabs.forEach(function(item){var selected=item===tab;item.setAttribute("aria-selected",selected?"true":"false");item.setAttribute("tabindex",selected?"0":"-1");var id=item.getAttribute("aria-controls")||item.getAttribute("data-tab-target");var itemPanel=id&&document.getElementById(id.replace(/^#/,""));if(itemPanel){itemPanel.hidden=!selected;itemPanel.setAttribute("aria-hidden",selected?"false":"true");}});return true;}' +

  'document.addEventListener("click",function(e){var menuButton=e.target.closest&&e.target.closest("[data-menu-toggle]");if(menuButton){var id=menuButton.getAttribute("aria-controls");var menu=id&&document.getElementById(id);if(menu){var open=menu.hidden;menu.hidden=!open;menuButton.setAttribute("aria-expanded",open?"true":"false");}return;}' +

  'var tab=e.target.closest&&e.target.closest("[role=tab][aria-controls], [role=tab][data-tab-target]");if(tab&&activateTab(tab)){e.preventDefault();return;}' +

  'var routeControl=e.target.closest&&e.target.closest("[data-page-target], [data-route]");if(routeControl){var route=routeControl.getAttribute("data-page-target")||routeControl.getAttribute("data-route");if(showPage(route,true)){e.preventDefault();return;}}' +

  'var a=e.target.closest&&e.target.closest("a");if(!a)return;var href=(a.getAttribute("href")||"").trim();if(href.charAt(0)!=="#"||href.length<2)return;var name=href.slice(1);if(showPage(name,true)){e.preventDefault();return;}' +

  '},true);' +

  'document.addEventListener("keydown",function(e){var tab=e.target.closest&&e.target.closest("[role=tab]");if(!tab)return;var list=tab.closest("[role=tablist]");if(!list)return;var items=Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));var i=items.indexOf(tab);var next=null;if(e.key==="ArrowRight"||e.key==="ArrowDown")next=items[(i+1)%items.length];if(e.key==="ArrowLeft"||e.key==="ArrowUp")next=items[(i-1+items.length)%items.length];if(e.key==="Home")next=items[0];if(e.key==="End")next=items[items.length-1];if(next){e.preventDefault();next.focus();activateTab(next);}});' +

  'window.addEventListener("popstate",routeFromLocation);window.addEventListener("hashchange",routeFromLocation);' +

  'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",routeFromLocation,{once:true});}else{routeFromLocation();}' +

  '})();' +

  SCRIPT_CLOSE;


function injectLinkInterceptor(html) {

  if (!html || /__mintsite_link_interceptor__/.test(html)) return html;


  let output = html;


  if (!/<\/html\s*>/i.test(output)) {

    if (!/<\/body\s*>/i.test(output)) output += '\n</body>';

    output += '\n</html>';

  }


  if (/<\/body\s*>/i.test(output)) {

    return output.replace(

      /<\/body\s*>/i,

      `${LINK_INTERCEPTOR}\n</body>`

    );

  }


  return output.replace(

    /<\/html\s*>/i,

    `${LINK_INTERCEPTOR}\n</html>`

  );

}
const OVERLAP_FIX_CSS = `

/* SiteForge safety layer: deliberately conservative; the generated design owns its look. */

*,*::before,*::after{box-sizing:border-box}

html{scroll-behavior:smooth;max-width:100%;overflow-x:hidden}

body{max-width:100%;margin:0;overflow-x:hidden;line-height:1.6}

[hidden]{display:none!important}

img,svg,video,iframe{max-width:100%}

img{height:auto;object-fit:cover}

button,input,select,textarea{font:inherit;max-width:100%}

button,a,[role=button]{touch-action:manipulation}

:focus-visible{outline:3px solid var(--accent,#6366f1);outline-offset:3px}

section{scroll-margin-top:6rem;min-width:0}

main,article,section,header,footer{min-width:0}

.container,.site-container,.section-inner{width:min(100% - 48px,1200px);margin-inline:auto}

nav{display:flex;align-items:center;gap:clamp(12px,1.8vw,24px)}

nav a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 10px;white-space:nowrap}

/* SiteForge header fix: keep the logo, navigation and account actions from colliding. */
header{width:100%;max-width:100%;min-width:0}
header>*{min-width:0}
header nav[data-mobile-menu]{min-width:0;flex:1 1 auto;align-items:center;justify-content:center;gap:clamp(4px,.7vw,12px)}
header nav[data-mobile-menu] a{flex:0 1 auto;min-width:0;white-space:nowrap;word-break:normal;overflow-wrap:normal;padding-inline:clamp(3px,.45vw,7px);font-size:clamp(.68rem,.82vw,.9rem)}
header [data-menu-toggle]{display:none;flex:0 0 44px;align-items:center;justify-content:center;min-width:44px;min-height:44px}
header a,header button{max-width:100%;flex-shrink:0}

@media(min-width:1201px){
  header nav[data-mobile-menu][hidden]{display:flex!important}
  header [data-menu-toggle]{display:none!important}
}

@media(max-width:1200px){
  header{gap:clamp(8px,2vw,16px)}
  header nav[data-mobile-menu]{display:none!important}
  header nav[data-mobile-menu]:not([hidden]){position:absolute;top:100%;left:0;right:0;z-index:9999;display:flex!important;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;padding:16px;background:var(--surface,#fff);color:var(--ink,#172033);box-shadow:0 12px 28px rgba(0,0,0,.14)}
  header nav[data-mobile-menu]:not([hidden]) a{display:flex;width:100%;min-height:44px;white-space:normal;overflow-wrap:anywhere;padding:10px 12px;font-size:1rem}
  header [data-menu-toggle]{display:inline-flex!important}
}

.grid,.cards,.features-grid,.services-grid,.product-grid{column-gap:clamp(16px,2vw,28px);row-gap:clamp(20px,2.5vw,32px)}

.card,.product-card,[class*=feature-card],[class*=service-card]{min-width:0;overflow-wrap:anywhere}

button{cursor:pointer}

form label{display:block;margin:12px 0 6px}

form input:not([type=checkbox]):not([type=radio]),form textarea,form select{width:100%;min-width:0;max-width:100%}

@media(max-width:1024px){.container,.site-container,.section-inner{width:min(100% - 40px,100%)}}

@media(max-width:768px){.container,.site-container,.section-inner{width:min(100% - 32px,100%)}.grid-2,.grid-3,.grid-4,.product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.hero,.hero-grid{gap:28px}}

@media(max-width:520px){.container,.site-container,.section-inner{width:calc(100% - 32px)}.grid-2,.grid-3,.grid-4,.product-grid{grid-template-columns:minmax(0,1fr);gap:16px}.ctas,.hero-actions{display:flex;flex-wrap:wrap;gap:12px}.ctas>* ,.hero-actions>*{max-width:100%;min-height:44px}nav{gap:6px;flex-wrap:wrap}nav a{padding:8px;white-space:normal}}

@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}

`;
function fixOverlappingCSS(html) {

  if (!html || /__mintsite_fix__/.test(html)) return html;


  const block = `<style id="__mintsite_fix__">${OVERLAP_FIX_CSS}</style>`;


  if (/<\/head\s*>/i.test(html)) {

    return html.replace(/<\/head\s*>/i, `${block}\n</head>`);

  }


  if (/<head\b[^>]*>/i.test(html)) {

    return html.replace(/<head\b([^>]*)>/i, `<head$1>${block}`);

  }


  return block + html;

}


function stripAiPageRouterScripts(html) {

  if (!html) return html;


  return html.replace(

    /<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi,

    (full, body) => {

      if (/__mintsite/.test(full)) return full;

      if (/(data-page|page-route)/i.test(body) && /hidden/i.test(body)) {

        return '';

      }

      return full;

    }

  );

}


export function postProcess(html) {

  return fixOverlappingCSS(

    injectLinkInterceptor(

      ensureSmoothScroll(sanitizeLinks(stripAiPageRouterScripts(html)))

    )

  );

}


// ══ IMAGE RESOLUTION (Unsplash) ══


const SEARCH_URL = 'https://api.unsplash.com/search/photos';

const cache = new Map();

let unsplashPausedUntil = 0;


export function isUnsplashConfigured() {

  return Boolean(process.env.UNSPLASH_ACCESS_KEY);

}


async function search(keyword) {

  if (cache.has(keyword)) return cache.get(keyword);

  if (Date.now() < unsplashPausedUntil) return [];


  const key = process.env.UNSPLASH_ACCESS_KEY;

  if (!key) return [];


  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), 8000);


  try {

    const url = `${SEARCH_URL}?query=${encodeURIComponent(keyword)}&per_page=10&content_filter=high&client_id=${encodeURIComponent(key)}`;


    const response = await fetch(url, { signal: controller.signal });


    if (!response.ok) {

      if (response.status === 403 || response.status === 429) {

        unsplashPausedUntil = Date.now() + 10 * 60 * 1000;


        console.warn(

          `[unsplash] rate-limited (HTTP ${response.status}); using original image URLs for 10 min`

        );

      } else {

        console.warn(

          `[unsplash] "${keyword}" returned HTTP ${response.status}`

        );

      }


      cache.set(keyword, []);

      return [];

    }


    const data = await response.json();


    const results = (data.results || [])

      .map((photo) => photo?.urls?.raw)

      .filter(Boolean);


    cache.set(keyword, results);

    return results;

  } catch (err) {

    console.warn(`[unsplash] "${keyword}" lookup failed:`, err.message);

    cache.set(keyword, []);

    return [];

  } finally {

    clearTimeout(timer);

  }

}


function toKeyword(pathPart) {

  try {

    return decodeURIComponent(pathPart).replace(/[,+_-]+/g, ' ').trim();

  } catch {

    return pathPart.replace(/[,+_-]+/g, ' ').trim();

  }

}


function sized(raw) {

  const separator = raw.includes('?') ? '&' : '?';

  return `${raw}${separator}w=800&h=600&fit=crop&q=80`;

}


export async function resolveImages(html) {

  if (!html || !isUnsplashConfigured()) return html;


  const urlRegex =

    /https?:\/\/loremflickr\.com\/\d+\/\d+\/([^"'\s?]+)(?:\?[^"'\s]*)?/gi;


  const uniqueUrls = [

    ...new Set([...html.matchAll(urlRegex)].map((match) => match[0])),

  ];


  if (!uniqueUrls.length) return html;


  // Group URLs by keyword so each Unsplash query runs once.

  // Run at most three distinct searches concurrently to reduce latency.

  const grouped = new Map();


  for (const oldUrl of uniqueUrls) {

    const match = oldUrl.match(

      /loremflickr\.com\/\d+\/\d+\/([^?]+)/i

    );


    if (!match) continue;


    const keyword = toKeyword(match[1]);


    if (!grouped.has(keyword)) grouped.set(keyword, []);


    grouped.get(keyword).push(oldUrl);

  }


  const entries = [...grouped.entries()];

  const replacements = [];


  for (let i = 0; i < entries.length; i += 3) {

    const batch = entries.slice(i, i + 3);


    const results = await Promise.all(

      batch.map(async ([keyword, urls]) => ({

        keyword,

        urls,

        photos: await search(keyword),

      }))

    );


    for (const { urls, photos } of results) {

      if (!photos.length) continue;


      urls.forEach((oldUrl, index) => {

        replacements.push([

          oldUrl,

          sized(photos[index % photos.length]),

        ]);

      });

    }

  }


  let output = html;


  for (const [oldUrl, newUrl] of replacements) {

    output = output.split(oldUrl).join(newUrl);

  }


  return output;

}