const irCode = [4.5, 4.5, 0.5, 1.8, 0.5, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.6, 0.5, 0.5, 0.6, 0.5, 0.5, 0.6, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 1.7, 0.5, 46.9, 4.5, 4.5, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.7, 0.6, 1.6, 0.6];

let IP = null;
var wifi, http;
const RED = LED1;
const PORT = 8080;
const GREEN =  LED2;
let connected = false;
const WIFI_NAME = 'StellaAndOliver';
const WIFI_OPTIONS = { password: '9BzK}z)4fChj42' };
const pulse = [250, 250, 250, 250, 250, 250, 250, 250, 250];

const handleError = (e) => {
  console.log('[ERROR] ' + e);
  digitalPulse(RED, 1, pulse);
};

const handleConnect = (err) => {
  if (err) {
    return handleError(e);
  }

  console.log('[INFO] Connected to Wifi!');
  onConnect();
};

const onConnect = () => {
  connected = true;
  digitalPulse(GREEN, 1,  pulse);

  wifi.getIP((err, data) => {
    if (err) {
      return handleError(err);
    }

    IP = 'http://' + data.ip + ':' + PORT;
    startServer();
    broadcastIP();
  });
};

const startServer = () => {
  console.log('Starting http server at ' + IP);

  http.createServer((req, res) => {
    console.log('[INFO] Handling request...');
    res.writeHead(200);
    res.end('Hey There Bub!');
  }).listen(PORT);
};

const broadcastIP = () => {
  console.log('[INFO] Sending IP to AWS...');
  http
    .post(url, (res) => {
      digitalPulse(GREEN, 1, pulse);
      console.log('Response: ', res);
    })
    .on('error', handleError);
};

const makeRequest = () => {
  if (!connected) {
    return handleError('WiFi not connected.');
  }

  const url = 'http://192.168.0.7:3000';
  console.log('[INFO] Making request to ' + url);

  http
    .get(url, (res) => {
      digitalPulse(GREEN, 1, pulse);
      console.log('Response: ', res);
    })
    .on('error', handleError);
};

setWatch(makeRequest, BTN, { edge: 'rising', repeat: true, debounec: 50 });

const onInit = () => {
  wifi = require('Wifi');
  http = require('http');
  console.log('[INFO] Connecting to ' + WIFI_NAME + '...');
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, handleConnect);
};

onInit();
