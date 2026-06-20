(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var showSlide = function (next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 6500);
    }
  }

  var params = new URLSearchParams(window.location.search);
  var queryFromUrl = params.get('q') || '';
  var panels = document.querySelectorAll('[data-filter-panel]');
  panels.forEach(function (panel) {
    var root = panel.parentElement || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));
    var inputs = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
    var queryInput = panel.querySelector('[data-filter="query"]');
    var reset = panel.querySelector('[data-filter-reset]');
    if (queryInput && queryFromUrl) {
      queryInput.value = queryFromUrl;
    }
    var normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };
    var apply = function () {
      var state = {};
      inputs.forEach(function (input) {
        state[input.getAttribute('data-filter')] = normalize(input.value);
      });
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var matched = true;
        if (state.query && haystack.indexOf(state.query) === -1) matched = false;
        if (state.region && normalize(card.getAttribute('data-region')) !== state.region) matched = false;
        if (state.year && normalize(card.getAttribute('data-year')) !== state.year) matched = false;
        if (state.category && normalize(card.getAttribute('data-category')) !== state.category) matched = false;
        card.classList.toggle('is-hidden', !matched);
      });
    };
    inputs.forEach(function (input) {
      input.addEventListener('input', apply);
      input.addEventListener('change', apply);
    });
    if (reset) {
      reset.addEventListener('click', function () {
        inputs.forEach(function (input) {
          input.value = '';
        });
        apply();
      });
    }
    apply();
  });
})();

function initMoviePlayer(src) {
  var video = document.getElementById('video-player');
  var cover = document.querySelector('[data-play-button]');
  if (!video || !src) return;
  var loaded = false;
  var load = function () {
    if (loaded) return;
    loaded = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  };
  var start = function () {
    load();
    if (cover) cover.classList.add('is-hidden');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  };
  if (cover) {
    cover.addEventListener('click', start);
  }
  video.addEventListener('click', function () {
    if (video.paused) start();
  });
  video.addEventListener('play', function () {
    if (cover) cover.classList.add('is-hidden');
  });
}
