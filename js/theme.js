// Carregado antes do CSS: aplica o tema escolhido antes da primeira pintura.
(() => {
  'use strict';
  const key = 'encanto-theme';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem(key); } catch { /* Armazenamento pode estar bloqueado. */ }
  if (!['light', 'dark'].includes(saved)) saved = null;

  const syncControl = () => {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
    button.setAttribute('aria-pressed', String(dark));
    button.title = dark ? 'Ativar tema claro' : 'Ativar tema escuro';
  };
  const apply = (theme) => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#251B21' : '#FFF9F4');
    syncControl();
  };
  apply(saved || (preference.matches ? 'dark' : 'light'));
  window.EncantoTheme = {
    syncControl,
    toggle() {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(saved);
      try { localStorage.setItem(key, saved); } catch { /* A alternância continua funcionando nesta visita. */ }
    }
  };
  preference.addEventListener('change', (event) => {
    if (!saved) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    saved = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
    apply(saved || (preference.matches ? 'dark' : 'light'));
  });
})();
