(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    const prev = document.querySelector(".hero-prev");
    const next = document.querySelector(".hero-next");
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
        if (!slides.length) {
            return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }

    function play() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
            play();
        });
    });

    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(index - 1);
            play();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(index + 1);
            play();
        });
    }

    showSlide(0);
    play();

    const searchInputs = Array.from(document.querySelectorAll(".movie-search"));

    searchInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            const q = input.value.trim().toLowerCase();
            const cards = Array.from(document.querySelectorAll(".movie-card, .rank-item"));

            cards.forEach(function (card) {
                const text = card.textContent.toLowerCase() + " " + Array.from(card.attributes).map(function (attr) {
                    return attr.value;
                }).join(" ").toLowerCase();
                card.classList.toggle("is-hidden", q !== "" && text.indexOf(q) === -1);
            });
        });
    });
}());
