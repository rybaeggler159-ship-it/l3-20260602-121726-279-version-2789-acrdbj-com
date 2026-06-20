(function () {
  const menu = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (menu && mobileNav) {
    menu.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let active = 0;
    const show = function (next) {
      slides[active].classList.remove("active");
      dots[active].classList.remove("active");
      active = next;
      slides[active].classList.add("active");
      dots[active].classList.add("active");
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show((active + 1) % slides.length);
    }, 5600);
  }

  const input = document.querySelector("[data-filter-input]");
  const yearFilter = document.querySelector("[data-year-filter]");
  const sortFilter = document.querySelector("[data-sort-filter]");
  const list = document.querySelector("[data-card-list]");
  if (list) {
    const cards = Array.from(list.querySelectorAll("[data-movie-card]"));
    const original = cards.slice();
    const applyFilter = function () {
      const keyword = input ? input.value.trim().toLowerCase() : "";
      const year = yearFilter ? yearFilter.value : "";
      cards.forEach(function (card) {
        const text = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.genre, card.dataset.year].join(" ").toLowerCase();
        const matchedKeyword = !keyword || text.indexOf(keyword) > -1;
        const matchedYear = !year || card.dataset.year === year;
        card.classList.toggle("hidden", !(matchedKeyword && matchedYear));
      });
    };
    const applySort = function () {
      const value = sortFilter ? sortFilter.value : "default";
      let sorted = original.slice();
      if (value === "year") {
        sorted.sort(function (a, b) {
          return String(b.dataset.year).localeCompare(String(a.dataset.year));
        });
      }
      if (value === "title") {
        sorted.sort(function (a, b) {
          return String(a.dataset.title).localeCompare(String(b.dataset.title), "zh-Hans-CN");
        });
      }
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
      applyFilter();
    };
    if (input) input.addEventListener("input", applyFilter);
    if (yearFilter) yearFilter.addEventListener("change", applyFilter);
    if (sortFilter) sortFilter.addEventListener("change", applySort);
    applyFilter();
  }
})();

function initPlayer(src) {
  const video = document.querySelector("[data-player]");
  const layer = document.querySelector("[data-play-layer]");
  if (!video || !src) return;
  let loaded = false;
  const load = function () {
    if (loaded) return;
    loaded = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  };
  const play = function () {
    load();
    if (layer) layer.classList.add("is-hidden");
    const result = video.play();
    if (result && result.catch) result.catch(function () {});
  };
  if (layer) {
    layer.addEventListener("click", play);
  }
  video.addEventListener("click", function () {
    if (!loaded || video.paused) {
      play();
    } else {
      video.pause();
    }
  });
}
