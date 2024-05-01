// For IR: Put the cathode (short leg) into A5 and the anode (long leg) into A6
// For LED: Put the cathode (short leg) into B5 and the anode (long leg) into B6
// For the IR Button (BTNX): Connect one side to 3.3V and the other to B3
// For the Socket Button (BTN_S): Connect one side to 3.3v and the other to A0

/* [BEGIN] Setup and Util --------------------------- */

const irCode = [4.5, 4.5, 0.5, 1.8, 0.5, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.6, 0.5, 0.5, 0.6, 0.5, 0.5, 0.6, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 1.7, 0.5, 46.9, 4.5, 4.5, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.7, 0.6, 1.6, 0.6];

const IR_ANODE = A6;
const IR_CATHODE = A5;

const LED_ANODE = B6;
const LED_CATHODE = B5;

const BTNX = B3;
const BTN_S = A0;

var wifi, ws, interval;
const PORT = 80;
const HOST = 'ec2-54-209-165-4.compute-1.amazonaws.com';
const WIFI_NAME = "Labs";
const WIFI_OPTIONS = { password: 'Labs12345$' };

const log = (str) => console.log(`[INFO] ${str}`);
const warn = (str) => console.log(`[WARN] ${str}`);
const err = (str) => console.log(`[ERROR] ${str}`);

const RED = LED1;
const GREEN = LED2;
const YELLOW = LED_ANODE;

const pulseTimes = [250, 250, 250, 250, 250, 250, 250, 250, 250];
const pulseTime = (pulseTimes.length + 2) * 250;

// flash a pin and return to its previous state
const pulse = (pin) => {
  const state = digitalRead(pin);
  digitalPulse(pin, 1, pulseTimes);
  setTimeout(() => {
    digitalWrite(pin, state);
  }, pulseTime);
};

// send an IR signal
const transmitIR = () => {
  analogWrite(IR_CATHODE, 0.9, { freq: 38000 });
  digitalPulse(IR_ANODE, 1, irCode);
  digitalPulse(IR_ANODE, 1, 0);
  digitalRead(IR_CATHODE);
  pulse(YELLOW);
};

const handleClearInterval = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

/* [END] Setup and Util --------------------------- */



/* [BEGIN] WiFi --------------------------- */

const connectWifi = () => {
  wifi = require('Wifi');
  log('Connecting to ' + WIFI_NAME + '...');
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, handleConnectWifi);

  wifi.on('disconnected', () => {
    ws = null;
    wifi = null;
    digitalWrite(RED, 1);
    err('__WIFI_DISCONNECTED__');
  });
};

const handleConnectWifi = (e) => {
  handleClearInterval();

  if (e) {
    digitalWrite(RED, 1);
    return err(e);
  }

  log('__WIFI_CONNECTED__');
  digitalWrite(RED, 0);
  announceIP();
};

const announceIP = () => {
  wifi.getIP((error, data) => {
    if (error) {
      err(error);

      return;
    }

    log('IP Address: ' + data.ip);
    openSocket();
  });
};

/* [END] WiFi --------------------------- */



/* [BEGIN] Websocket --------------------------- */

const openSocket = () => {
  log('Connecting to ' + HOST + '...');

  const WebSocket = require('ws');
  ws = new WebSocket(HOST, {
    path: '/',
    port: PORT,
    protocol: 'echo-protocol',
    protocolVersion: 13,
    origin: 'Espruino',
    keepAlive: 60,
    headers: {},
  });

  ws.on('open', () => {
    log('__WEBSOCKET_CONNECTED__');
    digitalWrite(GREEN, 1);
    handleClearInterval();
    identify();
  });

  ws.on('message', (msg) => {
    const obj = JSON.parse(msg);

    if (obj.type === 'IR') {
      log('__IR_BLAST__');
      transmitIR();
    } else {
      warn('__UNKNOWN_MESSAGE__ ' + msg);
    }
  });

  ws.on('close', () => {
    ws = null;
    digitalWrite(GREEN, 0);
    err('__SOCKET_DISCONNECTED__');

    if (wifi) {
      interval = setInterval(openSocket, 60000);
    } else {
      interval = setInterval(connectWifi, 60000);
    }
  });

  ws.on('error', (error) => {
    err('__SOCKET_ERROR__ ' + error);
  });
};

const sendJSON = (obj) => {
  ws.send(JSON.stringify(obj));
};

const identify = () => {
  sendJSON({type: 'ID', data: idData});
};

/* [END] Websocket --------------------------- */



/* [BEGIN] Initialization --------------------------- */

const onInit = () => {
  ws = null;
  wifi = null;
  interval = null;
  // setup external buttons and LED
  analogWrite(LED_CATHODE, 0);
  pinMode(BTNX, "input_pulldown");
  pinMode(BTN_S, "input_pulldown");
  digitalWrite(RED, 1);
  digitalWrite(GREEN, 0);
  digitalWrite(YELLOW, 0);

  connectWifi();

  setWatch(onInit, BTN, { edge: 'rising', repeat: true, debounce: 50 });
  // setWatch(transmitIR, BTNX, { edge: 'rising', repeat: true, debounce: 50 });
  // setWatch(openSocket, BTN_S, { edge: 'rising', repeat: true, debounce: 50 });
};

/* [END] Initialization --------------------------- */
