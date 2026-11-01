/* Early, independent bootstrap: storage failures never block the page. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let firstVisit = !motion.matches;
  try {
    firstVisit = firstVisit && sessionStorage.getItem('encanto-intro') !== 'seen';
    sessionStorage.setItem('encanto-intro', 'seen');
  } catch { /* Unavailable storage: bounded opening on this navigation. */ }
  window.encantoEntrance = new Promise(resolve => {
    if (!firstVisit) { resolve(); return; }
    document.documentElement.classList.add('intro-active');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.documentElement.classList.remove('intro-active');
      resolve();
    };
    setTimeout(finish, 1400);
    motion.addEventListener('change', () => { if (motion.matches) finish(); });
    document.addEventListener('keydown', finish, { once: true });
    document.addEventListener('pointerdown', finish, { once: true });
  });
})();
