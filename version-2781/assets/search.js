(function () {
    const input = document.querySelector('.js-site-search');
    const results = document.querySelector('.search-results');

    if (!input || !results || !Array.isArray(SEARCH_INDEX)) {
        return;
    }

    function render(items) {
        results.innerHTML = items.slice(0, 80).map(function (item) {
            return [
                '<article class="search-item">',
                '<a href="' + item.url + '"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></a>',
                '<div>',
                '<h2><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>',
                '<p>' + escapeHtml(item.summary) + '</p>',
                '<div class="card-meta"><span>' + item.year + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.genre) + '</span></div>',
                '</div>',
                '</article>'
            ].join('');
        }).join('');
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function search() {
        const query = input.value.trim().toLowerCase();

        if (!query) {
            render(SEARCH_INDEX.slice(0, 24));
            return;
        }

        const matched = SEARCH_INDEX.filter(function (item) {
            const text = [item.title, item.year, item.region, item.type, item.genre, item.category, item.summary].join(' ').toLowerCase();
            return text.indexOf(query) !== -1;
        });
        render(matched);
    }

    input.addEventListener('input', search);
    render(SEARCH_INDEX.slice(0, 24));
})();
