(function () {
  const url = new URL(window.location.href);

  // Directory homepages are the canonical URLs used in the sitemaps.
  url.pathname = url.pathname.replace(/\/index\.html$/, '/');

  // Remove referral tracking while keeping parameters used by feedback forms.
  for (const key of Array.from(url.searchParams.keys())) {
    if (key.toLowerCase() === 'from' || /^utm_/i.test(key)) {
      url.searchParams.delete(key);
    }
  }

  if (url.href !== window.location.href) {
    window.history.replaceState(
      window.history.state,
      '',
      url.pathname + url.search + url.hash
    );
  }
})();
