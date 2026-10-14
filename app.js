(() => {
  'use strict';
  const destination = 'https://scau.edu.cn/';
  const seconds = document.querySelector('#seconds');
  const progress = document.querySelector('#progress');
  const note = document.querySelector('#countdown-note');
  const preview = new URLSearchParams(window.location.search).get('preview') === '1';
  const background = document.querySelector('#background-clear');
  const countdownDuration = 5000;
  let deadline, timer, navigated = false;

  // The embedded preview stays visible if the clear background is slow or fails.
  function revealBackground() {
    if (background.naturalWidth > 0) background.classList.add('is-loaded');
  }
  if (background.complete) revealBackground();
  else background.addEventListener('load', revealBackground, { once: true });
  function tick() {
    if (navigated) return;
    const remaining = Math.max(0, deadline - performance.now());
    const value = String(Math.ceil(remaining / 1000));
    if (seconds.textContent !== value) seconds.textContent = value;
    progress.style.transform = `scaleX(${remaining / countdownDuration})`;
    if (remaining === 0) {
      navigated = true; clearInterval(timer);
      document.body.dataset.phase = 'redirecting';
      note.textContent = '正在进入华南农业大学官网……';
      window.location.replace(destination);
    }
  }
  function startCountdown() {
    document.body.dataset.phase = 'counting';
    note.textContent = '倒计时结束后自动进入官网';
    deadline = performance.now() + countdownDuration;
    timer = setInterval(tick, 100); tick();
    document.addEventListener('visibilitychange', tick);
  }
  // Two animation frames allow a visible frame before the one-second delay.
  // Countdown startup is independent of all image downloads and window.load.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (preview) {
        document.body.dataset.phase = 'preview';
        note.textContent = '页面预览 · 自动跳转已暂停';
        return;
      }
      setTimeout(startCountdown, 1000);
    });
  });
})();
