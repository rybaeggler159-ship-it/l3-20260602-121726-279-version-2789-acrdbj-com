(function () {
  var input = document.querySelector('[data-search-input]');
  var category = document.querySelector('[data-search-category]');
  var button = document.querySelector('[data-search-button]');
  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');
  var movies = window.MOVIE_SEARCH_DATA || [];

  function getQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a class="poster-wrap" href="' + escapeHtml(movie.url) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.closest(\'.poster-wrap\').classList.add(\'image-missing\'); this.remove();">',
      '    <span class="poster-play">播放</span>',
      '  </a>',
      '  <div class="movie-info">',
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function runSearch() {
    var kw = (input.value || '').trim().toLowerCase();
    var cat = category.value || '';
    var found = movies.filter(function (movie) {
      var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, (movie.tags || []).join(' '), movie.oneLine].join(' ').toLowerCase();
      var matchKeyword = !kw || haystack.indexOf(kw) !== -1;
      var matchCategory = !cat || movie.categorySlug === cat;
      return matchKeyword && matchCategory;
    }).slice(0, 240);

    results.innerHTML = found.map(movieCard).join('');
    summary.textContent = '找到 ' + found.length + ' 条结果' + (found.length >= 240 ? '，已显示前 240 条。' : '。');
  }

  if (input) {
    input.value = getQueryFromUrl();
    input.addEventListener('input', runSearch);
  }
  if (category) {
    category.addEventListener('change', runSearch);
  }
  if (button) {
    button.addEventListener('click', runSearch);
  }
  runSearch();
})();
