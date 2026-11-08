/*  HELPERS  */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

/*  THEME TOGGLE */
const themeBtn = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

/*  MOBILE MENU  */
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});

// Close menu after clicking a link
$$(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  })
);

/*  NAVBAR SHADOW, BACK-TO-TOP BUTTON  */
const navbar = $("#navbar");
const toTop = $("#toTop");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  toTop.classList.toggle("show", window.scrollY > 500);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/*  ACTIVE NAV LINK ON SCROLL  */
const sections = $$("main section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $$(".nav-link").forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/*  TYPING EFFECT  */
const roles = ["Computer System and Network Student", "Web Developer", "Lifelong Learner"];
const typingEl = $("#typing");
let roleIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = roles[roleIndex];
  typingEl.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

/* SCROLL REVEAL, SKILL BARS & COUNTERS  */
function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 40);
}

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      $$(".fill", el).forEach((bar) => (bar.style.width = bar.dataset.width + "%"));
      $$(".num", el).forEach(animateCounter);
      obs.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/*  PROJECT FILTER  */
const filterBtns = $$(".filter");
const projects = $$(".project");

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projects.forEach((p) =>
      p.classList.toggle("hide", filter !== "all" && p.dataset.category !== filter)
    );
  })
);

/* BACKGROUND MUSIC */
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
music.volume = 0.3;   // soft volume (0 = silent, 1 = full)

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play().then(() => {
      musicBtn.classList.add("playing");
      musicBtn.textContent = "⏸";
      musicBtn.setAttribute("aria-label", "Pause music");
      musicBtn.setAttribute("aria-pressed", "true");
    }).catch(() => {});
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "🎵";
    musicBtn.setAttribute("aria-label", "Play music");
    musicBtn.setAttribute("aria-pressed", "false");
  }
});