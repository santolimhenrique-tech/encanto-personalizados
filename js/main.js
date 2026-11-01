(() => {
  'use strict';
  const config = window.ENCANTO_CONFIG || {};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  // No hidden resting state: missing JS/animation support leaves all content readable.
  const enter = (element, delay = 0, photo = false, duration = 600) => {
    if (reducedMotion.matches || !element?.animate) return;
    const animation = element.animate([
      { opacity: .15, transform: photo ? 'scale(.97)' : 'translateY(16px)' },
      { opacity: 1, transform: photo ? 'scale(1)' : 'translateY(0)' }
    ], { duration, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    activeAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
  };
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) activeAnimations.forEach(animation => animation.cancel());
  });
  const categories = config.categories || {};
  const productNames = config.productNames || categories;
  const $ = (selector) => document.querySelector(selector);
  const phone = String(config.whatsapp || '').trim();
  const hasPhone = /^[1-9]\d{7,14}$/.test(phone);
  const message = config.message || 'Olá! Gostaria de um orçamento de produtos personalizados.';
  const makeMessage = (category = '') => [message, productNames[category] ? `Tenho interesse em ${productNames[category]}.` : ''].filter(Boolean).join('\n\n');
  const whatsappUrl = (text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  const nav = $('#navigation');
  const toggle = $('.menu-toggle');
  const mobile = matchMedia('(max-width: 700px)');
  const setMenu = (open) => { toggle.setAttribute('aria-expanded', String(open)); toggle.lastElementChild.textContent = open ? '−' : '+'; nav.classList.toggle('is-collapsed', mobile.matches && !open); };
  toggle.hidden = false;
  setMenu(false);
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  mobile.addEventListener('change', () => setMenu(false));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
  document.addEventListener('click', (event) => { if (mobile.matches && !event.target.closest('.header')) setMenu(false); });

  document.querySelectorAll('[data-order]').forEach((link) => {
    if (!hasPhone) return; // Preserva o destino HTML caso a configuração seja invalidada.
    link.href = whatsappUrl(makeMessage(link.dataset.order));
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  const themeToggle = $('.theme-toggle');
  if (themeToggle && window.EncantoTheme) {
    themeToggle.hidden = false;
    themeToggle.addEventListener('click', () => window.EncantoTheme.toggle());
    window.EncantoTheme.syncControl();
  }
  try { const social = new URL(config.instagram); if (social.protocol === 'https:' && ['instagram.com', 'www.instagram.com'].includes(social.hostname)) { document.querySelectorAll('[data-instagram]').forEach((link) => { link.href = social.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; }); } } catch { /* Perfil não fornecido: não mostrar link. */ }
  $('#year').textContent = new Date().getFullYear();

  const picker = $('.category-picker');
  const collections = [...document.querySelectorAll('.collection')];
  const options = { all: 'Todos os produtos', ...categories };
  Object.entries(options).forEach(([key, label]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = label; button.dataset.filter = key; button.setAttribute('aria-pressed', String(key === 'all'));
    button.addEventListener('click', () => {
      picker.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      activeAnimations.forEach(animation => { if (collections.includes(animation.effect?.target)) animation.cancel(); });
      collections.forEach((item) => { item.hidden = key !== 'all' && item.dataset.category !== key; });
      collections.filter(item => !item.hidden).forEach((item, index) => enter(item, index * 70, false, 400));
      $('.collection-status').textContent = key === 'all' ? 'Todas as possibilidades de personalização.' : `Exibindo: ${label}.`;
    });
    picker.append(button);
  });
  picker.hidden = false;
  // Imagens só entram na página quando existem dados reais e o arquivo carrega.
  let loadedProducts = 0;
  const loadImage = (asset, onLoad) => {
    if (!asset?.src || !asset.alt || !(asset.width > 0 && asset.height > 0)) return;
    const img = new Image(); img.alt = asset.alt; img.width = asset.width; img.height = asset.height; img.decoding = 'async';
    img.addEventListener('load', () => onLoad(img), { once: true });
    if (asset.srcset) { img.srcset = asset.srcset; img.sizes = asset.sizes || '(max-width: 700px) 90vw, 45vw'; }
    img.src = asset.src;
  };
  const loadProduct = (item) => {
    if (!item.querySelector('.collection-art')) return;
    loadImage(config.images?.[item.dataset.category], (img) => {
    const figure = document.createElement('figure'); figure.append(img); item.querySelector('.collection-art').replaceWith(figure);
    loadedProducts++; if (loadedProducts === collections.length) $('.asset-note').hidden = true;
    });
  };
  const loadOwner = () => loadImage(config.ownerImage, (img) => { img.className = 'about-photo'; $('.brand-letter').replaceWith(img); });
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.matches('.collection')) loadProduct(entry.target); else loadOwner();
      imageObserver.unobserve(entry.target);
    }), { rootMargin: '300px' });
    collections.forEach((item) => imageObserver.observe(item));
    imageObserver.observe($('.brand-letter'));
  } else { collections.forEach(loadProduct); loadOwner(); }
  if (config.about?.approved && Array.isArray(config.about.paragraphs) && config.about.paragraphs.length) {
    const container = $('.about-copy'); container.querySelectorAll('p').forEach((p) => p.remove());
    config.about.paragraphs.forEach((text) => { const p = document.createElement('p'); p.textContent = text; container.append(p); });
  }
  Promise.resolve(window.encantoEntrance).then(() => {
    if (reducedMotion.matches) return;
    const photo = $('.cinema-photo');
    if (photo?.animate) {
      const animation = photo.animate([{ opacity: .4, transform: 'scale(1.05)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
      activeAnimations.add(animation);
      animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
    }
    enter($('#hero-title'), 200, false, 550);
    enter($('.cinema-description'), 500, false, 500);
    document.querySelectorAll('.cinema-actions > a').forEach((el, index) => enter(el, 600 + index * 70, false, 500));
    enter($('.cinema-scroll'), 1100, false, 400);
  });
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (!entry.target.hidden) {
          entry.target.style.setProperty('--reveal-delay', `${Math.min(stagger++ * 80, 160)}ms`);
          entry.target.classList.add('scroll-reveal');
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.hero-copy,.hero-photo,.section-heading,.collection,.product-film,.how-grid > div,.steps,.brand-letter,.about-copy,.order-grid,.faq > div,.location').forEach(el => observer.observe(el));
    // Keyboard focus must never wait for a reveal animation.
    document.addEventListener('focusin', event => activeAnimations.forEach(animation => {
      const target = animation.effect?.target;
      if (target?.contains(event.target)) animation.cancel();
    }));
  }
})();
