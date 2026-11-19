/* requestbaby — back-to-top button (the only script on the site) */
(function () {
  var toTop = document.querySelector('.to-top');
  if (!toTop) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var toggle = function () {
    toTop.classList.toggle('show', window.scrollY > window.innerHeight * 1.2);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
})();
