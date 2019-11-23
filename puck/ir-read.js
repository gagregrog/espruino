// read IR codes from remotes
// run in the Web IDE
// Send the code to the puck, then press the button you want to read
// The results will be printed to the console and you can copy the sequence

digitalWrite(D2,0);
pinMode(D1, "input_pullup");
var d = [];

setWatch(function(e) {
  if (!d.length) {
    setTimeout(() => {
      d.shift();
      console.log(d.toString());
      d = [];
    }, 1000);
  }

  d.push((1000*(e.time - e.lastTime)).toFixed(1));
}, D1, {edge:"both",repeat:true});
