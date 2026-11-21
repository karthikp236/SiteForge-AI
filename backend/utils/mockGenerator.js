// Offline fallback website generator.
// Builds a styled website when the AI model is unavailable.

const PALETTES = [
  {
    name: "Indigo",
    primary: "#5145cd",
    accent: "#a855f7",
    bg: "#ffffff",
    bgSoft: "#f5f4ff",
    ink: "#17152e",
    muted: "#68677b",
  },
  {
    name: "Emerald",
    primary: "#087f5b",
    accent: "#22a884",
    bg: "#ffffff",
    bgSoft: "#effaf5",
    ink: "#102b23",
    muted: "#60756d",
  },
  {
    name: "Rose",
    primary: "#be365c",
    accent: "#e8799a",
    bg: "#ffffff",
    bgSoft: "#fff3f6",
    ink: "#391624",
    muted: "#80616c",
  },
  {
    name: "Amber",
    primary: "#a95718",
    accent: "#e59a35",
    bg: "#fffdf8",
    bgSoft: "#fff5e6",
    ink: "#382313",
    muted: "#806c58",
  },
  {
    name: "Sky",
    primary: "#126a9b",
    accent: "#38a5c9",
    bg: "#ffffff",
    bgSoft: "#eff8fc",
    ink: "#102b40",
    muted: "#617887",
  },
  {
    name: "Charcoal",
    primary: "#292929",
    accent: "#c49a5a",
    bg: "#ffffff",
    bgSoft: "#f7f5f1",
    ink: "#202020",
    muted: "#77716a",
  },
];

function pickPalette(prompt) {
  const s = (prompt || "").toLowerCase();

  if (/restaurant|food|spice|cafe|bakery|coffee|fruit/.test(s)) {
    return PALETTES[3];
  }

  if (/eco|green|nature|wellness|farm|organic|plant|vegan/.test(s)) {
    return PALETTES[1];
  }

  if (/jewel|beauty|fashion|wedding|cloth|apparel|boutique/.test(s)) {
    return PALETTES[2];
  }

  if (/tech|saas|app|software|ai|data|dashboard/.test(s)) {
    return PALETTES[4];
  }

  if (/interior|architecture|furniture|luxury|design studio/.test(s)) {
    return PALETTES[5];
  }

  return PALETTES[0];
}

function pickType(prompt) {
  const s = (prompt || "").toLowerCase();

  if (/restaurant|cafe|bakery|menu|dish|cuisine|coffee\s*shop|bistro/.test(s)) {
    return "restaurant";
  }

  if (
    /shop|store|ecommerce|e-?commerce|buy|cart|product|fruit|grocery|clothes|clothing|fashion|apparel|boutique|wear|outfit|shoe|jewel(ry|lery)|cosmetic|beauty product|skincare/.test(s)
  ) {
    return "ecommerce";
  }

  if (/portfolio|designer|photographer|developer|artist|illustrator|writer/.test(s)) {
    return "portfolio";
  }

  if (/agency|studio|consult/.test(s)) {
    return "agency";
  }

  if (/saas|software|app|tool|dashboard|platform/.test(s)) {
    return "saas";
  }

  if (/event|conference|wedding|workshop|festival/.test(s)) {
    return "event";
  }

  if (/ngo|charity|nonprofit|donate|foundation/.test(s)) {
    return "nonprofit";
  }

  return "generic";
}

function brandName(prompt) {
  const text = (prompt || "")
    .trim()
    .replace(/^(create|build|make|design|generate)\s+(a|an|the)\s+/i, "")
    .replace(/^(a|an|the)\s+/i, "")
    .split(/[.!?,\n]/)[0]
    .trim();

  if (!text) return "Studio";

  const cleaned = text
    .replace(/^(website|web site|site)\s+(for|about)\s+/i, "")
    .replace(/[^a-zA-Z0-9\s&'-]/g, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);

  return (words.slice(0, 3).join(" ") || "Studio").slice(0, 32);
}

function tagline(prompt) {
  const s = (prompt || "").toLowerCase();

  if (/fruit/.test(s)) return "Fresh picks for brighter days.";
  if (/coffee|cafe/.test(s)) return "A little ritual worth slowing down for.";
  if (/restaurant|food|bakery/.test(s)) return "Thoughtful food, memorable moments.";
  if (/cloth|fashion|apparel|boutique/.test(s)) return "Everyday pieces with a point of view.";
  if (/portfolio|designer|developer/.test(s)) return "Thoughtful work, made with intention.";
  if (/saas|software|app|tool/.test(s)) return "A clearer way to get work done.";
  if (/wellness|fitness|health/.test(s)) return "Small steps toward feeling your best.";
  if (/agency|studio/.test(s)) return "Ideas shaped into meaningful experiences.";
  if (/wedding|photography/.test(s)) return "Honest moments, beautifully remembered.";

  return "Made with care. Designed to matter.";
}

// Six sample products for fallback ecommerce and restaurant pages.
function productsFor(prompt) {
  const s = (prompt || "").toLowerCase();

  if (/fruit/.test(s)) {
    return [
      {
        name: "Fresh Red Apples",
        img: "fresh red apples fruit market",
        desc: "Crisp, naturally sweet and perfect for everyday snacking.",
        price: "5.99",
        unit: "/lb",
      },
      {
        name: "Ripe Bananas",
        img: "ripe yellow bananas fruit",
        desc: "Naturally creamy and ready for your morning routine.",
        price: "1.99",
        unit: "/lb",
      },
      {
        name: "Juicy Oranges",
        img: "fresh oranges citrus fruit",
        desc: "Bright citrus flavour with a refreshing finish.",
        price: "4.49",
        unit: "/bag",
      },
      {
        name: "Seasonal Berries",
        img: "fresh strawberries blueberries raspberries",
        desc: "A colourful mix for breakfast bowls and desserts.",
        price: "7.29",
        unit: "/pack",
      },
      {
        name: "Alphonso Mangoes",
        img: "ripe alphonso mangoes india",
        desc: "Rich, fragrant mangoes with a naturally smooth texture.",
        price: "12.99",
        unit: "/box",
      },
      {
        name: "Green Grapes",
        img: "fresh green seedless grapes",
        desc: "Light, juicy and easy to enjoy any time of day.",
        price: "3.49",
        unit: "/lb",
      },
    ];
  }

  if (/restaurant|cafe|bakery|menu|food/.test(s)) {
    return [
      {
        name: "House Special",
        img: "restaurant signature dish elegant food photography",
        desc: "A carefully prepared favourite from our kitchen.",
        price: "14.50",
        unit: "",
      },
      {
        name: "Fresh Pasta",
        img: "fresh handmade pasta restaurant",
        desc: "Made with seasonal ingredients and a rich sauce.",
        price: "18.00",
        unit: "",
      },
      {
        name: "Garden Salad",
        img: "fresh green garden salad restaurant",
        desc: "Crisp greens, bright flavours and a light dressing.",
        price: "11.00",
        unit: "",
      },
      {
        name: "Chef's Plate",
        img: "chef plated gourmet meal",
        desc: "A balanced plate prepared with care.",
        price: "22.00",
        unit: "",
      },
      {
        name: "Seasonal Bowl",
        img: "healthy seasonal vegetable bowl food",
        desc: "A fresh combination of textures and flavours.",
        price: "13.00",
        unit: "",
      },
      {
        name: "House Dessert",
        img: "chocolate dessert restaurant food photography",
        desc: "A sweet finish to your meal.",
        price: "9.50",
        unit: "",
      },
    ];
  }

  return [
    {
      name: "Signature Collection",
      img: "premium lifestyle product photography",
      desc: "A considered essential made for everyday use.",
      price: "29.00",
      unit: "",
    },
    {
      name: "Everyday Essential",
      img: "minimal everyday lifestyle product",
      desc: "Simple details, thoughtful design and lasting appeal.",
      price: "39.00",
      unit: "",
    },
    {
      name: "Limited Edition",
      img: "luxury limited edition product photography",
      desc: "A distinctive piece from our curated collection.",
      price: "59.00",
      unit: "",
    },
    {
      name: "Daily Favourite",
      img: "modern minimal product studio photography",
      desc: "Designed to fit naturally into your routine.",
      price: "19.00",
      unit: "",
    },
    {
      name: "Gift Set",
      img: "premium gift box elegant packaging",
      desc: "A thoughtful selection for someone special.",
      price: "79.00",
      unit: "",
    },
    {
      name: "New Arrival",
      img: "new arrival premium product photography",
      desc: "Discover something new in our latest collection.",
      price: "44.00",
      unit: "",
    },
  ];
}

// Builds an image URL from a descriptive keyword.
function imageUrl(description, seed) {
  const desc = encodeURIComponent(description);

  return `https://image.pollinations.ai/prompt/${desc}?width=600&height=600&nologo=true&seed=${seed}`;
}

function heroImageUrl(description, seed) {
  const desc = encodeURIComponent(description);

  return `https://image.pollinations.ai/prompt/${desc}?width=1200&height=900&nologo=true&seed=${seed}`;
}

const IMG_ONERROR =
  "this.onerror=null;this.src='https://loremflickr.com/600/600/'+encodeURIComponent(this.alt)";
  // ══ PAGE GENERATORS ══

function homePage({ brand, sub, type, imgKw }) {
  const heroImg = heroImageUrl(
    `${imgKw} premium website hero photography`,
    101
  );

  const ctas = {
    ecommerce: { text: "Explore collection", href: "#shop" },
    restaurant: { text: "Explore menu", href: "#menu" },
    portfolio: { text: "View selected work", href: "#shop" },
    agency: { text: "Start a project", href: "#contact" },
    saas: { text: "Get started", href: "#signup" },
    event: { text: "Get in touch", href: "#contact" },
    nonprofit: { text: "Learn about our work", href: "#about" },
    generic: { text: "Discover more", href: "#features" },
  };

  const cta = ctas[type] || ctas.generic;

  return `
  <main data-page="home" class="page-route">
    <section class="hero container">
      <div class="hero-copy">
        <span class="eyebrow">${brand}</span>
        <h1>${brand}<span class="hero-period">.</span></h1>
        <p class="hero-tagline">${sub}</p>
        <p class="lead">
          Discover a more thoughtful approach, with carefully considered
          details and an experience designed around you.
        </p>
        <div class="ctas">
          <a class="btn-primary" href="${cta.href}">${cta.text}</a>
          <a class="btn-ghost" href="#about">Our story</a>
        </div>
        <div class="hero-note">
          <span class="hero-note-line"></span>
          <span>Thoughtfully made, just for you</span>
        </div>
      </div>

      <div class="hero-image">
        <img
          src="${heroImg}"
          alt="${brand} featured visual"
          fetchpriority="high"
          onerror="${IMG_ONERROR}"
        >
        <div class="image-caption">
          <span>${brand}</span>
          <span>Discover the difference</span>
        </div>
      </div>
    </section>

    <section class="intro-section container">
      <div class="intro-copy">
        <span class="eyebrow">A little about us</span>
        <h2>Made for the things that matter.</h2>
      </div>
      <p class="lead">
        ${sub} We bring together thoughtful choices, a personal approach
        and attention to the details that make an experience memorable.
      </p>
    </section>

    <section class="container content-section">
      <header class="section-head">
        <span class="eyebrow">The experience</span>
        <h2>A thoughtful approach, at every step.</h2>
        <p class="lead">
          The little details come together to create something meaningful.
        </p>
      </header>

      <div class="grid-3">
        <article class="card feature-card">
          <span class="card-number">01</span>
          <h3>Thoughtful quality</h3>
          <p class="muted">
            Every detail is considered, from the first impression
            to the final experience.
          </p>
        </article>

        <article class="card feature-card">
          <span class="card-number">02</span>
          <h3>Made with intention</h3>
          <p class="muted">
            A clear point of view and a personal approach shape
            everything we do.
          </p>
        </article>

        <article class="card feature-card">
          <span class="card-number">03</span>
          <h3>Easy to explore</h3>
          <p class="muted">
            Find what you need through a simple, welcoming experience.
          </p>
        </article>
      </div>
    </section>

    <section class="closing-cta">
      <div class="container closing-cta-inner">
        <div>
          <span class="eyebrow">Your next step</span>
          <h2>Something good starts here.</h2>
        </div>
        <a href="${cta.href}" class="btn-light">${cta.text}</a>
      </div>
    </section>
  </main>`;
}

function shopPage({ brand, products }) {
  const cards = products
    .map((product, index) => {
      const img = imageUrl(product.img, 200 + index);

      return `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${img}"
            alt="${product.name}"
            loading="lazy"
            onerror="${IMG_ONERROR}"
          >
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="desc muted">${product.desc}</p>
          <div class="price-row">
            <span class="price">$${product.price}${product.unit}</span>
            <button
              type="button"
              class="add-to-cart"
              data-name="${product.name}"
              data-price="${product.price}"
              data-image="${img}"
            >
              Add to cart
            </button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  return `
  <main data-page="shop" class="page-route" hidden>
    <section class="container page-section">
      <header class="page-intro">
        <span class="eyebrow">The collection</span>
        <h1>Discover ${brand}.</h1>
        <p class="lead">
          Explore a considered collection of favourites and new discoveries.
        </p>
      </header>
      <div class="product-grid">${cards}</div>
    </section>
  </main>`;
}

function menuPage({ brand, products }) {
  const items = products
    .map((product, index) => {
      const img = imageUrl(product.img, 300 + index);

      return `
      <article class="product-card menu-card">
        <div class="product-image">
          <img
            src="${img}"
            alt="${product.name}"
            loading="lazy"
            onerror="${IMG_ONERROR}"
          >
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="desc muted">${product.desc}</p>
          <div class="price-row">
            <span class="price">$${product.price}</span>
            <button
              type="button"
              class="add-to-cart"
              data-name="${product.name}"
              data-price="${product.price}"
              data-image="${img}"
            >
              Order
            </button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  return `
  <main data-page="menu" class="page-route" hidden>
    <section class="container page-section">
      <header class="page-intro">
        <span class="eyebrow">From our kitchen</span>
        <h1>Made to be enjoyed.</h1>
        <p class="lead">
          Explore the menu at ${brand}, with something delicious
          for every occasion.
        </p>
      </header>
      <div class="product-grid">${items}</div>
    </section>
  </main>`;
}

function workPage({ brand }) {
  const projects = [
    {
      title: "Brand identity",
      blurb: "A distinctive visual direction built around a clear idea.",
      kw: "minimal brand identity design editorial",
    },
    {
      title: "Digital experience",
      blurb: "A considered digital experience with a strong visual language.",
      kw: "premium website design desktop mockup",
    },
    {
      title: "Creative direction",
      blurb: "A cohesive creative approach from concept to execution.",
      kw: "creative art direction photography editorial",
    },
    {
      title: "Visual storytelling",
      blurb: "A visual story shaped by composition, colour and detail.",
      kw: "editorial photography visual storytelling",
    },
    {
      title: "Product design",
      blurb: "A practical and thoughtful approach to product experiences.",
      kw: "minimal product design studio photography",
    },
    {
      title: "Campaign design",
      blurb: "A connected campaign with a memorable visual identity.",
      kw: "modern advertising campaign graphic design",
    },
  ];

  const tiles = projects
    .map(
      (project, index) => `
      <article class="work-card">
        <img
          src="${imageUrl(project.kw, 400 + index)}"
          alt="${project.title}"
          loading="lazy"
          onerror="${IMG_ONERROR}"
        >
        <div class="work-info">
          <span class="work-index">0${index + 1}</span>
          <h3>${project.title}</h3>
          <p class="muted">${project.blurb}</p>
        </div>
      </article>`
    )
    .join("");

  return `
  <main data-page="shop" class="page-route" hidden>
    <section class="container page-section">
      <header class="page-intro">
        <span class="eyebrow">Selected work</span>
        <h1>Ideas brought to life.</h1>
        <p class="lead">
          A selection of creative work and experiences from ${brand}.
        </p>
      </header>
      <div class="work-grid">${tiles}</div>
    </section>
  </main>`;
}

function featuresPage({ brand }) {
  const features = [
    ["01", "A clear direction", "A focused approach that keeps the experience simple and useful."],
    ["02", "Designed around people", "Thoughtful details that make everyday interactions easier."],
    ["03", "Made to work together", "A consistent experience across the things that matter."],
    ["04", "Room to grow", "A flexible foundation that can evolve with your needs."],
    ["05", "Attention to detail", "Careful decisions that make the overall experience feel complete."],
    ["06", "A personal approach", "An experience shaped around the people who use it."],
  ];

  return `
  <main data-page="features" class="page-route" hidden>
    <section class="container page-section">
      <header class="page-intro">
        <span class="eyebrow">${brand}</span>
        <h1>Considered in every detail.</h1>
        <p class="lead">
          Discover the ideas and details that shape the ${brand} experience.
        </p>
      </header>

      <div class="grid-3">
        ${features
          .map(
            ([number, title, description]) => `
            <article class="card feature-card">
              <span class="card-number">${number}</span>
              <h3>${title}</h3>
              <p class="muted">${description}</p>
            </article>`
          )
          .join("")}
      </div>
    </section>
  </main>`;
}
function aboutPage({ brand, sub }) {
  return `
  <main data-page="about" class="page-route" hidden>
    <section class="container page-section">
      <header class="page-intro">
        <span class="eyebrow">Our story</span>
        <h1>Getting to know ${brand}.</h1>
        <p class="lead">${sub}</p>
      </header>

      <div class="about-layout">
        <div class="about-heading">
          <span class="eyebrow">What we believe</span>
          <h2>Good experiences begin with thoughtful choices.</h2>
        </div>

        <div class="about-copy">
          <p>
            ${brand} is built around a simple idea: the best experiences
            feel natural, useful and considered. We believe that the
            details matter, and that a clear point of view makes all
            the difference.
          </p>

          <p>
            Our approach is personal and intentional. We focus on what
            matters most, keep the experience approachable and aim to
            make every interaction feel worthwhile.
          </p>

          <p>
            ${sub} We look forward to being part of your next discovery.
          </p>
        </div>
      </div>

      <div class="about-values">
        <article class="value-card">
          <span>01</span>
          <h3>Purpose</h3>
          <p class="muted">Every decision starts with a clear reason.</p>
        </article>

        <article class="value-card">
          <span>02</span>
          <h3>Care</h3>
          <p class="muted">We pay attention to the details.</p>
        </article>

        <article class="value-card">
          <span>03</span>
          <h3>Consistency</h3>
          <p class="muted">We aim to make every interaction feel connected.</p>
        </article>
      </div>
    </section>
  </main>`;
}

function contactPage({ brand }) {
  return `
  <main data-page="contact" class="page-route" hidden>
    <section class="container page-section">
      <header class="page-intro">
        <span class="eyebrow">Get in touch</span>
        <h1>Let's start a conversation.</h1>
        <p class="lead">
          Have a question or something in mind? Send us a message.
        </p>
      </header>

      <div class="contact-grid">
        <form
          class="contact-form"
          onsubmit="event.preventDefault();window.__ms_toast&&window.__ms_toast('Thanks for your message! This demo form is not connected to a server.');this.reset()"
        >
          <div class="form-heading">
            <h2>Send us a message</h2>
            <p class="muted">Fill in the details below.</p>
          </div>

          <div class="fld">
            <label for="contact-name">Your name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            >
          </div>

          <div class="fld">
            <label for="contact-email">Email address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            >
          </div>

          <div class="fld">
            <label for="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              placeholder="How can we help?"
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-primary form-submit">
            Send message
          </button>
        </form>

        <aside class="contact-aside">
          <span class="eyebrow">Say hello</span>
          <h2>We'd love to hear from you.</h2>
          <p class="muted">
            Use the message form and tell us a little about what
            you're looking for.
          </p>

          <div class="contact-detail">
            <span class="detail-label">Business</span>
            <strong>${brand}</strong>
          </div>

          <div class="contact-detail">
            <span class="detail-label">Availability</span>
            <strong>Send us a message anytime</strong>
          </div>

          <p class="contact-disclaimer">
            Contact details and opening hours can be added when
            official business information is available.
          </p>
        </aside>
      </div>
    </section>
  </main>`;
}

function signinPage({ brand }) {
  return `
  <main data-page="signin" class="page-route" hidden>
    <section class="container page-section auth-section">
      <form
        class="auth-card"
        onsubmit="event.preventDefault();window.__ms_toast&&window.__ms_toast('This demo sign-in form is not connected to an account service.');"
      >
        <span class="eyebrow">Welcome back</span>
        <h1>Sign in to ${brand}.</h1>
        <p class="muted">
          Enter your details to continue.
        </p>

        <div class="fld">
          <label for="signin-email">Email address</label>
          <input
            id="signin-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          >
        </div>

        <div class="fld">
          <label for="signin-password">Password</label>
          <input
            id="signin-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          >
        </div>

        <button type="submit" class="btn-primary form-submit">
          Sign in
        </button>

        <p class="auth-switch">
          Don't have an account?
          <a href="#signup">Create an account</a>
        </p>
      </form>
    </section>
  </main>`;
}

function signupPage({ brand }) {
  return `
  <main data-page="signup" class="page-route" hidden>
    <section class="container page-section auth-section">
      <form
        class="auth-card"
        onsubmit="event.preventDefault();window.__ms_toast&&window.__ms_toast('This demo registration form is not connected to an account service.');"
      >
        <span class="eyebrow">Join us</span>
        <h1>Create your ${brand} account.</h1>
        <p class="muted">
          Enter your details to get started.
        </p>

        <div class="fld">
          <label for="signup-name">Full name</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            placeholder="Your full name"
            required
          >
        </div>

        <div class="fld">
          <label for="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          >
        </div>

        <div class="fld">
          <label for="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            minlength="6"
            placeholder="At least 6 characters"
            required
          >
        </div>

        <button type="submit" class="btn-primary form-submit">
          Create account
        </button>

        <p class="auth-switch">
          Already have an account?
          <a href="#signin">Sign in</a>
        </p>
      </form>
    </section>
  </main>`;
}

// ══ FALLBACK DESIGN SYSTEM ══

const BASE_CSS = (c) => `
:root {
  --primary: ${c.primary};
  --accent: ${c.accent};
  --bg: ${c.bg};
  --bg-soft: ${c.bgSoft};
  --ink: ${c.ink};
  --muted: ${c.muted};
  --surface: #ffffff;
  --border: rgba(25, 25, 35, 0.10);
  --radius: 18px;
  --max: 1160px;
  --shadow: 0 20px 60px rgba(20, 20, 35, 0.08);
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--bg);
  color: var(--ink);
  font-family: Inter, Arial, sans-serif;
  line-height: 1.65;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, textarea {
  font: inherit;
}

button, a {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

[hidden] {
  display: none !important;
}

.container {
  width: min(100% - 48px, var(--max));
  margin-inline: auto;
}

section {
  position: relative;
}

h1, h2, h3, p {
  margin-top: 0;
}

h1 {
  font-size: clamp(2.7rem, 5.5vw, 5rem);
  line-height: 1.04;
  letter-spacing: -0.055em;
  font-weight: 750;
}

h2 {
  font-size: clamp(2rem, 3.5vw, 3.25rem);
  line-height: 1.12;
  letter-spacing: -0.04em;
  font-weight: 700;
}

h3 {
  font-size: 1.15rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

p {
  margin-bottom: 1rem;
}

.muted {
  color: var(--muted);
  font-size: .94rem;
}

.lead {
  max-width: 58ch;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.8;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-size: .76rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: .14em;
  margin-bottom: 1rem;
}

.btn-primary,
.btn-ghost,
.btn-light {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 13px 22px;
  border-radius: 999px;
  font-size: .9rem;
  font-weight: 700;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}

.btn-primary {
  color: #ffffff;
  background: var(--primary);
  border: 1px solid var(--primary);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--primary) 22%, transparent);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--primary) 28%, transparent);
}

.btn-ghost {
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  background: var(--bg-soft);
}

.btn-light {
  color: var(--ink);
  background: #ffffff;
  border: 1px solid #ffffff;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(40px, 6vw, 80px);
  padding-top: clamp(50px, 8vw, 100px);
  padding-bottom: clamp(55px, 8vw, 100px);
}

.hero-copy {
  max-width: 570px;
}

.hero-copy h1 {
  max-width: 600px;
  margin-bottom: 18px;
}

.hero-period {
  color: var(--accent);
}

.hero-tagline {
  color: var(--primary);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 650;
  line-height: 1.35;
  margin-bottom: 14px;
}

.hero-copy .lead {
  margin-bottom: 28px;
}

.ctas {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-note {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 36px;
  color: var(--muted);
  font-size: .78rem;
  letter-spacing: .04em;
}

.hero-note-line {
  width: 34px;
  height: 1px;
  background: var(--accent);
}

.hero-image {
  position: relative;
  min-width: 0;
}

.hero-image img {
  width: 100%;
  aspect-ratio: 5 / 5.3;
  object-fit: cover;
  border-radius: 24px;
  background: var(--bg-soft);
  box-shadow: var(--shadow);
}

.image-caption {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 4px 0;
  color: var(--muted);
  font-size: .75rem;
  letter-spacing: .04em;
}

.intro-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: end;
  padding-top: 60px;
  padding-bottom: 60px;
  border-top: 1px solid var(--border);
}

.intro-copy h2 {
  max-width: 540px;
  margin-bottom: 0;
}

.intro-section > .lead {
  margin-bottom: 5px;
}

.content-section,
.page-section {
  padding-top: 90px;
  padding-bottom: 90px;
}

.section-head,
.page-intro {
  max-width: 700px;
  margin-bottom: 48px;
}

.section-head {
  text-align: center;
  margin-inline: auto;
}

.section-head h2,
.page-intro h1 {
  margin-bottom: 18px;
}

.section-head .lead {
  margin-inline: auto;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.card {
  min-width: 0;
  padding: 30px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: transform .2s ease, box-shadow .2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.card-number {
  display: block;
  color: var(--primary);
  font-size: .78rem;
  font-weight: 750;
  letter-spacing: .1em;
  margin-bottom: 28px;
}

.feature-card h3 {
  margin-bottom: 10px;
}

.feature-card p {
  margin-bottom: 0;
}

.closing-cta {
  padding: 65px 0;
  background: var(--primary);
  color: #ffffff;
}

.closing-cta .eyebrow {
  color: rgba(255,255,255,.75);
}

.closing-cta h2 {
  max-width: 620px;
  margin-bottom: 0;
}

.closing-cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}
  /* ══ PRODUCT AND WORK LAYOUTS ══ */

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;
}

.product-card {
  min-width: 0;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: transform .2s ease, box-shadow .2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.product-image {
  overflow: hidden;
  background: var(--bg-soft);
}

.product-image img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform .4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.035);
}

.product-info {
  padding: 22px;
}

.product-info h3 {
  margin-bottom: 8px;
}

.product-card .desc {
  min-height: 48px;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.price {
  color: var(--primary);
  font-size: 1.05rem;
  font-weight: 750;
}

.add-to-cart {
  min-height: 42px;
  padding: 10px 16px;
  border: 0;
  border-radius: 999px;
  background: var(--primary);
  color: #ffffff;
  font-size: .82rem;
  font-weight: 700;
}

.add-to-cart:hover {
  background: var(--accent);
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px;
}

.work-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.work-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--bg-soft);
}

.work-info {
  padding: 24px;
}

.work-index {
  display: block;
  margin-bottom: 12px;
  color: var(--primary);
  font-size: .76rem;
  font-weight: 750;
}

.work-info h3 {
  margin-bottom: 8px;
}

.work-info p {
  margin-bottom: 0;
}

/* ══ ABOUT PAGE ══ */

.about-layout {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 70px;
  align-items: start;
  padding: 45px 0 70px;
  border-top: 1px solid var(--border);
}

.about-heading h2 {
  max-width: 470px;
}

.about-copy p {
  color: var(--muted);
  line-height: 1.9;
  margin-bottom: 20px;
}

.about-values {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.value-card {
  padding: 25px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-soft);
}

.value-card > span {
  display: block;
  margin-bottom: 24px;
  color: var(--primary);
  font-size: .8rem;
  font-weight: 750;
}

.value-card h3 {
  margin-bottom: 8px;
}

.value-card p {
  margin-bottom: 0;
}

/* ══ CONTACT PAGE ══ */

.contact-grid {
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 50px;
  align-items: start;
}

.contact-form,
.auth-card {
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.form-heading {
  margin-bottom: 30px;
}

.form-heading h2 {
  font-size: 1.7rem;
  margin-bottom: 8px;
}

.fld {
  margin-bottom: 20px;
}

.fld label {
  display: block;
  margin-bottom: 8px;
  color: var(--ink);
  font-size: .86rem;
  font-weight: 650;
}

.fld input,
.fld textarea {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 13px 15px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-soft);
  color: var(--ink);
  font-size: .92rem;
}

.fld textarea {
  resize: vertical;
}

.fld input:focus,
.fld textarea:focus {
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}

.form-submit {
  width: 100%;
  border: 0;
}

.contact-aside {
  padding: 25px 10px;
}

.contact-aside h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  margin-bottom: 18px;
}

.contact-aside > .muted {
  line-height: 1.8;
  margin-bottom: 35px;
}

.contact-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 18px 0;
  border-top: 1px solid var(--border);
}

.detail-label {
  color: var(--muted);
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .1em;
}

.contact-detail strong {
  font-size: .95rem;
  font-weight: 650;
}

.contact-disclaimer {
  margin-top: 25px;
  color: var(--muted);
  font-size: .78rem;
  line-height: 1.7;
}

/* ══ AUTH PAGES ══ */

.auth-section {
  display: flex;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 470px;
  margin: 20px auto;
}

.auth-card h1 {
  font-size: clamp(2rem, 4vw, 2.7rem);
  margin-bottom: 12px;
}

.auth-card > .muted {
  margin-bottom: 30px;
}

.auth-switch {
  margin: 24px 0 0;
  color: var(--muted);
  text-align: center;
  font-size: .86rem;
}

.auth-switch a {
  color: var(--primary);
  font-weight: 700;
}

.auth-switch a:hover {
  text-decoration: underline;
}

/* ══ NAVIGATION ══ */

header.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.nav .inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  min-height: 76px;
  max-width: var(--max);
  padding: 12px 24px;
  margin: 0 auto;
}

.nav .logo {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
  color: var(--ink);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -.03em;
}

.nav .logo .mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--primary);
  color: #ffffff;
  font-size: .95rem;
  font-weight: 800;
}

.nav .links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-left: auto;
}

.nav .links a {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 9px 12px;
  border-radius: 999px;
  color: var(--muted);
  font-size: .85rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background .2s ease, color .2s ease;
}

.nav .links a:hover,
.nav .links a.active,
.nav .links a[aria-current="page"] {
  background: var(--bg-soft);
  color: var(--primary);
}

.nav .auth {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.nav .auth a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 9px 15px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--ink);
  font-size: .82rem;
  font-weight: 700;
  white-space: nowrap;
}

.nav .auth a.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.nav .auth a:hover {
  border-color: var(--primary);
}

.nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: #ffffff;
  color: var(--ink);
  font-size: 1.2rem;
}

/* ══ FOOTER ══ */

footer {
  margin-top: 0;
  padding: 65px 0 25px;
  background: #171923;
  color: #ffffff;
}

.foot-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 45px;
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 24px;
}

footer .brand-block .logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
}

footer .brand-block .mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--primary);
  color: #ffffff;
}

footer .brand-block p {
  max-width: 350px;
  margin-top: 18px;
  color: rgba(255,255,255,.66);
  font-size: .9rem;
  line-height: 1.8;
}

footer h4 {
  margin: 5px 0 18px;
  color: #ffffff;
  font-size: .8rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}

footer ul li a {
  display: inline-block;
  padding: 6px 0;
  color: rgba(255,255,255,.7);
  font-size: .87rem;
}

footer ul li a:hover {
  color: #ffffff;
}

.foot-bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  max-width: var(--max);
  margin: 45px auto 0;
  padding: 22px 24px 0;
  border-top: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.52);
  font-size: .77rem;
}

/* ══ CART ══ */

.cart-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: #ffffff;
  color: var(--ink);
  font-size: 1.05rem;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 19px;
  height: 19px;
  padding: 0 5px;
  border-radius: 50px;
  background: var(--primary);
  color: #ffffff;
  font-size: .68rem;
  font-weight: 750;
}

[data-page] {
  animation: pageIn .25s ease;
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  /* ══ RESPONSIVE DESIGN ══ */

@media (max-width: 1024px) {
  .nav .inner {
    gap: 12px;
  }

  .nav .links a {
    padding-inline: 9px;
    font-size: .8rem;
  }

  .hero {
    gap: 35px;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    width: min(100% - 36px, var(--max));
  }

  .nav .inner {
    min-height: 68px;
    flex-wrap: wrap;
    padding: 10px 18px;
  }

  .nav-toggle {
    display: inline-flex;
    margin-left: auto;
  }

  .nav .links {
    display: none;
    order: 5;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
    margin: 0;
    padding: 12px 0;
    border-top: 1px solid var(--border);
  }

  .nav .links.is-open {
    display: flex;
  }

  .nav .links a {
    justify-content: flex-start;
    width: 100%;
    padding: 11px 14px;
  }

  .nav .auth {
    margin-left: 0;
  }

  .nav .auth a {
    min-height: 40px;
    padding: 8px 12px;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 35px;
    padding-top: 45px;
    padding-bottom: 55px;
  }

  .hero-copy {
    max-width: 650px;
  }

  .hero-image {
    width: 100%;
  }

  .hero-image img {
    max-height: 480px;
    aspect-ratio: 16 / 10;
  }

  .intro-section {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-block: 45px;
  }

  .content-section,
  .page-section {
    padding-block: 65px;
  }

  .grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-layout {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .closing-cta-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .foot-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
  }
}

@media (max-width: 520px) {
  .container {
    width: calc(100% - 32px);
  }

  h1 {
    font-size: clamp(2.2rem, 10vw, 3.1rem);
  }

  h2 {
    font-size: clamp(1.75rem, 8vw, 2.4rem);
  }

  .hero {
    padding-top: 35px;
    gap: 28px;
  }

  .hero-image img {
    aspect-ratio: 4 / 3;
    border-radius: 16px;
  }

  .hero-note {
    margin-top: 25px;
  }

  .ctas {
    align-items: stretch;
    flex-direction: column;
  }

  .ctas > * {
    width: 100%;
  }

  .grid-3,
  .product-grid,
  .work-grid,
  .about-values {
    grid-template-columns: 1fr;
    gap: 17px;
  }

  .section-head {
    margin-bottom: 32px;
    text-align: left;
  }

  .section-head .lead {
    margin-left: 0;
  }

  .content-section,
  .page-section {
    padding-block: 48px;
  }

  .card {
    padding: 24px;
  }

  .product-info {
    padding: 18px;
  }

  .product-card .desc {
    min-height: 0;
  }

  .price-row {
    align-items: center;
  }

  .about-layout {
    padding-top: 30px;
    padding-bottom: 40px;
  }

  .contact-form,
  .auth-card {
    padding: 22px 18px;
  }

  .foot-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .foot-bottom {
    flex-direction: column;
    padding-inline: 20px;
  }

  footer {
    padding-top: 45px;
  }

  .image-caption {
    font-size: .68rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

// ══ NAVIGATION CONFIGURATION ══

// Each entry: [label, hash, data-page value].
function navConfig(type) {
  const configs = {
    ecommerce: [
      ["Home", "#home", "home"],
      ["Shop", "#shop", "shop"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    restaurant: [
      ["Home", "#home", "home"],
      ["Menu", "#menu", "menu"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    portfolio: [
      ["Home", "#home", "home"],
      ["Work", "#shop", "shop"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    agency: [
      ["Home", "#home", "home"],
      ["Services", "#features", "features"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    saas: [
      ["Home", "#home", "home"],
      ["Features", "#features", "features"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    event: [
      ["Home", "#home", "home"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    nonprofit: [
      ["Home", "#home", "home"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],

    generic: [
      ["Home", "#home", "home"],
      ["Features", "#features", "features"],
      ["About", "#about", "about"],
      ["Contact", "#contact", "contact"],
    ],
  };

  return configs[type] || configs.generic;
}

function navFor(type) {
  return navConfig(type)
    .map(
      ([label, hash]) =>
        `<a href="${hash}">${label}</a>`
    )
    .join("\n");
}

function cartIcon(type) {
  if (type !== "ecommerce" && type !== "restaurant") {
    return "";
  }

  return `
    <button
      type="button"
      class="cart-icon"
      aria-label="Shopping cart"
    >
      🛒
      <span class="cart-count">0</span>
    </button>
  `;
}

function footerBrowseLinks(type) {
  return navConfig(type)
    .map(
      ([label, hash]) =>
        `<li><a href="${hash}">${label}</a></li>`
    )
    .join("");
}

// ══ PAGE ASSEMBLY ══

function pagesFor({ type, brand, sub, imgKw, products }) {
  const pages = [
    homePage({ brand, sub, type, imgKw }),
  ];

  if (type === "ecommerce") {
    pages.push(shopPage({ brand, products }));
  }

  if (type === "restaurant") {
    pages.push(menuPage({ brand, products }));
  }

  if (type === "portfolio") {
    pages.push(workPage({ brand }));
  }

  if (["saas", "agency", "generic"].includes(type)) {
    pages.push(featuresPage({ brand }));
  }

  pages.push(aboutPage({ brand, sub }));
  pages.push(contactPage({ brand }));
  pages.push(signinPage({ brand }));
  pages.push(signupPage({ brand }));

  return pages.join("\n");
}

// ══ MAIN FALLBACK GENERATOR ══

export function generateMockSite(prompt) {
  const safePrompt = prompt || "modern business website";

  const palette = pickPalette(safePrompt);
  const type = pickType(safePrompt);
  const brand = brandName(safePrompt);
  const sub = tagline(safePrompt);

  const initial = brand.charAt(0).toUpperCase();

  const imgKw = safePrompt
    .split(/\s+/)
    .slice(0, 5)
    .join(" ");

  const products = productsFor(safePrompt);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${brand} — ${sub}">
<meta name="theme-color" content="${palette.bg}">
<title>${brand}</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
>

<style>${BASE_CSS(palette)}</style>
</head>

<body>

<header class="nav">
  <div class="inner">

    <a class="logo" href="#home" aria-label="${brand} home">
      <span class="mark">${initial}</span>
      <span>${brand}</span>
    </a>

    <nav class="links" id="site-navigation" aria-label="Main navigation">
      ${navFor(type)}
    </nav>

    <div class="auth">
      <a href="#signin">Sign in</a>
      <a class="primary" href="#signup">Get started</a>
    </div>

    <button
      type="button"
      class="nav-toggle"
      data-menu-toggle
      aria-label="Toggle navigation"
      aria-controls="site-navigation"
      aria-expanded="false"
    >
      ☰
    </button>

    ${cartIcon(type)}

  </div>
</header>

${pagesFor({ type, brand, sub, imgKw, products })}

<footer>
  <div class="foot-grid">

    <div class="brand-block">
      <a class="logo" href="#home">
        <span class="mark">${initial}</span>
        <span>${brand}</span>
      </a>

      <p>${sub} Thoughtfully made with care and attention to detail.</p>
    </div>

    <div>
      <h4>Explore</h4>
      <ul>${footerBrowseLinks(type)}</ul>
    </div>

    <div>
      <h4>Account</h4>
      <ul>
        <li><a href="#signup">Create account</a></li>
        <li><a href="#signin">Sign in</a></li>
        <li><a href="#contact">Contact us</a></li>
      </ul>
    </div>

  </div>

  <div class="foot-bottom">
    <span>© ${new Date().getFullYear()} ${brand}. All rights reserved.</span>
    <span>Designed with care.</span>
  </div>
</footer>

<script>
(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var navigation = document.getElementById("site-navigation");

  if (toggle && navigation) {
    toggle.addEventListener("click", function () {
      var isOpen = navigation.classList.toggle("is-open");

      toggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      toggle.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });
  }
})();
</script>

</body>
</html>`;
}

// ══ FALLBACK DESIGN BRIEF ══

export function mockEnhancePrompt(prompt) {
  const palette = pickPalette(prompt);
  const type = pickType(prompt);

  const pageMap = {
    ecommerce: "Home, Shop, About, Contact, Sign In, Sign Up",
    restaurant: "Home, Menu, About, Contact, Sign In, Sign Up",
    portfolio: "Home, Work, About, Contact, Sign In, Sign Up",
    agency: "Home, Services, About, Contact, Sign In, Sign Up",
    saas: "Home, Features, About, Contact, Sign In, Sign Up",
    event: "Home, About, Contact, Sign In, Sign Up",
    nonprofit: "Home, About, Contact, Sign In, Sign Up",
    generic: "Home, Features, About, Contact, Sign In, Sign Up",
  };

  const brand = brandName(prompt);
  const sub = tagline(prompt);

  const keywords = (prompt || "modern business")
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");

  return `Type: ${type}
Layout: multi-page
Brand: ${brand}
Audience: People interested in ${prompt || "this business"}.
Tone: modern, thoughtful, welcoming
Palette: primary ${palette.primary}, accent ${palette.accent}, bg ${palette.bg}, ink ${palette.ink}
Fonts: Inter, Inter
Hero headline: ${brand}
Hero subhead: ${sub}
Image keyword: ${keywords}
Pages: ${pageMap[type]}
Unique touch: A balanced split hero, considered typography, relevant photography and a consistent responsive design system.`;
}