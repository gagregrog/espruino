var presses = 0;
NRF.setAdvertising({},{manufacturer: 0x0590, manufacturerData:[presses]});

setWatch(function() {
  presses++;
  digitalPulse(LED2, 1, 150);
  NRF.setAdvertising({},{manufacturer: 0x0590, manufacturerData:[presses]});
}, BTN, {edge:"rising", repeat:1, debounce:20});
