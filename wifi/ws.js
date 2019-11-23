// For IR: Put the cathode (short leg) into A5 and the anode (long leg) into A6
// For LED: Put the cathode (short leg) into B5 and the anode (long leg) into B6
// For the IR Button (BTNX): Connect one side to 3.3V and the other to B3
// For the Socket Button (BTN_S): Connect one side to 3.3v and the other to A0

/* [BEGIN] Setup and Util --------------------------- */

// uuid unique for this board
const clientId = 'b9c8166c8204';
// identifying connection type for ws-server
const origin = 'espruino';
// identifying this instanca of the zoom button
const room = 'Team Room';
// pass idData to ws-server when identify() is called
const idData = {
  room: room,
  origin: origin,
  clientId: clientId,
};

const irCode = [4.5, 4.5, 0.5, 1.8, 0.5, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.6, 0.5, 0.5, 0.6, 0.5, 0.5, 0.6, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 1.7, 0.5, 46.9, 4.5, 4.5, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.7, 0.6, 1.6, 0.6];

const IR_ANODE = A6;
const IR_CATHODE = A5;

const LED_ANODE = B6;
const LED_CATHODE = B5;

const BTNX = B3;
const BTN_S = A0;

var wifi, ws;
let watch = null;
let watch2 = null;
let watch3 = null;
const PORT = 3000;
const HOST = '192.168.2.10';
const WIFI_NAME = 'Labs';
const WIFI_OPTIONS = { password: 'Labs12345$' };

const log = (str) => console.log(`[INFO] ${str}`);
const warn = (str) => console.log(`[WARN] ${str}`);
const err = (str) => console.log(`[ERROR] ${str}`);

const RED = LED1;
const GREEN = LED2;
const YELLOW = LED_ANODE;

const pulseTimes = [250, 250, 250, 250, 250, 250, 250, 250, 250];
const pulseTime = (pulseTimes.length + 1) * 250;

// flash a pin and return to its previous state
const pulse = (pin) => {
  const state = digitalRead(pin);
  digitalPulse(pin, 1, pulseTimes);
  setTimeout(() => {
    digitalWrite(pin, state);
  }, pulseTime);
};

// log the error and pulse red
const handleError = (e) => {
  err(e);
  pulse(RED);
};

// send an IR signal
const transmitIR = () => {
  analogWrite(IR_CATHODE, 0.9, { freq: 38000 });
  digitalPulse(IR_ANODE, 1, irCode);
  digitalPulse(IR_ANODE, 1, 0);
  digitalRead(IR_CATHODE);
  pulse(YELLOW);
};

// disconnect from webocket and shutdown WiFi
const disconnectAll = (withReset) => {
  let callback = () => { };

  // restart WiFi and connect to Socket
  if (withReset) {
    warn('__RESET__');
    callback = onInit;
  } else {
    warn('__DISCONNECT_ALL__');
  }

  try {
    if (watch) {
      clearWatch(watch);
      watch = null;
    }

    if (watch2) {
      clearWatch(watch2);
      watch2 = null;
    }

    if (watch3) {
      clearWatch(watch3);
      watch3 = null;
    }

  } catch (e) {
    err(e);
  }

  try {
    closeSocket();
  } catch (e) {
    handleError(e);
  }

  setTimeout(() => {
    if (wifi) disconnectWifi(callback);
  }, 1000);
};

// disconnect socket, kill WiFi, restart both
const resetAll = () => {
  disconnectAll(true);
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
    digitalWrite(GREEN, 0);
    handleError('__WIFI_DISCONNECTED__');
  });
};

const handleConnectWifi = (err) => {
  if (err) {
    return handleError(err);
  }

  log('__WIFI_CONNECTED__');
  announceIP();
};

const announceIP = () => {
  wifi.getIP((error, data) => {
    if (error) {
      err(error);
      info('Attempting to restart...');

      return reset();
    }

    log('IP Address: ' + data.ip);
    openSocket();
  });
};

const disconnectWifi = (cb) => {
  warn('__DISCONNECTING_WIFI__');
  wifi.disconnect(cb);
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
    digitalWrite(RED, 0);
    digitalWrite(GREEN, 1);
    identify();
  });

  ws.on('message', (msg) => {
    const obj = JSON.parse(msg);

    if (obj.type === 'IR') {
      log('__IR_BLAST__');
      transmitIR();
      // return the same msg containing the code
      ws.send(msg);
    } else {
      warn('__UNKNOWN_MESSAGE__ ' + msg);
    }
  });

  ws.on('close', () => {
    ws = null;
    digitalWrite(RED, 1);
    digitalWrite(GREEN, 0);
    warn('__SOCKET_DISCONNECTED__');
  });

  ws.on('error', (error) => {
    handleError('__SOCKET_ERROR__ ' + error);
  });
};

const closeSocket = () => {
  ws.close();
};

const toggleSocket = () => {
  if (ws) {
    closeSocket();
  } else {
    openSocket();
  }
};

const sendJSON = (obj) => {
  ws.send(JSON.stringify(obj));
};

const identify = () => {
  sendJSON({ type: 'ID', data: idData });
};

/* [END] Websocket --------------------------- */



/* [BEGIN] Initialization --------------------------- */

const onInit = () => {
  // setup external buttons and LED
  analogWrite(LED_CATHODE, 0);
  pinMode(BTNX, "input_pulldown");
  pinMode(BTN_S, "input_pulldown");

  connectWifi();

  watch = setWatch(resetAll, BTN, { edge: 'falling', repeat: true, debounce: 50 });
  watch2 = setWatch(transmitIR, BTNX, { edge: 'falling', repeat: true, debounce: 50 });
  watch3 = setWatch(toggleSocket, BTN_S, { edge: 'falling', repeat: true, debounce: 50 });
  digitalWrite(YELLOW, 0);
};

onInit();

/* [END] Initialization --------------------------- */

