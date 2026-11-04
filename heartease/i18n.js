/* Shellcove · Cloud Agent — single-path i18n (zh / en)
   Loaded synchronously in <head>, before first paint:
   1. pick language: ?lang= > localStorage > navigator default
   2. set <html data-lang> so CSS shows only the matching .lz / .le spans
   3. swap <title>, meta description and [data-zh][data-en] controls
   Manual switching persists in localStorage and updates the ?lang= param. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var STORE_KEY = 'sc-lang';

  function normalize(v) {
    return v === 'zh' || v === 'en' ? v : null;
  }

  function detect() {
    var fromUrl = normalize(new URLSearchParams(window.location.search).get('lang'));
    if (fromUrl) return fromUrl;
    var stored = null;
    try { stored = normalize(window.localStorage.getItem(STORE_KEY)); } catch (e) {}
    if (stored) return stored;
    var langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'zh'];
    for (var i = 0; i < langs.length; i++) {
      if (String(langs[i]).toLowerCase().indexOf('zh') === 0) return 'zh';
    }
    return 'en';
  }

  function applyDynamic(lang) {
    var nodes = doc.querySelectorAll('[data-zh][data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var value = el.getAttribute(lang === 'zh' ? 'data-zh' : 'data-en');
      if (!value) continue;
      if ('placeholder' in el) {
        el.setAttribute('placeholder', value);
      } else {
        el.textContent = value;
      }
    }
  }

  function apply(lang, updateUrl) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    var title = root.getAttribute(lang === 'zh' ? 'data-title-zh' : 'data-title-en');
    if (title) doc.title = title;
    var desc = root.getAttribute(lang === 'zh' ? 'data-desc-zh' : 'data-desc-en');
    if (desc) {
      var meta = doc.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', desc);
    }

    try { window.localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    if (updateUrl) {
      var u = new URL(window.location.href);
      u.searchParams.set('lang', lang);
      window.history.replaceState(window.history.state, '', u.pathname + u.search + u.hash);
    }

    applyDynamic(lang);

    var buttons = doc.querySelectorAll('.lang-switch button');
    for (var i = 0; i < buttons.length; i++) {
      var on = buttons[i].getAttribute('data-set-lang') === lang;
      buttons[i].classList.toggle('on', on);
      buttons[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  apply(detect(), false);

  doc.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang') || 'zh', false);
    setupToTop();
  });

  doc.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-set-lang]') : null;
    if (btn) apply(btn.getAttribute('data-set-lang'), true);
  });

  function setupToTop() {
    var toTop = doc.querySelector('.to-top');
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
  }
})();
