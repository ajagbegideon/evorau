// Scroll-reveal: fade/slide elements in as they enter the viewport.
// Runs first and is self-contained so a later error (carousel, etc.)
// can never leave sections stuck invisible.
try {
  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
} catch (err) {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("is-visible"));
}

const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
const track = document.getElementById("carouselTrack");
const cards = Array.from(track.querySelectorAll(".carousel-card"));
const n = cards.length;
let active = 0;

const dotsWrap = document.getElementById("carouselDots");
cards.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "carousel-dot";
  dot.setAttribute("aria-label", `Go to product ${i + 1}`);
  dot.addEventListener("click", () => setActive(i));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function offsetFor(i) {
  let diff = (((i - active) % n) + n) % n;
  if (diff > n / 2) diff -= n;
  return diff;
}
function getSpacing() {
  return cards[0].offsetWidth + 40;
}
function renderCarousel() {
  cards.forEach((card, i) => {
    const off = offsetFor(i);
    const abs = Math.abs(off);
    const scale = Math.max(0.6, 1 - abs * 0.16);
    const opacity = abs > 2.5 ? 0 : Math.max(0, 1 - abs * 0.3);
    const translateY = off * off * 6;
    const translateZ = -abs * 90;
    const rotate = off * -20;

    card.style.transform = `translateX(${off * getSpacing()}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotate}deg) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = 100 - Math.round(abs);
    card.style.pointerEvents = abs > 2.5 ? "none" : "auto";
  });

  dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
}

function setActive(i) {
  active = ((i % n) + n) % n;
  renderCarousel();
}

cards.forEach((card, i) => card.addEventListener("click", () => setActive(i)));

document
  .getElementById("carouselPrev")
  .addEventListener("click", () => setActive(active - 1));
document
  .getElementById("carouselNext")
  .addEventListener("click", () => setActive(active + 1));

const stage = document.getElementById("carouselStage");
let dragStartX = null;

stage.addEventListener("pointerdown", (e) => {
  dragStartX = e.clientX;
});
stage.addEventListener("pointerup", (e) => {
  if (dragStartX === null) return;
  const dx = e.clientX - dragStartX;
  if (dx > 50) setActive(active - 1);
  else if (dx < -50) setActive(active + 1);
  dragStartX = null;
});

stage.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") setActive(active - 1);
  if (e.key === "ArrowRight") setActive(active + 1);
});

renderCarousel();
document.getElementById("year").textContent = new Date().getFullYear();
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  header.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("menu-lock");
}

function openMenu() {
  header.classList.add("menu-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
  document.body.classList.add("menu-lock");
}

navToggle.addEventListener("click", () => {
  if (header.classList.contains("menu-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close on Escape, and on any click/tap outside the header (e.g. the
// page area revealed below the open mobile menu).
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && header.classList.contains("menu-open")) {
    closeMenu();
    navToggle.focus();
  }
});

document.addEventListener("click", (e) => {
  if (
    header.classList.contains("menu-open") &&
    !header.contains(e.target)
  ) {
    closeMenu();
  }
});

// ---------------------------------------------------------------------
// Shop grid + cart
//
// This is a real product catalog and cart, not a demo. There is no
// payment gateway (Evorau takes orders and payment over WhatsApp), so
// "checkout" builds an itemized order message and opens WhatsApp with
// it pre-filled — the actual price/stock/payment gets confirmed there,
// same as every other CTA on this site already says it will.
//
// Wrapped in its own try/catch so a bug here can never take down the
// carousel or mobile menu above, which already work.
// ---------------------------------------------------------------------
try {
  const WHATSAPP_NUMBER = "2349159113222";

  // Real products only — these are the same six items already shown in
  // the "New arrivals" carousel, now also tagged by category so they can
  // be filtered and added to cart. Add more products here as photos and
  // prices for the rest of the catalog become available.
  const PRODUCTS = [
    {
      id: "child-hoodie",
      name: "Children's Beige Hoodie Set",
      price: 23000,
      category: "children",
      image: "images/new-1.jpg",
      alt: "Children's beige two-piece hoodie and jogger set",
      w: 600,
      h: 750,
    },
    {
      id: "men-polo",
      name: "Men's Patterned Polo Shirt",
      price: 12000,
      category: "men",
      image: "images/new-2.jpg",
      alt: "Men's white patterned polo shirt",
      w: 600,
      h: 800,
    },
    {
      id: "women-lounge",
      name: "Women's Heart-Print Lounge Set",
      price: 8000,
      category: "women",
      image: "images/new-3.jpg",
      alt: "Women's black heart-print two-piece lounge set",
      w: 600,
      h: 903,
    },
    {
      id: "essentials-cotton",
      name: "Soft Cotton Essentials (5-Pack)",
      price: 650,
      priceSuffix: " each",
      category: "essentials",
      image: "images/new-4.jpg",
      alt: "Soft cotton women's essentials",
      w: 600,
      h: 800,
    },
    {
      id: "men-tshirt",
      name: "Classic Men's T-Shirt",
      price: 8000,
      category: "men",
      image: "images/new-5.jpg",
      w: 600,
      h: 800,
      alt: "Classic men's t-shirt",
    },
    {
      id: "women-activewear",
      name: "Women's Activewear Set",
      price: 9000,
      category: "women",
      image: "images/new-6.jpg",
      alt: "Women's activewear set",
      w: 600,
      h: 903,
    },
  ];

  function formatNaira(amount) {
    return "₦" + amount.toLocaleString("en-US");
  }

  // --- Cart state, persisted so it survives a page refresh ---
  const CART_KEY = "evorau_cart";

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      // localStorage unavailable (private browsing, etc.) — cart just
      // won't persist across reloads; the page keeps working.
    }
  }

  let cart = loadCart(); // { [productId]: quantity }

  function cartCount() {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  function cartSubtotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return product ? sum + product.price * qty : sum;
    }, 0);
  }

  function setQty(id, qty) {
    if (qty <= 0) {
      delete cart[id];
    } else {
      cart[id] = qty;
    }
    saveCart(cart);
    renderCart();
    renderProductGrid(activeFilter);
  }

  function addToCart(id) {
    setQty(id, (cart[id] || 0) + 1);
    openCart();
  }

  // --- Cart drawer UI ---
  const cartToggle = document.getElementById("cartToggle");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartClose = document.getElementById("cartClose");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartCheckoutEl = document.getElementById("cartCheckout");

  function openCart() {
    cartDrawer.classList.add("is-open");
    cartBackdrop.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-lock");
  }

  function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartBackdrop.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    if (!header.classList.contains("menu-open")) {
      document.body.classList.remove("menu-lock");
    }
  }

  cartToggle.addEventListener("click", () => {
    if (cartDrawer.classList.contains("is-open")) {
      closeCart();
    } else {
      openCart();
    }
  });
  cartClose.addEventListener("click", closeCart);
  cartBackdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("is-open")) {
      closeCart();
      cartToggle.focus();
    }
  });

  function buildWhatsappOrderUrl() {
    const lines = Object.entries(cart).map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return null;
      return `${qty}x ${product.name} - ${formatNaira(product.price * qty)}`;
    });
    const body =
      "Hi, I'd like to order:\n" +
      lines.filter(Boolean).join("\n") +
      `\n\nTotal: ${formatNaira(cartSubtotal())}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
  }

  function renderCart() {
    const count = cartCount();
    cartCountEl.textContent = String(count);
    cartCountEl.hidden = count === 0;
    cartToggle.setAttribute(
      "aria-label",
      `Open cart, ${count} item${count === 1 ? "" : "s"}`,
    );

    cartItemsEl.innerHTML = "";
    const entries = Object.entries(cart);

    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "cart-empty";
      empty.textContent = "Your cart is empty. Add something you like!";
      cartItemsEl.appendChild(empty);
    } else {
      entries.forEach(([id, qty]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        if (!product) return;

        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <img src="${product.image}" alt="" />
          <div>
            <p class="cart-item-name">${product.name}</p>
            <p class="cart-item-price">${formatNaira(product.price)}${product.priceSuffix || ""}</p>
            <div class="cart-item-qty">
              <button type="button" data-action="dec" aria-label="Decrease quantity">&minus;</button>
              <span>${qty}</span>
              <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" aria-label="Remove ${product.name}">
            <i class="ti ti-trash" aria-hidden="true"></i>
          </button>
        `;

        row
          .querySelector('[data-action="dec"]')
          .addEventListener("click", () => setQty(id, qty - 1));
        row
          .querySelector('[data-action="inc"]')
          .addEventListener("click", () => setQty(id, qty + 1));
        row
          .querySelector(".cart-item-remove")
          .addEventListener("click", () => setQty(id, 0));

        cartItemsEl.appendChild(row);
      });
    }

    cartSubtotalEl.textContent = formatNaira(cartSubtotal());
    if (entries.length === 0) {
      cartCheckoutEl.classList.add("is-disabled");
      cartCheckoutEl.removeAttribute("href");
    } else {
      cartCheckoutEl.classList.remove("is-disabled");
      cartCheckoutEl.href = buildWhatsappOrderUrl();
    }
  }

  // --- Product grid + category filter tabs ---
  const productGrid = document.getElementById("productGrid");
  const shopTabs = document.querySelectorAll(".shop-tab");
  let activeFilter = "all";

  function renderProductGrid(filter) {
    activeFilter = filter;
    const items =
      filter === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === filter);

    productGrid.innerHTML = "";
    items.forEach((product) => {
      const qty = cart[product.id] || 0;
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-card-image">
          <img
            src="${product.image}"
            alt="${product.alt}"
            loading="lazy"
            width="${product.w}"
            height="${product.h}"
          />
        </div>
        <div class="product-card-body">
          <p class="product-card-name">${product.name}</p>
          <p class="product-card-price">${formatNaira(product.price)}${product.priceSuffix || ""}</p>
          <div class="product-card-action"></div>
        </div>
      `;

      const actionSlot = card.querySelector(".product-card-action");
      renderCardAction(actionSlot, product.id, qty);

      productGrid.appendChild(card);
    });
  }

  function renderCardAction(slot, id, qty) {
    slot.innerHTML = "";
    if (qty === 0) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "product-add-btn";
      btn.innerHTML =
        '<i class="ti ti-shopping-bag-plus" aria-hidden="true"></i> Add to cart';
      btn.addEventListener("click", () => addToCart(id));
      slot.appendChild(btn);
    } else {
      const stepper = document.createElement("div");
      stepper.className = "product-qty";
      stepper.innerHTML = `
        <button type="button" data-action="dec" aria-label="Decrease quantity">&minus;</button>
        <span>${qty}</span>
        <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
      `;
      stepper
        .querySelector('[data-action="dec"]')
        .addEventListener("click", () => setQty(id, qty - 1));
      stepper
        .querySelector('[data-action="inc"]')
        .addEventListener("click", () => setQty(id, qty + 1));
      slot.appendChild(stepper);
    }
  }

  shopTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      shopTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      renderProductGrid(tab.dataset.filter);
    });
  });

  // Category links in the nav ("Men's fashion", etc.) jump to the shop
  // section AND pre-select the matching tab.
  document.querySelectorAll("a[data-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      const filter = link.dataset.filter;
      const tab = document.querySelector(`.shop-tab[data-filter="${filter}"]`);
      if (tab) {
        shopTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderProductGrid(filter);
      }
    });
  });

  renderProductGrid("all");
  renderCart();
} catch (err) {
  // Shop/cart failed to initialize — the rest of the site (carousel,
  // menu, WhatsApp links elsewhere) still works fine without it.
}
