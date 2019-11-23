var kb = require("ble_hid_keyboard");

E.on('init', () => {
  NRF.setServices(undefined, { hid : kb.report });
  NRF.setAdvertising({}, { name: 'down.js' });
});

const startDown = () => {
  console.log('SETTING');
  LED2.write(1);
  LED3.write(1);
  kb.tap(kb.KEY.DOWN, 0);
  setInterval(() => {
    kb.tap(kb.KEY.DOWN, 0);
    console.log('down!');
  }, 400);
};

const endDown = () => {
  console.log('CLEAR');
  LED2.write(0);
  LED3.write(0);
  clearInterval();
};

setWatch(startDown, BTN, {edge:"rising",repeat:true,debounce:50});

setWatch(endDown, BTN, {edge:"falling",repeat:true,debounce:50});