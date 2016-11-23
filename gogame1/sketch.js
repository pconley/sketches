var unit = 20;

function setup() {
  createCanvas(600,600); // w,h
  setColors();
  console.log( 'a'-'a' )
}

function draw() {
  translate(30,30);
  draw_board();
  draw_stone(WHITE, 7,7);
  draw_stone(BLACK, 7,8);
}

function draw_stone(color,row,col){
  fill(color);
  ellipse(unit*row,unit*col,unit,unit);

}

function draw_board(){
  var lines = 19;
  var wide = (lines-1)*unit;
  var border = 30;
  fill(YELLOW);
  rect( 0, 0, wide+2*border, wide+2*border );
  translate(30,30);
  for( i=0; i<19; i++ ){
    var x = unit * i;
    line( 0, x, wide, x );
    line( x, 0, x, wide );
  }
  var x = [3,9,15];
  for( n=0; n<x.length; n++ ){
    for( m=0; m<x.length; m++ ){
      fill(BLACK);
      ellipse(unit*x[n],unit*x[m],4,4);
    }
  }
}