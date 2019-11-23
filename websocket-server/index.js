const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Listening for connections...');

wss.on('connection', function connection(ws) {
  console.log('Client connected!');
  
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
