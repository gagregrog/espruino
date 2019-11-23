// use the puck to control a power point by sending Left or Right key presses.


const kb = require('ble_hid_keyboard');

E.on('init', () => {
  NRF.setAdvertising({}, { name: 'PowerPuck.js' });
  NRF.setServices(undefined, { hid: kb.report });  
});

const red = LED1;
const green = LED2;
const blue = LED3;

const sendKey = (key, colors) => () => {
  colors.forEach(color => digitalPulse(color, 1, 250));
  kb.tap(kb.KEY[key], 0);
};

const sendLeft = sendKey('LEFT', [blue, red]);
const sendRight = sendKey('RIGHT', [blue, green]);

const handleClick = (e) => {
  const time = e.time - e.lastTime;

  if (time < 0.3) sendRight();
  else sendLeft();
};

setWatch(handleClick, BTN, { edge: 'falling', repeat: true, debounce: 50 });
