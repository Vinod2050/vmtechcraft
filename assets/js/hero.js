/* Hero: background video controls + live India clock */
(function () {
  'use strict';

  const video = document.querySelector('.hero-video');
  const toggle = document.querySelector('.hf-toggle');

  if (video) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setState = (paused) => {
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
      toggle.innerHTML = paused ? '<i class="bi bi-play-fill" aria-hidden="true"></i>' : '<i class="bi bi-pause-fill" aria-hidden="true"></i>';
    };

    // The video file is only downloaded when it is worth it: tablet/desktop width, no reduced-motion
    // preference, and no data-saver / 2G connection. Everyone else sees the still poster (CSS background),
    // which keeps mobile pages light. The play button still loads it on request.
    const conn = navigator.connection || {};
    const autoLoad = !reduceMotion.matches &&
      window.matchMedia('(min-width: 768px)').matches &&
      !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || '');

    const attach = () => {
      if (video.querySelector('source') || !video.dataset.src) return;
      const src = document.createElement('source');
      src.src = video.dataset.src;
      src.type = 'video/mp4';
      video.appendChild(src);
      video.load();
    };
    const start = () => {
      attach();
      const p = video.play();
      if (p && p.catch) p.catch(() => setState(true));
      setState(false);
    };

    // Fade the video in once it can play, so there is no black flash
    video.addEventListener('canplay', () => video.classList.add('is-ready'), { once: true });

    if (autoLoad) start(); else setState(true);

    if (toggle) {
      toggle.addEventListener('click', () => {
        if (video.paused) start();
        else { video.pause(); setState(true); }
      });
    }

    // Save battery: pause while the hero is off screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        const userPaused = toggle && toggle.getAttribute('aria-pressed') === 'true';
        if (entry.isIntersecting && !userPaused) video.play().catch(() => {});
        else if (!entry.isIntersecting) video.pause();
      }, { threshold: 0.05 }).observe(video);
    }
  }

  const clock = document.getElementById('ist-clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }
})();
