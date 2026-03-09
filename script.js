/* ==========================================
   JIVY JUICE — Vertical Theater Experience
   ========================================== */
(function () {
  "use strict";

  /* ---------- Lenis Smooth Scroll ---------- */
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Custom Cursor ---------- */
  const cursor = document.getElementById("cursor");
  let cx = 0, cy = 0, mx = 0, my = 0;

  if (cursor && window.innerWidth > 640) {
    document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      gsap.set(cursor, { x: cx, y: cy });
    });
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  /* ---------- Nav auto-hide ---------- */
  const nav = document.getElementById("nav");
  let lastScroll = 0;
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      if (y > 80) nav.classList.toggle("hide", y > lastScroll && y > 250);
      else nav.classList.remove("hide");
      lastScroll = y;
    },
  });

  /* ---------- Mobile burger ---------- */
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  if (burger) burger.addEventListener("click", () => navLinks.classList.toggle("open"));

  /* ---------- Hero entrance ---------- */
  const htl = gsap.timeline({ defaults: { ease: "power4.out" } });
  htl
    .to(".hero-eyebrow", { opacity: 1, duration: 0.7, delay: 0.2 })
    .to(".h1-word", { y: 0, duration: 1.0, stagger: 0.1 }, "<0.15")
    .to(".hero-sub", { opacity: 1, duration: 0.7 }, "-=0.3")
    .to(".hero-actions", { opacity: 1, duration: 0.7 }, "-=0.3")
    .to(".hero-img", { opacity: 1, y: 0, rotate: 0, stagger: 0.12, duration: 0.9, ease: "back.out(1.4)" }, "-=0.8")
    .to(".hero-scrolldown", { opacity: 0.6, duration: 0.5 }, "-=0.3");

  /* Hero images — staggered start positions */
  gsap.set(".hero-img", { opacity: 0, y: 60, rotate: () => gsap.utils.random(-8, 8) });

  /* Hero parallax on scroll */
  gsap.to(".hero-stack", {
    y: -80,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
  });

  /* ---------- Background color shift per juice ---------- */
  const bgLayer = document.getElementById("bgColor");
  document.querySelectorAll(".jcard").forEach((card) => {
    const bg = card.dataset.bg;
    if (!bg) return;
    ScrollTrigger.create({
      trigger: card,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => { bgLayer.style.background = bg; },
      onEnterBack: () => { bgLayer.style.background = bg; },
    });
  });
  // Reset to default when above theater
  ScrollTrigger.create({
    trigger: ".theater",
    start: "top 60%",
    onLeaveBack: () => { bgLayer.style.background = "var(--bg)"; },
  });
  // Reset after theater
  ScrollTrigger.create({
    trigger: ".story",
    start: "top 60%",
    onEnter: () => { bgLayer.style.background = "var(--bg)"; },
    onLeaveBack: () => {
      const last = document.querySelector(".jcard:last-child");
      if (last) bgLayer.style.background = last.dataset.bg;
    },
  });

  /* ---------- Juice card reveals — each variant different ---------- */
  document.querySelectorAll(".jcard").forEach((card) => {
    const img = card.querySelector(".jcard-img");
    const body = card.querySelector(".jcard-body");
    const isRight = card.classList.contains("jcard--right");
    const isWide = card.classList.contains("jcard--wide");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        end: "top 30%",
        scrub: 0.6,
      },
    });

    tl.from(img, {
      x: isRight ? 80 : isWide ? 0 : -80,
      y: isWide ? 40 : 0,
      opacity: 0,
      scale: 0.92,
      duration: 1,
    });
    tl.from(
      body,
      {
        x: isRight ? -60 : isWide ? 0 : 60,
        y: isWide ? 30 : 0,
        opacity: 0,
        duration: 1,
      },
      "<0.15"
    );
  });

  /* ---------- Juice image parallax ---------- */
  document.querySelectorAll(".jcard-img img").forEach((img) => {
    gsap.to(img, {
      y: -30,
      ease: "none",
      scrollTrigger: { trigger: img.closest(".jcard"), start: "top bottom", end: "bottom top", scrub: 1.2 },
    });
  });

  /* ---------- Stats counter ---------- */
  document.querySelectorAll(".sn-val").forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, { innerText: target, duration: 1.6, snap: { innerText: 1 }, ease: "power2.out" });
      },
    });
  });

  /* ---------- Story + perks reveals ---------- */
  gsap.from(".story-split", {
    y: 50, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".story-split", start: "top 82%" },
  });
  gsap.from(".perk", {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: ".perks", start: "top 85%" },
  });

  /* ---------- CTA punch-in ---------- */
  gsap.from(".cta", {
    scale: 0.94, borderRadius: "30px",
    scrollTrigger: { trigger: ".cta", start: "top 92%", end: "top 40%", scrub: 1 },
  });

  /* ---------- Refresh on resize ---------- */
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
})();