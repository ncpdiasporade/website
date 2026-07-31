(() => {
  const destination = document.documentElement.dataset.redirect;
  if (!destination) return;

  try {
    const target = new URL(destination, window.location.origin);
    if (target.origin === window.location.origin) window.location.replace(target.href);
  } catch {
    // Keep the visible fallback link when a destination cannot be validated.
  }
})();
