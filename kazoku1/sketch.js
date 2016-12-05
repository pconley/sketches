function setup() {
  setColors();
  w = 3000; h = 2000;
  createCanvas(w,h);
  noFill();
  noLoop();
}


var generation = 0;

function draw(){
  
  var dan    = new Person("dan",[new Person("diana")]);
  var tom    = new Person("tom", [new Person("valerie")]);
  var j_kids = [new Person("mathew"),new Person("andrew")];
  var jim    = new Person("jim", [new Person("jill")], j_kids);
  var e_kids = [new Person("megan"),new Person("brian"),new Person("jahred")];
  var elaine = new Person("elaine", [new Person("don")], e_kids);
  var p_kids = [new Person("claire"),new Person("ted"),new Person("tim")];
  var pat    = new Person("pat", [new Person("mary jo")], p_kids);
  var wives  = [new Person("michelle"),new Person("margaret")];
  var mike   = new Person("mike", wives);
  var sibs   = [mike,pat,elaine]; //,jim,tom,dan];
  var jerry  = new Person("jerry", [new Person("ruth")], sibs);

  var sps1 = new Person("spouse1", [], [new Person("surprise")]);;
  var sps2 = new Person("spouse2");
  var a21  = new Person("a2-1");
  var a22  = new Person("a2-2");
  var a23  = new Person("a2-3");
  var a1   = new Person("a1");
  var a2   = new Person("a2", [], [a21,a22]);
  var s3   = new Person("s3");
  var a3   = new Person("a3", [s3]);
  var test = new Person("test", [sps1], [a1,a2,a3]);
  
  // var a21  = new Person("a2-1");
  // var a22  = new Person("a2-2");
  // var a1   = new Person("a1");
  // var a2   = new Person("a2", [], [a21,a22]);
  // var a3   = new Person("a3", []);
  // var test = new Person("test", [], [a1,a2,a3]);

  process_set([test,jerry]);
}

function process_set(set){
  var group = new Group("top",set,0);
  var pm = 20; // page margin
  offset(pm,pm,function(){
    var v_margin = 40;
    var h_margin = 30;
    var w = maxWidthFrom(group.rows);
    var h = PH + (PH+CVS) * (group.rows.length-1)
    print("top rows="+rowsToString(group.rows)); 
    print("w="+w+" h="+h);
    draw_frame(w+2*h_margin,h+2*v_margin);
    offset(h_margin,v_margin,function(){ 
      group.draw();
    });
  });
}

function offset(x,y,code){
    translate(x,y);
    code();
    translate(-x,-y);
}

function maxWidthFrom(rows){
  return widths(rows).reduce( maxOf, 0 );
}

function widths(rows){
  return rows.map(function(row){ return row[0]; });
}

function draw_frame(wide,deep) {
  stroke(BLUE); noFill();
  rect(0,0,wide,deep);
  text("Kazoku Tree",20,20);
}

function rowsToString(rows){
  if( !rows ) return "undefined";
  return " [" + widths(rows).join() + "]";
}

function proof(clr,w,h){
  stroke(clr); noFill();
  rect(0,0,w,h);
}