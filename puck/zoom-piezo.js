var speed = 50;
var interval = null;
var heman = 'ee  ee  ee  C#C#C#C#   C#C#  C#C#  AA  AA  AA  AA  ee  ee  ee  dddddd  c#c#  c#c#c#c#    dd  dd  C#C#  BBBB    dd  dd  dddd   C#C#C#C#   BBBBB  BB  C#C#C# AAAAAA     AA  f#f#  AA  f#f#  AA  AAAAA  AA  BBBB   BBB  C#C#C#C#   AAAAA';
var tune = heman;

function freq(f) { 
  if (!f) digitalWrite(A0,0);
  else analogWrite(A0, 0.5, { freq: f } );
}

var pitches = {
  'a':220.00,
  'a#':233.08,
  'b':246.94,
  'c':261.63,
  'c#':277.18,
  'd':293.66,
  'd#':311.13,
  'e':329.63,
  'f':349.23,
  'f#':369.99,
  'g':392.00,
  'g#':415.30,
  'A':440.00,
  'A#':466.16,
  'B':493.88,
  'C':523.25,
  'C#':554.37,
  'D':587.33,
  'D#':622.25,
  'E':659.26,
  'F':698.46,
  'F#':739.99,
  'G':783.99,
  'G#':830.61
};

function step() {
  var ch = tune[pos];
  if (ch !== undefined) {
    pos++;
    if (tune[pos] === '#') {
      ch = ch+'#';
      pos++;
    }
    freq(pitches[ch]);
  } else {
    freq(0);
    stop();
  }
}

function stop() {
  clearInterval(interval);
  interval = null;
  pos = 0;
}

function play() {
  stop();
  interval = setInterval(step, speed);
}