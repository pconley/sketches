function setup() {
  setColors();
  w = 3000; h = 2000;
  createCanvas(w,h);
  noFill();
  noLoop();
}

// location X, Y, W, H
var X = 0;
var Y = 1;
var W = 2;
var H = 3;

var PW = 60;    // person width
var PH = 40;    // person height

var CHS = 10;   // child horizontal spaces
var CVS = 40;   // child vertical spacer

var XW = CHS;   // spouse connector width
var XH = 10;    // spouse connector height
var XT = PH/2-XH/2;  // connector top

var person = false;

var depth = 0;

function draw(){
  
  var tom    = {name: "tom"}
  var pj     = {name: "pj"};
  var pa1    = {name: "pa1"};
  var pa2    = {name: "pa2"};
  var aj     = {name: "aj", children: [pa1,pa2]};
  var cj     = {name: "cj"};
  var mjo    = {name: "mary jo"}
  var mjo2   = {name: "mjo2"}
  var claire = {name: "claaare", spouses: [tom], children: [pj,aj,cj]}
  var t1     = {name: "t1" };
  var t2     = {name: "t2" };
  var z1     = {name: "z1" };
  var z2     = {name: "z2" };
  var z3     = {name: "z3" };
  var ted    = {name: "ted", children: [z1,z2]}
  var tim    = {name: "tim", children: [t1,t2]}
  var pat    = {name: "patty", spouses: [mjo,mjo2], children: [claire,ted,tim]};
  
  var xxx    = {name: "xxx"};
  var zzz    = {name: "zzz"};
  var www    = {name: "www"};
  var jill   = {name: "jill"};
  var matt   = {name: "matty"}
  var aud    = {name: "matty"}
  var andrew = {name: "andrew", spouses: [aud], children: [zzz]}
  var jim    = {name: "jim", spouses: [jill,xxx], xhildren: [matt,andrew]};

  var bill = {name: "bill" };
  var a1   = {name: "a1"};
  var a2   = {name: "a2"};
  var aaa  = {name: "aaa", children: [a1,a2]}
  var bbb  = {name: "bbb" }
  var ccc  = {name: "ccc" }
  var ann  = {name: "anne", spouses: [bill], children: [aaa,bbb]};
  
  process_set([pat,jim,ann]);
  //process_set([jim]);
}

function process_set(set){
  // CALCULATION PHASE
  var rows = calc_set(0,0,set);
  var w = maxWidthFrom(rows);
  var h = PH + (PH+CVS) * (rows.length-1)
  // DEBUG the Calculations
  trace("set = "+rowsToString(rows));
  // DRAWING PHASE
  offset(20,20,function(){
    var v_margin = 40;
    var h_margin = 30;
    offset(h_margin,v_margin,function(){
      for( var i=0; i<set.length; i++ ) draw_segment(set[i]);
    });
    draw_frame(w+2*h_margin,h+2*v_margin);
  });
}

function calc_children(parent){
  var children = parent.children;
  if( !children || children.length == 0 ) return;
  
  print("calc children for "+parent.name);

  var x = 0; // hangs under parent    
  var y = parent.location[H] + CVS;
  var rows = calc_set(x,y,children);
  trace(parent.name+": child rows = "+rowsToString(rows));
  // concat child rows to the parent rows
  parent.rows = parent.rows.concat(rows);
}

function calc_spouses(segment){
  var spouses = segment.spouses;
  if( !spouses || spouses.length == 0 ) return;
  print("calc spouses of "+segment.name+" count = "+spouses.length);
  
  var rows = calc_set(PW+XW,0,spouses);
  segment.rows[0][0] = rows[0][0] + PW+XW;
  segment.rows[0][1] = rows[0][1];
  print(segment.name+" now has rows = "+rowsToString(segment.rows));
}

function calc_set(x0,y0,set){
  trace("calc set at "+x0+","+y0+"  length="+set.length);

  var rows = [[0,PH]];
  for( var i=0; i<set.length; i++ ){
    var person = set[i];
    calc_segment(0,y0,person);
    // now that we know the profile (eg. depth) of the
    // new person segement we can position it up against
    // growing left segments by shifting it over
    var x = fit(rows,person.rows);
    if( x>0 ) x += CHS;
    shift_segment(person,x+x0);
    
    trace("pre rows "+i+" : "+rowsToString(rows));
    trace("person rows "+i+" : "+rowsToString(person.rows));
    rows = merge(rows,person.rows);
    trace("result rows "+i+" : "+rowsToString(rows));
  }
  trace("final rows: "+rowsToString(rows));

  return rows;
}

function shift_segment(segment,offset){
  print("shift: "+segment.name+" by x = "+offset+" from "+segment.location[0]);
  segment.location[0] += offset;
  //if( segment.spouses  ) for( var i=0; i<segment.spouses.length; i++ ) shift_segment(segment.spouses[i],offset);
  // do not shift the children because their locations are relative to the parent segment
}

function fit(left,right){
  return maxWidthFrom(left);
  // print("left = "+rowsToString(left));
  // print("right = "+rowsToString(right));
  // return maxWidthFromPortion(left,right.length)
}

function merge(target, source){
  person = false;
  trace("merge: target = "+rowsToString(target));
  trace("merge: source = "+rowsToString(source));
  
  // if no target, return copy of source
  if( !target ) return source.slice(0);
  
  var rows = []; // the resulting rows
  var max_width = maxWidthFrom(target);
  var len = Math.max(target.length,source.length);
  
  //var temp = fit(target,source)
  //trace("temp = "+temp);
  //max_width = temp; // Eureka
  
  for( var i=0; i<len; i++ ){
    
    var th = 0; if(target[i]) th=target[i][1];
    var sh = 0; if(source[i]) sh=source[i][1];
    var rh = Math.max(th,sh)
    
    var tw = 0; if(target[i]) tw=target[i][0];
    var sw = 0; if(source[i]) sw=source[i][0];
    rw = max_width+sw; // simple uses the max width
    if( max_width>0 && sw>0 ) rw += CHS;
    
    trace(i+": "+max_width+" << "+sw+" ==> "+rw);

    rows[i] = [rw,rh];
    person = false;
  }
  trace("merge: result = "+rowsToString(rows));
  return rows;
}

function calc_segment(x0,y0,segment){
  print("calc segment name="+segment.name);
  if( !segment.rows ) segment.rows = [];
  if( !segment.location ) segment.location = [];
  calc_person(x0,y0,segment);
  calc_spouses(segment);
  calc_children(segment);
}

function offset(x,y,code){
    translate(x,y);
    code();
    translate(-x,-y);
}

function draw_segment(segment){
  
  var clr = BLACK;
  if( depth == 0 ) clr = CYAN;
  depth += 1; // remainder black
  
  offset(segment.location[X],segment.location[Y],function(){
      draw_box(segment.location,segment.name,clr);
      draw_spouses(segment.spouses);
      draw_children( segment.children );
  });   
}

function draw_spouses(spouses){
  if( !spouses ) return
    
  for( var k=0; k<spouses.length; k++ ){
      var p = spouses[k];
      offset(p.location[X],0,function(){
          stroke(BLUE);
          rect(-XW, PH/2-5, XW, 10); 
          draw_box(p.location,p.name,BLUE);
      });
  }
}

function draw_children(children){
    if( !children ) return;
    
    var mid1, mid;
    for( var k=0; k<children.length; k++ ){
      var child = children[k];
      mid = child.location[0]+PW/2;
      stroke(RED);
      if( k==0 ){
        mid1 = mid;
        // upper half on the first child
        line(mid,PH,mid,PH+CVS);
      }
      // lower half on every child
      line(mid,PH+CVS/2,mid,PH+CVS);
      draw_segment(child);
    }
    stroke(RED);
    line(mid1,PH+CVS/2,mid,PH+CVS/2);
}

function draw_box(location,name,clr){
  stroke(clr);
  rect(0, 0, location[W], location[H]);
  stroke(clr);
  text(name,10,15);
}

function calc_person(x0,y0,segment){
  //trace("calc person: name = "+segment.name+"  "+x0+","+y0);
  segment.location = [x0,y0,PW,PH];
  segment.rows = [[PW,PH]]; // single row
}

function maxWidthFrom(rows){
  var wide = 0;
  for( var i=0; i<rows.length; i++ ){
    wide = Math.max(wide,rows[i][0]);
  }
  return wide;
}

function maxWidthFromPortion(rows,len){
  var wide = 0;
  var m = Math.min(len,rows.length);
  for( var i=0; i<m; i++ ){
    wide = Math.max(wide,rows[i][0]);
  }
  return wide;
}

function trace(a1,a2,a3,a4,a5){
  if( person ) {
    var line = a1;
    if( a2 ) line += " "+a2;
    if( a3 ) line += " "+a3;
    if( a4 ) line += " "+a4;
    if( a5 ) line += " "+a5;
    print(line);
  }
}

function draw_frame(wide,deep) {
  stroke(BLUE); noFill();
  rect(0,0,wide,deep);
  textAlign(CENTER);
  text("Kazoku Tree",60,20);
}

function print_segment(segment){
      trace("name: "+segment.name);
      trace("loc: "+segment.location);
      trace("rows: "+rowsToString(segment.rows));
      if(segment.spouces) for( var k=0; k<segment.spouses.length; k++ ){
        trace("spouse "+(k+1)+" location = "+segment.spouses[k].location);
      }
      if(segment.children) for( var i=0; i<segment.children.length; i++ ) print_segment(segment.children[i]);
}

function rowsToString(rows){
  if( !rows ) return "undefined";
  result = " [";
  for( var i=0; i<rows.length; i++) result += rows[i][0]+",";
  return result+"]";
}

function proof(clr,w,h){
  //trace("proof w="+w+" h="+h);
  stroke(clr); noFill();
  rect(0,0,w,h);
}