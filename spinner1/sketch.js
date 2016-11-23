var blades = [];

function setup() {
  createCanvas(400,400); // w,h
  setColors();
  frameRate(0);
  strokeWeight(0); fill(CYAN);
  translate(width/2, height/2);

  // we wrap the motors to turn them into parameterless
  // functions that can be called consistently from blade
  
  // mS = function(){ return 0; };
  // mC = function(){ return constant(0.05); };
  // mA = function(){ return accelerator(0.01) }; 
  mO = function(){ return oscillator(1*TAU,0.020) };
  m1s = function(){ return spring(1*TAU,0.020,1000) };
  m2s = function(){ return spring(2*TAU,0.010,1500) };

  blades[0] = new Blade(true,  drawComplex, mO );
  blades[1] = new Blade(false, drawComplex, m2s );
}

function draw() {
  background(102); // clear the canvas
  text("frame: "+frameCount, 20-width/2, 20-height/2);
  draw_blades();
}

function draw_blades(){
  var diameter = 60; // of center
  ellipse(0,0,diameter,diameter);
  blades.forEach(function(b){
    b.draw(12,diameter/2); 
  });
}
