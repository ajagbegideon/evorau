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
}

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
