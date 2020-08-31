function OscillatorSample(context) {
  this.context = context;
  this.isPlaying = false;
  this.canvas = document.querySelector('canvas');
  this.WIDTH = 640;
  this.HEIGHT = 240;
  this.vco1coarse = 50;
  this.vco2coarse = 50;
  this.vco1fine = 0;
  this.vco2fine = 0;
  this.ar_attack = 0.5;
  this.ar_release = 0.5;
  this.portamento = 0;
}

OscillatorSample.prototype.play = function() {
  // Create some sweet sweet nodes.
  this.oscillator = this.context.createOscillator();
  this.analyser = this.context.createAnalyser();
  this.vcf = this.context.createBiquadFilter();
  this.vcf.type = "lowpass";
  this.changeCutoff(5000);
  this.vca = this.context.createGain();

  this.master = this.context.createGain();

//VCOs
  this.vco1 = this.context.createOscillator();
  this.vco2 = this.context.createOscillator();
  this.vco1.type = "sawtooth";
  this.vco2.type = "sawtooth";
  
  //this.gainMixerNoise = this.context.createGain();
  this.gainMixerVco1 = this.context.createGain();
  this.gainMixerVco2 = this.context.createGain();



  this.constantNode = this.context.createConstantSource();
  this.constantNode.offset.value = 1.0;

  this.vco1.connect(this.gainMixerVco1);
  this.vco2.connect(this.gainMixerVco2);
  this.gainMixerVco1.connect(this.vcf);
  this.gainMixerVco2.connect(this.vcf);

  this.vco1.frequency.value = 200;
  this.vco2.frequency.value = 230;

  // Setup the graph.
  //this.oscillator.connect(this.vcf);

  this.lfo = this.context.createOscillator();
  this.lfo.frequency.value = 1  ;
  this.lfo.type = "sine";
  this.lfogain = this.context.createGain();
  this.lfomodgain = this.context.createGain();
  this.lfogain.gain.value = 0;

  this.vcf.connect(this.vca);
  this.vca.connect(this.lfomodgain);
  
  this.lfomodgain.connect(this.master);
  this.master.connect(this.analyser);
  
  this.analyser.connect(this.context.destination);

  
  this.lfo.connect(this.lfogain);
  this.lfogain.connect(this.lfomodgain.gain);
  //this.lfo.connect(this.vco2.frequency);
  //this.lfogain.connect(this.oscillator.frequency);
  //this.lfogain.connect(this.analyser);
  
  this.vco1.start(0);
  this.vco2.start(0);
  this.lfo.start(0);
  var now = this.context.currentTime;
  this.vca.gain.linearRampToValueAtTime(0, now);
  requestAnimationFrame(this.visualize.bind(this));
};

OscillatorSample.prototype.stop = function() {
  //this.oscillator.stop(0);
  this.vco1.stop(0);
  this.vco2.stop(0);
};

OscillatorSample.prototype.toggle = function() {
  (this.isPlaying ? this.stop() : this.play());
  this.isPlaying = !this.isPlaying;

};

OscillatorSample.prototype.playNote = function() {
  
  this.voltage = 0.2+Math.random()*6;
  var freq1 = this.voltage*(this.vco1coarse + this.vco1fine);
  var freq2 = this.voltage*(this.vco2coarse + this.vco2fine);

  //this.vco1.frequency.value = freq1;
  //this.vco2.frequency.value = freq2;


  var now = this.context.currentTime;

  this.vco1.frequency.cancelScheduledValues(now);
  this.vco1.frequency.linearRampToValueAtTime(freq1, now + this.portamento);
  this.vco2.frequency.linearRampToValueAtTime(freq2, now + this.portamento);

  this.vca.gain.cancelScheduledValues(now);
  this.vca.gain.linearRampToValueAtTime(0, now);
  // Ramp quickly up.
  this.vca.gain.linearRampToValueAtTime(1.0, now + this.ar_attack);
  // Then decay down to a sustain level.
  this.vca.gain.linearRampToValueAtTime(0, now + this.ar_attack+this.ar_release);
};

OscillatorSample.prototype.gateOn = function() {
  
  this.voltage = 0.2+Math.random()*6;
  console.log("this.vco1coarse",this.vco1coarse);
  console.log("this.vco1fine",this.vco1fine);
  console.log("this.voltage",this.voltage);
  var freq1 = this.voltage*Number(this.vco1coarse + this.vco1fine);
  console.log("freq1",freq1);
  this.vco1.frequency.value = this.voltage*Number(this.vco1coarse + this.vco1fine);
  this.vco2.frequency.value = this.voltage*Number(this.vco2coarse + this.vco2fine);
  //this.vco2.frequency.value = Math.random()*400;
  var now = this.context.currentTime;
  this.vca.gain.cancelScheduledValues(now);
  // Ramp quickly up.
  this.vca.gain.linearRampToValueAtTime(1.0, now + 1);
  
};


OscillatorSample.prototype.setVco1CoarseFrequency = function(val) {
  this.vco1coarse = Number(val);
  this.vco1.frequency.value = this.voltage*this.vco1coarse;
};

OscillatorSample.prototype.setVco2CoarseFrequency = function(val) {
  this.vco2coarse = Number(val);
  this.vco2.frequency.value = this.voltage*this.vco2coarse;
  
};

OscillatorSample.prototype.setVco1FineFrequency = function(val) {
  this.vco1fine = Number(val);
  this.vco1.frequency.value = this.voltage*(this.vco1coarse + this.vco1fine);
};

OscillatorSample.prototype.setVco2FineFrequency = function(val) {
  this.vco2fine = Number(val);
  this.vco2.frequency.value = this.voltage*(this.vco2coarse + this.vco2fine);
  console.log(this.vco2fine );
};

OscillatorSample.prototype.setARAttack = function(val) {
  this.ar_attack = Number(val);
};

OscillatorSample.prototype.setARRelease = function(val) {
  this.ar_release = Number(val);
};

OscillatorSample.prototype.changeFrequency = function(val) {
  this.oscillator.frequency.value = val;
};

OscillatorSample.prototype.changeDetune = function(val) {
  this.oscillator.detune.value = val;
};

OscillatorSample.prototype.changeType = function(type) {
  this.oscillator.type = type;
};

OscillatorSample.prototype.changeCutoff = function(val) {
  this.vcf.frequency.value = val;
};

OscillatorSample.prototype.changeQ = function(val) {
  this.vcf.Q.value = val;
};

OscillatorSample.prototype.setLFOFrequency = function(val) {
  this.lfo.frequency.value = val;
};

OscillatorSample.prototype.setMasterGain = function(val) {
  this.master.gain.value = val;
  
};

OscillatorSample.prototype.setLFOGain = function(val) {
  this.lfogain.gain.value = val;
  
};




OscillatorSample.prototype.visualize = function() {
  this.canvas.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  var drawContext = this.canvas.getContext('2d');
  drawContext.fillStyle = 'black';
  drawContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  var times = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteTimeDomainData(times);
  for (var i = 0; i < times.length; i++) {
    var value = times[i];
    var percent = value / 256;
    var height = this.HEIGHT * percent;
    var offset = this.HEIGHT - height - 1;
    var barWidth = this.WIDTH/times.length;
    drawContext.fillStyle = 'white';
    drawContext.fillRect(i * barWidth, offset, 2, 2);
  }
  requestAnimationFrame(this.visualize.bind(this));
};
