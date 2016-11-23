function setup() {
  setColors();
  createCanvas(300,200); // w,h
  noLoop();
}

var base = 100;
var wide = 40;
var space = 30;
var margin = 20;

var bars = 3;

function draw(){
  
  draw_frame();
  wide = 8;
  space = 8;
  draw_12bars();
}

function draw_12bars() {
  bar( "J", 70, 50 );
  bar( "F", 86, 55 );
  bar( "M", 50, 20 );
  bar( "A", 70, 50 );
  bar( "M", 86, 55 );
  bar( "J", 50, 20 );
  bar( "J", 70, 50 );
  bar( "A", 86, 55 );
  bar( "S", 50, 20 );
  bar( "O", 70, 50 );
  bar( "N", 86, 55 );
  bar( "D", 50, 20 );
}

function draw_3bars() {
  bar( "2014", 70, 50 );
  bar( "2015", 86, 55 );
  bar( "2016", 50, 20 );
}

function bar(txt, v, z){
  fill(BLACK);
  rect(0, base-v, wide, v)
  fill(PINK);
  rect(0, base-z, wide, z)
  text(txt,5,base+20);
  translate(wide+space,0);
}

function draw_frame() {
  
  translate(margin,margin);
  
  var gw = margin + 3*wide+ 2*space;
  var bw = gw+2*margin;
  
  stroke(BLUE);
  rect( 0,0,bw,160);
  
  textAlign(CENTER);
  text("Settlements",bw/2,15);
  
  translate(margin,20);
  stroke(RED);
  rect( 0,0,gw,130);

  stroke(GRAY);
  
  for( i=20; i<=100; i+=20) line(0, i, gw, i);

  translate(10,0);
 }
