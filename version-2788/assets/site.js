(function () {
  var menuButton = document.querySelector('[data-mobile-menu]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  if (filterPanel) {
    var keyword = filterPanel.querySelector('[data-filter-keyword]');
    var year = filterPanel.querySelector('[data-filter-year]');
    var genre = filterPanel.querySelector('[data-filter-genre]');
    var list = document.querySelector('[data-filter-list]');
    var empty = document.querySelector('[data-filter-empty]');
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];

    function runFilter() {
      var kw = (keyword.value || '').trim().toLowerCase();
      var y = year.value || '';
      var g = genre.value || '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.region
        ].join(' ').toLowerCase();
        var matchKeyword = !kw || haystack.indexOf(kw) !== -1;
        var matchYear = !y || card.dataset.year === y;
        var matchGenre = !g || (card.dataset.genre || '').indexOf(g) !== -1;
        var ok = matchKeyword && matchYear && matchGenre;
        card.hidden = !ok;
        if (ok) visible += 1;
      });

      if (empty) {
        empty.hidden = visible > 0;
      }
    }

    [keyword, year, genre].forEach(function (element) {
      if (element) {
        element.addEventListener('input', runFilter);
        element.addEventListener('change', runFilter);
      }
    });
  }

  var scrollPlayer = document.querySelector('[data-scroll-player]');
  if (scrollPlayer) {
    scrollPlayer.addEventListener('click', function (event) {
      event.preventDefault();
      var box = document.querySelector('[data-video-player]');
      if (box) {
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var button = box.querySelector('[data-play-button]');
        if (button) {
          button.focus();
        }
      }
    });
  }
})();
