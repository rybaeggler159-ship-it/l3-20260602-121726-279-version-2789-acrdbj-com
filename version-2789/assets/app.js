(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function uniqueValues(cards, name) {
        var values = [];
        cards.forEach(function (card) {
            var value = card.getAttribute(name);
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        return values.sort();
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

    function filterCards(panel) {
        var scope = panel.closest("section") || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-card"));
        var input = panel.querySelector("[data-filter-input]");
        var region = panel.querySelector("[data-region-select]");
        var year = panel.querySelector("[data-year-select]");
        var empty = scope.querySelector("[data-empty-state]");
        var q = normalize(input && input.value);
        var regionValue = region ? region.value : "";
        var yearValue = year ? year.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search"));
            var matchText = !q || text.indexOf(q) !== -1;
            var matchRegion = !regionValue || card.getAttribute("data-region") === regionValue;
            var matchYear = !yearValue || card.getAttribute("data-year") === yearValue;
            var show = matchText && matchRegion && matchYear;
            card.style.display = show ? "" : "none";
            if (show) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    function setupFilters() {
        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var scope = panel.closest("section") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-card"));
            var input = panel.querySelector("[data-filter-input]");
            var region = panel.querySelector("[data-region-select]");
            var year = panel.querySelector("[data-year-select]");
            var reset = panel.querySelector("[data-filter-reset]");

            fillSelect(region, uniqueValues(cards, "data-region"));
            fillSelect(year, uniqueValues(cards, "data-year"));

            if (input) {
                input.addEventListener("input", function () {
                    filterCards(panel);
                });
            }
            if (region) {
                region.addEventListener("change", function () {
                    filterCards(panel);
                });
            }
            if (year) {
                year.addEventListener("change", function () {
                    filterCards(panel);
                });
            }
            if (reset) {
                reset.addEventListener("click", function () {
                    if (input) {
                        input.value = "";
                    }
                    if (region) {
                        region.value = "";
                    }
                    if (year) {
                        year.value = "";
                    }
                    filterCards(panel);
                });
            }
        });
    }

    function setupSearchQuery() {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (!q) {
            return;
        }
        document.querySelectorAll("[data-search-page] [data-filter-input]").forEach(function (input) {
            input.value = q;
            var panel = input.closest("[data-filter-panel]");
            if (panel) {
                filterCards(panel);
            }
        });
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = next % slides.length;
            if (index < 0) {
                index = slides.length - 1;
            }
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        function start() {
            stop();
            timer = setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(parseInt(dot.getAttribute("data-hero-dot"), 10));
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function setupBackTop() {
        document.querySelectorAll("[data-back-top]").forEach(function (button) {
            button.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupSearchQuery();
        setupBackTop();
    });
})();
