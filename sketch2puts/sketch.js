
var graph;

function setup() {
  set_global_colors();
  createCanvas(600,450); // w,h
  translate(30,0); // set left margin
  var start = 100;
  var data = [[-20,50],[-40,30],[-40,80]];
  var duration = 1000; // frames to run
  graph = new Graph(start,data,duration);
}

function draw() {
  //if( frameCount >= 501 ) return
  background(0);
  trace(frameCount,5,20);
  graph.draw();
}

function trace(txt,x,y){
  stroke(CYAN); fill(CYAN);
  text(txt,x,y);
}

