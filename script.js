/* ============================================================
   LAURS RESTAURANT TEMPLATE — script.js
   ============================================================
   CONFIG holds the values that change most often per client.
   Every feature below is a small, independent function so
   sections can be removed without breaking the rest.
   ============================================================ */

const CONFIG = {
  whatsappNumber: "27000000000", // digits only, country code first
  phoneNumber: "+27000000000",
};

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initScrollProgress();
  initHeaderScroll();
  initMobileNav();
  initThemeToggle();
  initSmoothAnchors();
  initScrollReveal();
  initMenuTabs();
  initDishTilt();
  initGalleryLightbox();
  initReserveBar();
  initBackToTop();
  initReserveForm();
  initNewsletterForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   Preloader
--------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  const minDisplay = 450;
  const start = Date.now();

  const hide = () => {
    const wait = Math.max(minDisplay - (Date.now() - start), 0);
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      preloader.setAttribute("aria-hidden", "true");
    }, wait);
  };

  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide);
}

/* ---------------------------------------------------------
   Scroll progress bar — fills as the page is scrolled
--------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* ---------------------------------------------------------
   Sticky header background on scroll
--------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
}

/* ---------------------------------------------------------
   Dark mode toggle — session only (no persistence storage
   is used inside this preview environment; wire localStorage
   back in once deployed on a client's own domain if you want
   the preference remembered between visits).
--------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const icon = btn.querySelector("i");

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    btn.setAttribute("aria-pressed", String(!isDark));
    btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (icon) {
      icon.classList.toggle("fa-moon", next === "light");
      icon.classList.toggle("fa-sun", next === "dark");
    }
  });
}

/* ---------------------------------------------------------
   Smooth-scroll anchors with header-height offset
--------------------------------------------------------- */
function initSmoothAnchors() {
  const header = document.getElementById("siteHeader");
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ---------------------------------------------------------
   Scroll-reveal
--------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Menu category tabs
--------------------------------------------------------- */
function initMenuTabs() {
  const buttons = document.querySelectorAll(".menu-tabs__btn");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      document.querySelectorAll(".menu-tabs__panel").forEach((panel) => {
        const match = panel.id === `panel-${target}`;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    });
  });
}

/* ---------------------------------------------------------
   Dish card tilt — subtle 3D pointer-follow on desktop only.
   Skipped on touch devices and when reduced motion is set.
--------------------------------------------------------- */
function initDishTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "box-shadow 0.4s var(--ease)"; // transform updates instantly while tracking
    });
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.5s var(--ease), box-shadow 0.4s var(--ease)"; // smooth reset
      card.style.transform = "";
    });
  });
}

/* ---------------------------------------------------------
   Gallery lightbox
--------------------------------------------------------- */
function initGalleryLightbox() {
  const items = document.querySelectorAll(".gallery__item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  if (!items.length || !lightbox) return;

  let lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      open(item.dataset.full, img ? img.alt : "");
    });
  });
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
}

/* ---------------------------------------------------------
   Signature sticky reservation bar — appears once the hero
   has been scrolled past, hides again near the reservation
   section itself so it never competes with the real form.
--------------------------------------------------------- */
function initReserveBar() {
  const bar = document.getElementById("reserveBar");
  const hero = document.querySelector(".hero");
  const reserveSection = document.getElementById("reserve");
  if (!bar || !hero) return;

  const heroObserver = new IntersectionObserver(
    (entries) => {
      const heroVisible = entries[0].isIntersecting;
      bar.classList.toggle("is-visible", !heroVisible);
      bar.setAttribute("aria-hidden", String(heroVisible));
    },
    { threshold: 0 }
  );
  heroObserver.observe(hero);

  if (reserveSection) {
    const reserveObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          bar.classList.remove("is-visible");
          bar.setAttribute("aria-hidden", "true");
        }
      },
      { threshold: 0.4 }
    );
    reserveObserver.observe(reserveSection);
  }
}

/* ---------------------------------------------------------
   Back to top
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("is-visible", window.scrollY > 500), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------------------------------------------------------
   Reservation form — client-side validation + friendly
   inline status. Wire the fetch() call to a real booking
   endpoint per client.
--------------------------------------------------------- */
function initReserveForm() {
  const form = document.getElementById("reserveForm");
  const status = document.getElementById("reserveStatus");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const date = form.date.value;
    const time = form.time.value;
    const phone = form.phone.value.trim();

    if (!name || !date || !time || !phone) {
      status.textContent = "Please fill in your name, date, time and phone number.";
      status.style.color = "#a3402f";
      return;
    }

    status.style.color = "";
    status.textContent = `Thanks, ${name.split(" ")[0]} — we'll confirm your table for ${date} at ${time} shortly.`;
    form.reset();
  });
}

/* ---------------------------------------------------------
   Footer newsletter form — placeholder success state
--------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newsletterEmail");
    input.value = "";
    input.placeholder = "You're on the list ✓";
  });
}