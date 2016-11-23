var b1height = 20;
var factor = 100;
var offset = 250;
var bottom = 350; // 500; // 350

var canvas = null;

var months = ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

function setup() {
  setColors();
  canvas = createCanvas(1100,800); // w,h
  strokeWeight(0).textSize(b1height);
  textFont("Helvetica");
  textAlign(RIGHT);
  noLoop();

}

function draw() {
  
  translate(20,0); // left margin
  translate(0,20); // top margin
  
  draw_grid();
  
  push();  // Start a new drawing state

  translate(0,10); // top margin

  // draw_bars( "Vendor Portal", 0, 1, 0, 2, GRAY );
  // draw_bars( "64 Bib Change", 0, 2, 0, 1, GRAY );
  // draw_bars( "Memory Leak", 0, 2, 0, 1, GRAY );
  // draw_bars( "Proforma Endpoint", 0, 2, 0, 2, GRAY );
  // draw_bars( "Horizontal Report", 1, 1, 1, 1, GRAY );
  // draw_bars( "Unmask Bank Info (New)", 0, 0, 1, 1, GRAY );
  // draw_bars( "Performance (contractor)", 1, 3, 1, 3, GRAY );
  // draw_bars( "Performance (documents)", 4, 3, 4, 3, GRAY );
  // draw_bars( "DevEx Upgrade", 2, 1, 2, 1, GRAY );
  // draw_bars( "ABE Resetter", 2, 1, 2, 1, GRAY );
  // draw_bars( "Negotiations Resetter", 3, 1, 3, 1, GRAY );
  // draw_bars( "Master/Subs Fix", 2, 2, 2, 2, GRAY );
  // draw_bars( "Background Processing", 2, 4, 2, 4, GRAY );
  // draw_bars( "Contractor Rolodex", 4, 1, 4, 1, GRAY );
  // draw_bars( "Backup TIN Provider", 4, 2, 4, 2, GRAY );
  // draw_bars( "SMS Notifications", 3, 1, 3, 1, GRAY );
  // draw_bars( "Negotiation Notifications", 4, 1, 4, 1, GRAY );
  // draw_bars( "Enrollment Notifications", 5, 2, 5, 2, GRAY );
  // draw_bars( "Background Partner", 6, 1, 6, 1, GRAY );
  
  draw_bars( "ICX v1", 1, 3, 1, 4, GRAY );
  draw_bars( "ICX v2", 4, 3, 5, 3, GRAY );
  translate(0,20); // spacer
 
  draw_bars( "EOM Process & KT", 0, 1, 0, 1, GRAY );
  draw_bars( "Recivables Manager", 0, 1, 0, 1.5, GRAY );
  draw_bars( "Confirm Settlements", 0, 1, 0, 2.0, GRAY );
  draw_bars( "Transfer Clearing", 0, 1, 0, 2.25, GRAY );
  draw_bars( "SL-18", 1, 1, 1, 1, GRAY );
  draw_bars( "Encrypt Pswds", 1, 1, 1, 1, GRAY );
  draw_bars( "Pitch & Catch", 2, 1, 2, 1, GRAY );
  draw_bars( "SL-4", 2, 2, 2, 2, GRAY );
  draw_bars( "Paytype Controls", 4, 2, 4, 2, GRAY );
  draw_bars( "Dynamic Accounts", 5, 2, 5, 2, GRAY );
  
  pop();  // Restore original state

  //draw_today(1.75);
  
  print("saving");
  //saveCanvas(canvas, 'myCanvas', 'jpg');
  save("roadmap","png");
}

function draw_today(x){
  push();  // Start a new drawing state
  var p = offset + factor * x;
  //stroke(YELLOW);
  line( p, 0,  p, bottom );
  pop();  // Restore original state
}

function draw_grid(){
  var n = 7;
  strokeWeight(1);
  fill(GRAY);
  textAlign(CENTER);
  for( i=0; i<n; i++ ){
    var x = factor * i;
    text(months[i],offset+x+factor/2,0);
    line( offset+x, 5, offset+x, bottom+5 );
  }
  line( offset+factor*n, 5,  offset+factor*n, bottom+5 );

  translate(0,5);
  strokeWeight(2);
  var wide = offset + factor * n;

  line( offset, 0, wide, 0 ); // top
  line( offset, bottom, wide, bottom ); // bottom
}

function draw_bars(name, s1, w1, s2, w2, base){
  fill(BLACK);
  //stroke(base);
  textAlign(RIGHT);
  text(name, offset-5, b1height);
  fill(base);
  rect( offset+factor*s1, 0, factor*w1, b1height );
  fill(PINK);
  rect( offset+factor*s2, b1height/4, factor*w2, b1height/2 );
  translate(0,b1height+5);

}