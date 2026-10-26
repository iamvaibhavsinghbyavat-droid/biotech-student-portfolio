/* script.js: the behaviour of your page. Everything is wrapped in comments so you can follow along. */

/* ---------- 1. SETTINGS YOU CAN CHANGE ---------- */
// To turn the contact form on, put your email between the quotes, e.g. "name@example.com".
// While it is empty, the form tells visitors that it is not available yet.
const CONTACT_EMAIL = "";

/* ---------- 2. MOBILE MENU ---------- */
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector("#nav-links");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");          // show or hide the menu
  toggle.setAttribute("aria-expanded", open);           // tells screen readers the state
});
// Close the menu after tapping a link
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- 3. HIGHLIGHT THE CURRENT SECTION IN THE MENU ---------- */
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section");

// IntersectionObserver tells us when a section is in the middle of the screen
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => observer.observe(s));

/* ---------- 4. FOOTER YEAR ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 5. DNA HELIX DRAWING ---------- */
const svg = document.getElementById("helix");
const NS = "http://www.w3.org/2000/svg";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Create the SVG shapes once: two strands and a set of rungs
const strandA = document.createElementNS(NS, "polyline");
const strandB = document.createElementNS(NS, "polyline");
[strandA, strandB].forEach((s, i) => {
  s.setAttribute("fill", "none");
  s.setAttribute("stroke", i === 0 ? "#0b2a5b" : "#2f6fb5");
  s.setAttribute("stroke-width", "5");
  s.setAttribute("stroke-linecap", "round");
});
const rungs = [];
for (let y = 10; y < 360; y += 22) {
  const r = document.createElementNS(NS, "line");
  r.setAttribute("stroke", "#9db6d8");
  r.setAttribute("stroke-width", "3");
  r.dataset.y = y;
  svg.appendChild(r);
  rungs.push(r);
}
svg.append(strandA, strandB);

// Position everything for a given "phase" (how far the helix has twisted)
function drawHelix(phase) {
  const a = [], b = [];
  for (let y = 0; y <= 360; y += 6) {
    const x = 60 * Math.sin(y / 36 + phase);            // sine wave gives the twist
    a.push((100 + x).toFixed(1) + "," + y);
    b.push((100 - x).toFixed(1) + "," + y);
  }
  strandA.setAttribute("points", a.join(" "));
  strandB.setAttribute("points", b.join(" "));
  rungs.forEach((r) => {
    const y = +r.dataset.y, x = 60 * Math.sin(y / 36 + phase);
    r.setAttribute("x1", 100 + x); r.setAttribute("x2", 100 - x);
    r.setAttribute("y1", y);       r.setAttribute("y2", y);
  });
}
drawHelix(0);
// Slowly twist the helix, unless the visitor prefers reduced motion
if (!reduceMotion) {
  let phase = 0;
  (function loop() { phase += 0.012; drawHelix(phase); requestAnimationFrame(loop); })();
}

/* ---------- 6. CONTACT FORM ---------- */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();                                   // stop the page from reloading
  const name = document.getElementById("msg-name").value.trim();
  const text = document.getElementById("msg-text").value.trim();

  if (!name || !text) { status.textContent = "Please fill in your name and message."; return; }
  if (!CONTACT_EMAIL) { status.textContent = "Sorry, the email form is not available yet. Please check back soon."; return; }

  // Opens the visitor's email app with the message filled in
  const subject = encodeURIComponent("Message from " + name);
  window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + encodeURIComponent(text);
  status.textContent = "Opening your email app...";
});
