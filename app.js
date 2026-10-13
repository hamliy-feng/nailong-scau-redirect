(() => {
  'use strict';
  const destination = 'https://scau.edu.cn/';
  const seconds = document.querySelector('#seconds');
  const progress = document.querySelector('#progress');
  const note = document.querySelector('#countdown-note');
  const preview = new URLSearchParams(window.location.search).get('preview') === '1';
  let deadline, timer, started = false, navigated = false;
  function tick() {
    if (!started || navigated) return;
    const remaining = Math.max(0, deadline - performance.now());
    const value = String(Math.ceil(remaining / 1000));
    if (seconds.textContent !== value) seconds.textContent = value;
    progress.style.transform = `scaleX(${remaining / 5000})`;
    if (remaining === 0) {
      navigated = true; clearInterval(timer);
      note.textContent = '正在进入华南农业大学官网……';
      window.location.replace(destination);
    }
  }
  function start() {
    if (started) return;
    document.body.dataset.ready = 'true';
    if (preview) { note.textContent = '页面预览 · 自动跳转已暂停'; return; }
    started = true; deadline = performance.now() + 5000;
    timer = setInterval(tick, 100); tick();
    document.addEventListener('visibilitychange', tick);
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
