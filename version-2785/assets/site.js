(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-mobile-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHeaderSearch() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";

        if (!query) {
          event.preventDefault();
          window.location.href = form.getAttribute("action") || "search.html";
        }
      });
    });
  }

  function initHeroSlider() {
    var slider = document.querySelector("[data-hero-slider]");

    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initLocalFilters() {
    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-quick-filter]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var quickFilter = "";

      function apply() {
        var query = normalize(input ? input.value : "");
        var quick = normalize(quickFilter);

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre")
          ].join(" "));
          var matchedQuery = !query || haystack.indexOf(query) !== -1;
          var matchedQuick = !quick || haystack.indexOf(quick) !== -1;

          card.classList.toggle("is-hidden-by-filter", !(matchedQuery && matchedQuick));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          quickFilter = button.getAttribute("data-quick-filter") || "";
          buttons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          apply();
        });
      });
    });
  }

  function initPlayers() {
    document.querySelectorAll(".player-wrap").forEach(function (wrap) {
      var player = wrap.querySelector("video[data-hls-src]");
      var button = wrap.querySelector("[data-player-start]");
      var status = wrap.querySelector("[data-player-status]");

      if (!player) {
        return;
      }

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      function attachSource() {
        return new Promise(function (resolve, reject) {
          var source = player.getAttribute("data-hls-src");

          if (!source) {
            reject(new Error("未找到播放源"));
            return;
          }

          if (player.dataset.hlsReady === "true") {
            resolve();
            return;
          }

          setStatus("正在初始化播放源...");

          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });

            hls.loadSource(source);
            hls.attachMedia(player);
            player._hlsInstance = hls;

            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              player.dataset.hlsReady = "true";
              setStatus("播放源已就绪。");
              resolve();
            });

            hls.on(window.Hls.Events.ERROR, function (eventName, data) {
              if (!data || !data.fatal) {
                return;
              }

              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                setStatus("网络异常，正在尝试恢复播放...");
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                setStatus("媒体解码异常，正在尝试恢复...");
                hls.recoverMediaError();
              } else {
                setStatus("无法播放当前视频源，请稍后重试。");
                reject(new Error("播放器初始化失败"));
              }
            });
          } else if (player.canPlayType("application/vnd.apple.mpegurl")) {
            player.src = source;
            player.dataset.hlsReady = "true";
            setStatus("播放源已就绪。");
            resolve();
          } else {
            setStatus("当前浏览器不支持 HLS 播放，请更换浏览器或启用 HLS 支持。");
            reject(new Error("浏览器不支持 HLS"));
          }
        });
      }

      function startPlayback() {
        attachSource()
          .then(function () {
            return player.play();
          })
          .then(function () {
            if (button) {
              button.classList.add("is-hidden");
            }
            setStatus("正在播放。");
          })
          .catch(function () {
            setStatus("播放未开始，请再次点击播放器或检查浏览器自动播放设置。");
          });
      }

      if (button) {
        button.addEventListener("click", startPlayback);
      }

      player.addEventListener("click", function () {
        if (player.dataset.hlsReady !== "true") {
          startPlayback();
        }
      });
    });
  }

  function initSearchPage() {
    var results = document.getElementById("searchResults");

    if (!results || !window.MOVIES) {
      return;
    }

    var input = document.getElementById("searchInput");
    var yearFilter = document.getElementById("yearFilter");
    var regionFilter = document.getElementById("regionFilter");
    var categoryFilter = document.getElementById("categoryFilter");
    var count = document.getElementById("searchCount");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    function uniqueValues(key) {
      var seen = {};
      return window.MOVIES.map(function (movie) {
        return movie[key];
      }).filter(function (value) {
        if (!value || seen[value]) {
          return false;
        }
        seen[value] = true;
        return true;
      }).sort(function (a, b) {
        return String(b).localeCompare(String(a), "zh-CN");
      });
    }

    function fillSelect(select, values) {
      if (!select) {
        return;
      }

      values.forEach(function (value) {
        var option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    }

    function cardTemplate(movie) {
      var tags = movie.tags.slice(0, 2).map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");

      return [
        "<a class=\"movie-card movie-card-standard\" href=\"" + movie.detail + "\">",
        "  <div class=\"poster-wrap\">",
        "    <img src=\"" + movie.poster + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
        "    <div class=\"poster-gradient\"></div>",
        "    <div class=\"poster-score\">★ " + movie.rating + "</div>",
        "    <div class=\"poster-duration\">" + escapeHtml(movie.duration) + "</div>",
        "  </div>",
        "  <div class=\"movie-card-body\">",
        "    <h3>" + escapeHtml(movie.title) + "</h3>",
        "    <p class=\"movie-meta\">" + escapeHtml(movie.year) + " · " + escapeHtml(movie.region) + "</p>",
        "    <p class=\"movie-line\">" + escapeHtml(movie.oneLine) + "</p>",
        "    <div class=\"movie-card-foot\"><span>" + Number(movie.views).toLocaleString() + "次观看</span><span class=\"tag-row\">" + tags + "</span></div>",
        "  </div>",
        "</a>"
      ].join("");
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");
    }

    function applySearch() {
      var query = normalize(input ? input.value : "");
      var year = yearFilter ? yearFilter.value : "";
      var region = regionFilter ? regionFilter.value : "";
      var category = categoryFilter ? categoryFilter.value : "";

      var matched = window.MOVIES.filter(function (movie) {
        var haystack = normalize([
          movie.title,
          movie.region,
          movie.year,
          movie.type,
          movie.genre,
          movie.tags.join(" "),
          movie.category
        ].join(" "));
        return (!query || haystack.indexOf(query) !== -1) &&
          (!year || movie.year === year) &&
          (!region || movie.region === region) &&
          (!category || movie.category === category);
      }).slice(0, 240);

      results.innerHTML = matched.map(cardTemplate).join("");

      if (count) {
        count.textContent = "显示 " + matched.length + " 条结果" + (matched.length >= 240 ? "（已限制前240条，可继续缩小条件）" : "");
      }
    }

    fillSelect(yearFilter, uniqueValues("year"));
    fillSelect(regionFilter, uniqueValues("region"));
    fillSelect(categoryFilter, uniqueValues("category"));

    if (input) {
      input.value = initialQuery;
      input.addEventListener("input", applySearch);
    }

    [yearFilter, regionFilter, categoryFilter].forEach(function (select) {
      if (select) {
        select.addEventListener("change", applySearch);
      }
    });

    applySearch();
  }

  ready(function () {
    initMobileMenu();
    initHeaderSearch();
    initHeroSlider();
    initLocalFilters();
    initPlayers();
    initSearchPage();
  });
})();
