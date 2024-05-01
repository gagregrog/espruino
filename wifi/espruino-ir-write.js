// Put the cathode (short leg) into A5 and the anode (long leg) into A6

// For IR: Put the cathode (short leg) into A5 and the anode (long leg) into A6
// For LED: Put the cathode (short leg) into B5 and the anode (long leg) into B6

var IR_ANODE = A6;
var IR_CATHODE = A5;
var LED_ANODE = B6;
var LED_CATHODE = B5;
var RED = LED1;
var GREEN = LED2;
var YELLOW = LED_ANODE;

var pulseTimes = [250, 250, 250, 250, 250, 250, 250, 250, 250];
var pulseTime = (pulseTimes.length + 2) * 250;

var playPause = [9.1,4.4,0.6,0.5,0.6,1.6,0.6,1.6,0.6,1.6,0.6,0.5,0.6,1.6,0.6,1.6,0.6,1.6,0.6,1.6,0.6,1.6,0.6,1.6,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.5,0.6,1.6,0.6,1.6,0.6,0.5,0.6,1.6,0.6,1.6,0.6,1.6,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.6,0.6,1.6,0.6,0.5,0.6,0.5,0.6,1.6,0.6,0.5,0.6,36.1,9.0,4.4,0.6,0.5,0.6,1.6,0.6,1.6,0.6,1.6,0.6,0.5,0.6,1.6,0.6,1.6,0.6,1.6,0.6,1.6,0.6,1.6,0.6,1.6,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.5,0.6,1.6,0.6,0.5,0.6,0.5,0.6,1.6,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.5,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.6,0.6,1.6,0.6,0.5,0.6,0.5,0.6,1.6,0.6,0.6,0.6];

// flash a pin and return to its previous state
function pulse(pin) {
  var state = digitalRead(pin);
  digitalPulse(pin, 1, pulseTimes);
  setTimeout(() => {
    digitalWrite(pin, state);
  }, pulseTime);
};

function transmit(code) {
  analogWrite(IR_CATHODE, 0.9, { freq: 38000 });
  digitalPulse(IR_ANODE, 1, code);
  digitalPulse(IR_ANODE, 1, 0);
  digitalRead(IR_CATHODE);
  pulse(YELLOW);
};
