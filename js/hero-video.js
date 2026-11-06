(() => {
  'use strict';
  const video = document.querySelector('.cinema-video');
  if (!video) return;
  const hero = video.closest('.cinema-hero');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let ready = false, failed = false, scheduled = false;
  let frameCallback = null;
  let revealAttempt = 0;
  const constrained = () => connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '') || (connection?.downlink > 0 && connection.downlink < 1.5);
  const visible = () => { const r = hero.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const allowed = () => ready && !failed && !motion.matches && !constrained() && !document.hidden && visible();
  const conceal = () => {
    revealAttempt++;
    if (frameCallback !== null) video.cancelVideoFrameCallback?.(frameCallback);
    frameCallback = null;
    video.classList.remove('is-playing');
    video.pause();
  };
  const unload = () => { conceal(); if (video.hasAttribute('src')) { video.removeAttribute('src'); video.load(); } };
  const play = () => {
    if (!allowed()) return;
    video.muted = true; video.defaultMuted = true; video.volume = 0;
    if (!video.hasAttribute('src')) video.src = innerWidth <= 700 ? video.dataset.mobileSrc : video.dataset.desktopSrc;
    video.play().catch(() => { failed = true; unload(); });
  };
  const schedule = () => {
    if (!allowed() || scheduled) return;
    scheduled = true;
    const run = () => { scheduled = false; play(); };
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 2000 }); else setTimeout(run, 100);
  };
  video.addEventListener('playing', () => {
    if (!allowed()) { conceal(); return; }
    const attempt = ++revealAttempt;
    const reveal = () => {
      frameCallback = null;
      if (attempt !== revealAttempt || !allowed() || video.paused || video.readyState < 2 || !video.videoWidth) return;
      video.classList.add('is-playing');
    };
    // Only reveal after a decoded frame is submitted to the compositor.
    if ('requestVideoFrameCallback' in video) frameCallback = video.requestVideoFrameCallback(reveal);
    else requestAnimationFrame(() => requestAnimationFrame(reveal));
  });
  video.addEventListener('error', () => { failed = true; unload(); });
  // Keep the last decoded frame on buffering; do not flash back to the photo.
  video.addEventListener('waiting', () => { revealAttempt++; });
  const update = () => {
    if (motion.matches || constrained()) unload();
    else if (document.hidden || !visible()) conceal();
    else schedule();
  };
  motion.addEventListener('change', update);
  connection?.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) new IntersectionObserver(update).observe(hero);
  else window.addEventListener('scroll', update, { passive: true });
  const init = () => Promise.resolve(window.encantoEntrance).then(() => { ready = true; schedule(); });
  if (document.readyState === 'complete') init(); else window.addEventListener('load', init, { once: true });
})();
