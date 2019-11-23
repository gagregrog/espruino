const irCode = [4.5, 4.5, 0.5, 1.8, 0.5, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.6, 0.5, 0.5, 0.6, 0.5, 0.5, 0.6, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 1.7, 0.5, 46.9, 4.5, 4.5, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.7, 0.6, 1.6, 0.6];

E.on('init', () => {
  NRF.setAdvertising({}, { name: 'ZoomButton.js' });
});

const red = LED1;
const green = LED2;
const blue = LED3;

const colors = [blue, red];

const handleLED = (state) => {
  colors.forEach(color => digitalWrite(color, state));
};

const blastIR = () => {
  handleLED(1);
  Puck.IR(irCode);
};

const handlePress = (e) => {
  const time = e.time - e.lastTime;

  blastIR();
};

const handleRelease = () => {
  handleLED(0);
};

setWatch(handlePress, BTN, { edge: 'rising', repeat: true, debounce: 50 });
setWatch(handleRelease, BTN, { edge: 'falling', repeat: true, debounce: 50 });
