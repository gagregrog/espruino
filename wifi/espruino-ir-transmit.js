// Put the cathode (short leg) into A5 and the anode (long leg) into A6

const irCode = [4.5, 4.5, 0.5, 1.8, 0.5, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.6, 0.5, 0.5, 0.6, 0.5, 0.5, 0.6, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 1.7, 0.5, 46.9, 4.5, 4.5, 0.5, 1.7, 0.6, 1.6, 0.6, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 1.7, 0.5, 1.7, 0.6, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.5, 0.5, 0.6, 0.5, 1.7, 0.5, 0.6, 0.5, 1.7, 0.6, 1.7, 0.6, 1.7, 0.5, 1.7, 0.6, 1.7, 0.6, 1.6, 0.6];

const IR_ANODE = A6;
const IR_CATHODE = A5;

const pulse = () => {
  analogWrite(IR_CATHODE, 0.9, { freq: 38000 });
  digitalPulse(IR_ANODE, 1, irCode);
  digitalPulse(IR_ANODE, 1, 0);
  digitalRead(IR_CATHODE);
};