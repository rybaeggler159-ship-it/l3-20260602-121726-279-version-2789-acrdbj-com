(function () {
  function initPlayer() {
    var root = document.querySelector('[data-player-root]');
    if (!root) {
      return;
    }

    var video = root.querySelector('[data-player-video]');
    var cover = root.querySelector('[data-player-cover]');
    var source = root.getAttribute('data-player-src');
    var attached = false;
    var hls = null;

    if (!video || !cover || !source) {
      return;
    }

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }
          hls.destroy();
          attached = false;
        });
        return;
      }

      video.src = source;
    }

    function startPlayback() {
      cover.classList.add('is-hidden');
      attachSource();
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          cover.classList.remove('is-hidden');
        });
      }
    }

    cover.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
    video.addEventListener('play', function () {
      cover.classList.add('is-hidden');
    });
  }

  if (document.readyState !== 'loading') {
    initPlayer();
  } else {
    document.addEventListener('DOMContentLoaded', initPlayer);
  }
})();
