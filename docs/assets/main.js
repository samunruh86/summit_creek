const getAssetBase = () => {
  const scriptSrc = document.currentScript?.src || '';
  if (!scriptSrc) return 'assets/';
  const lastSlash = scriptSrc.lastIndexOf('/');
  return lastSlash === -1 ? 'assets/' : scriptSrc.slice(0, lastSlash + 1);
};

const navTemplate = (base) => `
<header class="site-header">
  <div class="container nav-container">
    <a class="brand" href="index.html">
      <img src="${base}media/logo_primary.svg" alt="Healthful home" class="brand-mark">
      <span class="brand-text">Healthful</span>
    </a>

    <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="nav-menu" id="nav-menu">
      <nav class="nav-links" aria-label="Primary">
        <a class="nav-link active" href="#home">Home</a>
        <a class="nav-link" href="#collections">Shop</a>
        <a class="nav-link" href="#about">About</a>
        <a class="nav-link" href="#blog">Blog</a>
        <a class="nav-link" href="#contact">Contact</a>
      </nav>
      <div class="nav-actions">
        <a class="button ghost small" href="#collections">Explore</a>
        <a class="button primary small" href="#products">Shop now</a>
      </div>
    </div>
  </div>
</header>
`;

const footerTemplate = (base) => `
<footer class="site-footer">
  <div class="container footer-top">
    <div>
      <a class="brand footer-brand" href="#home">
        <img src="${base}media/logo_primary.svg" alt="Healthful home" class="brand-mark">
        <span class="brand-text">Healthful</span>
      </a>
      <p>Modern, safe, and effective wellbeing products created to support calm minds and rested bodies.</p>
    </div>
    <div class="footer-newsletter">
      <p class="title">Subscribe to our newsletter</p>
      <form class="newsletter-form">
        <input type="email" name="footer-email" placeholder="Enter your email" required>
        <button class="button primary" type="submit">Subscribe</button>
      </form>
      <p class="small muted">Updates on launches, routines, and special offers. No spam.</p>
    </div>
  </div>

  <div class="container footer-links">
    <div class="footer-column">
      <p class="title">Pages</p>
      <a href="#home">Home</a>
      <a href="#collections">Shop</a>
      <a href="#about">About</a>
      <a href="#blog">Blog</a>
      <a href="#contact">Contact</a>
    </div>
    <div class="footer-column">
      <p class="title">Products</p>
      <a href="#products">Tinctures</a>
      <a href="#products">Body oils</a>
      <a href="#products">Massage</a>
      <a href="#products">Tea</a>
    </div>
    <div class="footer-column">
      <p class="title">Connect</p>
      <a href="#contact">Support</a>
      <a href="#contact">Wholesale</a>
      <a href="#contact">Careers</a>
      <a href="#contact">Instagram</a>
    </div>
  </div>

  <div class="container footer-bottom">
    <p>(c) 2024 Healthful. Built for better wellbeing.</p>
    <div class="footer-bottom-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>
</footer>
`;

const loadPartial = async (selector, path, fallback) => {
  const target = document.querySelector(selector);
  if (!target) return;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.statusText);
    const html = await res.text();
    target.innerHTML = html;
  } catch (err) {
    console.warn(`Falling back for ${path}`, err);
    target.innerHTML = typeof fallback === 'function' ? fallback() : fallback || '';
  }
};

const setupNav = () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  const setShadow = () => {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 10);
  };

  setShadow();
  window.addEventListener('scroll', setShadow);
};

const setupNewsletter = () => {
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      if (button) button.textContent = 'You are in!';
      form.classList.add('submitted');
    });
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  const assetBase = getAssetBase();
  const navPath = `${assetBase}nav.html`;
  const footerPath = `${assetBase}footer.html`;

  await Promise.all([
    loadPartial('#nav-placeholder', navPath, () => navTemplate(assetBase)),
    loadPartial('#footer-placeholder', footerPath, () => footerTemplate(assetBase)),
  ]);

  setupNav();
  setupNewsletter();
});
