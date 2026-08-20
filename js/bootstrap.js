(() => {
  'use strict';

  const root = document.documentElement;
  const fontStylesheet = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700;1,9..144,900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap';

  const assets = [
    'js/i18n.js?v=20260817-seo-launch',
    'js/site.js?v=20260817-seo-launch'
  ];

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function loadFonts() {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = fontStylesheet;
    document.head.append(stylesheet);
  }

  async function boot() {
    for (const source of assets) {
      try {
        await loadScript(source);
      } catch (error) {
        console.error(`Could not load ${source}.`, error);
      }
    }
  }

  root.classList.add('motion-ready');

  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(() => {
      root.classList.add('page-ready');
      loadFonts();
      window.setTimeout(boot, 0);
    });
  } else {
    root.classList.add('page-ready');
    loadFonts();
    window.setTimeout(boot, 0);
  }
})();
