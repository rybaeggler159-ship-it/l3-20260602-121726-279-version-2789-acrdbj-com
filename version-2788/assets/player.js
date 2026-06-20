(function () {
  var box = document.querySelector('[data-video-player]');
  if (!box) {
    return;
  }

  var video = box.querySelector('video');
  var button = box.querySelector('[data-play-button]');
  var message = box.querySelector('[data-player-message]');
  var src = box.getAttribute('data-src');
  var isReady = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  function attachSource() {
    if (isReady) {
      return Promise.resolve();
    }

    isReady = true;
    setMessage('正在加载播放源...');

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        setMessage('播放源已加载，可正常播放。');
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage('播放源加载失败，请稍后重试或检查网络。');
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          }
        }
      });
      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      setMessage('播放源已加载，可正常播放。');
      return Promise.resolve();
    }

    setMessage('当前浏览器不支持 HLS 播放，请更换浏览器。');
    return Promise.reject(new Error('HLS is not supported'));
  }

  function playVideo() {
    attachSource().then(function () {
      return video.play();
    }).then(function () {
      box.classList.add('playing');
      video.setAttribute('controls', 'controls');
      setMessage('正在播放。');
    }).catch(function () {
      setMessage('请再次点击播放，或检查浏览器自动播放设置。');
    });
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });
})();
