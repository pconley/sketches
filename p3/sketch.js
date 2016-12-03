function setup() {
  setColors();
  w = 3000; h = 2000;
  createCanvas(w,h);
  noFill();
  noLoop();
}

function draw(){

  var p1 = new Piece([[0,10],[-10,40],[0,20]]);
  var p2 = new Piece([[10,40],[0,40],[20,30]]);
  var p3 = new Piece([[10,40],[10,40],[20,30],[-20,90]]);
  var p4 = new Piece([[0,10],[0,20],[0,30]]);

  var set = [p1,p2,p3,p4];
  
  draw_set(set);
}

function draw_set(set){
  var colors = [PINK,BLUE];
  offset(20,30,function(){
    var gap = 0;
    for( var i=0; i<set.length; i++ ){
      set[i].shift(-gap);
      set[i].draw(colors[i%2]);
      gap = calc_gap(set[i],set[i+1]);
    }
  });
}

function calc_gap(p1,p2){
  if( !p1 || !p2 ) return 0;
  var gap = 99999999;
  var m = Math.min(p1.rows.length,p2.rows.length);
  for(var i=0; i<m; i++ ) {
    var l_of_2 = p2.rows[i].left;
    var r_of_1 = p1.rows[i].right;
    var g = l_of_2 - r_of_1;
    //print(l_of_2+" - "+r_of_1+" => "+g)
    gap = Math.min(gap,g);
  }
  return gap;
}

function offset(x,y,code){
  translate(x,y);
  code();
  translate(-x,-y);
}