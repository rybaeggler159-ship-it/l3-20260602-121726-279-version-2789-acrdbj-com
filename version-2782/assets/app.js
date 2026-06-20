(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  ready(function () {
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function () {
        mobilePanel.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function resetTimer() {
      if (timer) {
        clearInterval(timer);
      }
      if (slides.length > 1) {
        timer = setInterval(nextSlide, 5000);
      }
    }

    if (slides.length) {
      showSlide(0);
      resetTimer();
      var prev = document.querySelector('[data-hero-prev]');
      var next = document.querySelector('[data-hero-next]');
      if (prev) {
        prev.addEventListener('click', function () {
          showSlide(current - 1);
          resetTimer();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          showSlide(current + 1);
          resetTimer();
        });
      }
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          showSlide(index);
          resetTimer();
        });
      });
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterSelect = document.querySelector('[data-filter-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var noResult = document.querySelector('[data-no-result]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      if (!cards.length) {
        return;
      }
      var keyword = normalize(filterInput ? filterInput.value : '');
      var category = normalize(filterSelect ? filterSelect.value : '');
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-filter-text'));
        var group = normalize(card.getAttribute('data-filter-category'));
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedCategory = !category || group === category;
        var matched = matchedKeyword && matchedCategory;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (noResult) {
        noResult.style.display = visible ? 'none' : 'block';
      }
    }

    if (filterInput || filterSelect) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query && filterInput && !filterInput.value) {
        filterInput.value = query;
      }
      if (filterInput) {
        filterInput.addEventListener('input', applyFilters);
      }
      if (filterSelect) {
        filterSelect.addEventListener('change', applyFilters);
      }
      applyFilters();
    }
  });
})();
