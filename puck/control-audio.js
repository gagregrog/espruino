const controls = require('ble_hid_controls');
NRF.setServices(undefined, { hid: controls.report });

setWatch((e) => {
  let len = e.time - e.lastTime;
  if (len > 0.3) {
    digitalPulse(LED1, 1, 150);
    controls.next();
  } else {
    digitalPulse(LED2, 1, 150);
    controls.playpause();
  }
}, BTN, { edge: 'falling', repeat: true, debounce: 50 });
