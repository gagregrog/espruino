// SETUP
// IR Receiver
//   Put Pin One (data) in B4
//   Put Pin Two (ground) in B3 (we will set this pin to ground manually)
//   Put Pin Three (power) in 3.3v
//   With the ir receiver in place as described, the round part should be facing the board

var transmitting = false;
var rxDATA = B4;
var rxGROUND = B3;

var signal = [];
var lastSignal = [];
var lastLegth = 0;

function rxIR(e) {
  if (transmitting) {
    return;
  }

  signal.push((1000*(e.time - e.lastTime)).toFixed(1));
}

function printSignal() {
  if (signal.length && signal.length == lastLength) {
    signal.shift();
    var signalString = `[${signal.toString()}]`;
    console.log('Signal:\n\n' + signalString);
    lastSignal = JSON.parse(signalString);
    signal = [];
  }
  lastLength = signal.length;
}

digitalWrite(rxGROUND, 0);
pinMode(rxDATA, "input_pullup");

// SETUP
// IR Transmitter
//   Put the short leg (cathode) into A5
//   Put the long leg (anode) into A6

var IR_ANODE = A6;
var IR_CATHODE = A5;

// SETUP
// LED
//   Put the short lef (cathode) into B5
//   Put the long leg (anode) into B6

var LED_ANODE = B6;
var LED_CATHODE = B5;
var RED = LED1;
var GREEN = LED2;
var LED = LED_ANODE;
analogWrite(LED_CATHODE, 0);
digitalWrite(LED, 0);

var pulseTimes = [250, 250, 250, 250, 250, 250, 250, 250, 250];
var pulseTime = (pulseTimes.length + 2) * 250;

// flash a pin and return to its previous state
function pulse(pin) {
  var state = digitalRead(pin);
  digitalPulse(pin, 1, pulseTimes);
  setTimeout(() => {
    digitalWrite(pin, state);
  }, pulseTime);
}

function txIR(code) {
  transmitting = true;
  analogWrite(IR_CATHODE, 0.9, { freq: 38000 });
  digitalPulse(IR_ANODE, 1, code);
  digitalPulse(IR_ANODE, 1, 0);
  // digitalRead(IR_CATHODE);
  pulse(LED);
  setTimeout(() => {
    transmitting = false;
  }, code.reduce((a,b) => a+b, 0) + 1500);
}


var playPause = [9.0,4.4,0.6,0.5,0.6,0.5,0.6,0.6,0.6,1.6,0.6,1.7,0.6,1.6,0.6,0.5,0.6,0.6,0.6,1.6,0.6,1.7,0.6,1.6,0.6,0.5,0.6,0.6,0.6,0.5,0.6,1.7,0.6,1.6,0.6,0.5,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.7,0.6,1.6,0.6,0.5,0.6,1.6,0.6,0.5,0.6,1.7,0.6,0.5,0.6,1.7,0.6,39.7,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6,95.8,9.0,2.2,0.6];


setWatch(rxIR, rxDATA, {edge:"both",repeat:true});
setInterval(printSignal, 200);

function onInit() {
  lastLength = 0;
  lastSignal = [];
  signal = [];
  transmitting = false;
  analogWrite(LED_CATHODE, 0);
  digitalWrite(LED, 0);
}
