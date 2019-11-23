setWatch((e) => {
  let len = e.time - e.lastTime;
  if (len > 0.3) digitalPulse(LED1, 1, 150);
  else digitalPulse(LED2, 1, 150);
}, BTN, { edge: 'falling', repeat: true, debounce: 50 });
