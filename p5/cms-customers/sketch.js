let angles = [30, 10, 45, 35, 60, 38, 75, 67];

var sheet;
var graph;
var slide;

function preload() {
  set_global_colors();
  sheet = new Sheet();
  sheet.load("assets/counts.csv");
  // no code here; the table is loaded async
}

function setup() {
  createCanvas(720, 400);
  noStroke();
  noLoop(); // Run once and stop
}

function setup() {
  frameRate(60);
  createCanvas(900,600); // w,h
  var footer = height/5;
  var graph_params = {top: 60, left: 10, height: height-footer, width:width-10-10}
  graph = new Graph(sheet,graph_params);
  slide = new Slide("Top Ten Customers");
}

var loop_rate = 15;
var start_week = 0; //100; // 0;

function draw() {
  //if( frameCount > 300 ) return;
  var week = Math.floor(frameCount/loop_rate);
  // calc percent distance to the next week
  var pct = (frameCount%loop_rate)/loop_rate;
  // stop display after all weeks shown
  if( week >= sheet.week_count ) return;
  background(0);
  
  debug("frame = "+frameCount, 10, 10);

  push(); // save draw state
  slide.draw_header();
  graph.draw(10,week,pct);
  pop(); // restore draw state
  draw_calendar(week,width-150,height-250);
}

var slider = 0;
var prev_month = 0;

var draw_calendar = function(week,x,y){
  translate(x,y);
  var page_width = 85;
  var page_height = 75;
  var mnames = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
  var this_month = sheet.get_month(week)-1;
  var next_week = Math.min(week+1,sheet.week_count-1);
  var next_month = sheet.get_month(next_week)-1;
  var month = mnames[this_month];
  var year = sheet.get_year(week);
  //year += " ("+week+")"; // debugging
  fill(GRAY)
  rect(0,0,page_width,page_height);
  
  textSize(14); fill(YELLOW);
  textAlign(CENTER);
  text(year,page_width/2,15);

  line(0,20,page_width,20);
  
  textSize(36);
  baseline = page_height - 15;
  if( prev_month != this_month ){
    // first week of new month
    slider = -2;
    prev_month = this_month;
  }
  slider += (next_month == this_month) ? 0 : 2;
  //rotateX(radians(45));
  text(month,page_width/2,baseline+slider);
  textAlign(LEFT);

  // put a hider below the display part
  fill(BLACK)
  rect(0,page_height,page_width,page_height);

}

function debug(txt,y){
  textSize(12); fill(YELLOW);
  text(txt,0,y+12);
}