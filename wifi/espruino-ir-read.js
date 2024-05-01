// Put Pin One (data) in DATA
// Put Pin Two (ground) in B3 (we will set this pin to ground manually)
// Put Pin Three (power) in 3.3v
// With the ir receiver in place as described,
// the round part should be facing the board

const DATA = B4;
const GROUND = B3;

digitalWrite(GROUND, 0);
pinMode(DATA, "input_pullup");
var code = [];

setWatch(function(e) {
  if (!code.length) {
    setTimeout(() => {
      code.shift();
      console.log(code.toString());
      code = [];
    }, 1000);
  }

  d.push((1000*(e.time - e.lastTime)).toFixed(1));
}, DATA, {edge:"both",repeat:true});
