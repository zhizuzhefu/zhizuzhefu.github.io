(function () {
  var MEASUREMENT_ID = 'G-7BY6N347TX';
  var PORTALS = {
    audiotools: true,
    channo: true,
    docstospeech: true,
    heartease: true,
    requestbaby: true,
    shellcove: true,
    upupfrog: true,
    zouqi: true
  };

  var portal = (location.pathname.split('/').filter(Boolean)[0] || '');
  if (!PORTALS[portal]) return;

  // clean-url.js removes utm_* after this script. Capture the landing URL first
  // so campaign attribution still reaches the shared property.
  var landingUrl = new URL(location.href);
  var config = {
    content_group: portal,
    app_portal: portal,
    page_location: landingUrl.href,
    send_page_view: true
  };
  var campaignFields = {
    utm_source: 'campaign_source',
    utm_medium: 'campaign_medium',
    utm_campaign: 'campaign_name',
    utm_term: 'campaign_term',
    utm_content: 'campaign_content',
    utm_id: 'campaign_id'
  };
  Object.keys(campaignFields).forEach(function (key) {
    var value = landingUrl.searchParams.get(key);
    if (value) config[campaignFields[key]] = value;
  });

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, config);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(script);
})();
