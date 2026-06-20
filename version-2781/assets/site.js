(function () {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            const isOpen = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    const filterInput = document.querySelector('.js-filter-input');
    const yearFilter = document.querySelector('.js-year-filter');
    const typeFilter = document.querySelector('.js-type-filter');
    const filterCards = Array.from(document.querySelectorAll('[data-title][data-year]'));

    function applyFilters() {
        if (!filterCards.length) {
            return;
        }

        const query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        const year = yearFilter ? yearFilter.value : '';
        const type = typeFilter ? typeFilter.value : '';

        filterCards.forEach(function (card) {
            const text = [
                card.dataset.title || '',
                card.dataset.year || '',
                card.dataset.type || '',
                card.dataset.region || ''
            ].join(' ').toLowerCase();
            const yearMatch = !year || card.dataset.year === year;
            const typeMatch = !type || (card.dataset.type || '').indexOf(type) !== -1;
            const queryMatch = !query || text.indexOf(query) !== -1;
            card.classList.toggle('is-filter-hidden', !(yearMatch && typeMatch && queryMatch));
        });
    }

    [filterInput, yearFilter, typeFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });
})();
