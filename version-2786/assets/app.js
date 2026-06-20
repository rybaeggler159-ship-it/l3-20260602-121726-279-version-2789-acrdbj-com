(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === activeSlide);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5600);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

  searchInputs.forEach(function (input) {
    var scopeSelector = input.getAttribute('data-search-input');
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    var empty = document.querySelector(input.getAttribute('data-empty') || '');

    if (!scope) {
      return;
    }

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var shown = 0;

      cards.forEach(function (card) {
        var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        var matched = !q || text.indexOf(q) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          shown += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.player-panel')).forEach(function (panel) {
    var video = panel.querySelector('video');
    var button = panel.querySelector('.play-button');
    var url = panel.getAttribute('data-play');
    var loaded = false;
    var hlsPlayer = null;

    function attach() {
      if (!video || !url || loaded) {
        return;
      }

      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsPlayer = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsPlayer.loadSource(url);
        hlsPlayer.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function start(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      attach();
      panel.classList.add('is-playing');
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          panel.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });

      video.addEventListener('play', function () {
        panel.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        panel.classList.remove('is-playing');
      });

      window.addEventListener('pagehide', function () {
        if (hlsPlayer) {
          hlsPlayer.destroy();
        }
      });
    }
  });
})();
