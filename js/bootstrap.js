(() => {
  'use strict';

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

  async function boot() {
    for (const source of assets) {
      try {
        await loadScript(source);
      } catch (error) {
        console.error(`Could not load ${source}.`, error);
      }
    }
  }

  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(() => window.setTimeout(boot, 0));
  } else {
    window.setTimeout(boot, 0);
  }
})();
