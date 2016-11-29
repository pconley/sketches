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

var CHS = 20;   // child horizontal spaces
var CVS = 40;   // child vertical spacer

var XW = 20;    // spouse connector width
var XH = 10;    // spouse connector height
var XT = PH/2-XH/2;  // connector top

var trace_on = false;

var depth = 0;

function draw(){
  
  var mjo    = {name: "mary jo"}
  var mjo2    = {name: "mjo2"}
  var tom    = {name: "tom"}
  var pj      = {name: "pj"};
    var a1      = {name: "a1"};
    var a2      = {name: "a2"};

  var aj      = {name: "aj", children: [a1,a2]};
  var cj      = {name: "cj"};
  var claire = {name: "claaare", spouses: [tom], children: [pj,aj,cj]}
  var t1 = {name: "t1" };
  var t2 = {name: "t2" };
  var ted    = {name: "ted", xhildren: [t1,t2]}
  var tim    = {name: "tim", children: [t1,t2]}
  var jill   = {name: "jill", children: ["zzzzzz"]}
  var aaa    = {name: "aaa", children: ["a","b","c"]}
  var bbb    = {name: "bbb", children: ["a","b","c"]}
  var xxx    = {name: "xxx"}
  var matt   = {name: "matty"}
  var andrew = {name: "andrew", spouses: ["audrey"], children: ["aaa"]}
  
  var pat = {rows: [], name: "patty", spouses: [mjo,mjo2], children: [claire,ted,tim]};
  var ann = {name: "anne", spouses: ["bill"], children: [aaa,"bbb"]};
  var jim = {name: "jim", spouses: [jill,xxx], children: [matt,andrew]};
  
  offset(10,10,function(){
    offset(30,40,function(){
      calc_segment(0,0,pat);
      draw_segment(pat);
      //print_segment(pat);
    });
    draw_frame(650,350); // TODO: dynamic size
  });
}

function calc_segment(x0,y0,segment){
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
  
  depth += 1;
  
  offset(segment.location[X],segment.location[Y],function(){
  
        var clr = BLACK;
        if( depth == 1 ) clr = CYAN;
        draw_box(segment.location,segment.name,clr);
        
        if( segment.spouses){
          offset(segment.location[W],0,function(){
             for( var k=0; k<segment.spouses.length; k++ ){
              var p = segment.spouses[k];
              offset(p.location[X],0,function(){
                  rect(-XW, PH/2-5, XW, 10); 
                  draw_box(p.location,p.name,BLUE);
              });
            }
          });
        }
      
        var mid1, mid;
        if( segment.children) {
          for( var k=0; k<segment.children.length; k++ ){
            var child = segment.children[k];
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
  });   
}

function draw_box(location,name,clr){
  stroke(clr);
  rect(0, 0, location[W], location[H]);
  stroke(clr);
  text(name,10,15);
}

function calc_person(x0,y0,segment){
  //print("calc person: name = "+segment.name+"  "+x0+","+y0);
  // a person block is a single row of fixed size
  // located at the current origin of the diagram
  segment.location = [x0,y0,PW,PH];
  segment.rows = [[PW,PH]];
}
  
function calc_spouses(segment){
  var spouses = segment.spouses;
  if( !spouses || spouses.length == 0 ) return;
  // spouses are still only on the first row only
  // we assume that the main person has been added
  // and we are NOT treating spouses as a segemnt
  var high = segment.location[H];   // height of this row
  var wide = segment.location[W];   // width of this row
  var x = 0;      // starting X of first spouse
  var y = 0;      // all spouses at same Y as person
  for( var s=0; s<spouses.length; s++ ){
    var spouse = spouses[s];
    calc_person(x+XW,y,spouse);
    x = spouse.location[X] + spouse.location[W];
    wide += XW + spouse.location[W];
    high = Math.max(high,spouse.location[H])
  }
  segment.rows[0][0] = wide;
  segment.rows[0][1] = high;
}

function calc_children(segment){
  var children = segment.children;
  if( !children || children.length == 0 ) return;

  var wide = 0;
  var high = 0;
  var x = 0;         // first child X position
  var y = segment.location[H] +CVS;   // all children Y position
  
  //print("calc children of "+segment.name+"  at "+x+","+y+"  length="+children.length);

  for( var i=0; i<children.length; i++ ){
    var child = children[i];
    calc_segment(x,y,child);
    //print_segment(child);
    var w = maxWidthFrom(child.rows);
    var h = child.rows[0][1];
    wide += CHS + w;
    high = Math.max(high,h);
    x += CHS + w; // shift right
  }
  segment.rows.push([wide,high]);
}

function maxWidthFrom(rows){
  var wide = 0;
  for( var i=0; i<rows.length; i++ ){
    wide = Math.max(wide,rows[i][0]);
  }
  return wide;
}

function trace(a1,a2,a3,a4,a5){
  if( trace_on ) {
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
      print("name: "+segment.name);
      print("loc: "+segment.location);
      print("rows: "+rowsToString(segment.rows));
      if(segment.spouces) for( var k=0; k<segment.spouses.length; k++ ){
        print("spouse "+(k+1)+" location = "+segment.spouses[k].location);
      }
      if(segment.children) for( var i=0; i<segment.children.length; i++ ) print_segment(segment.children[i]);
}

function rowsToString(rows){
  result = "";
  for( var i=0; i<rows.length; i++) result += "   "+i+": ["+rows[i]+"]";
  return result;
}

function proof(clr,w,h){
  //trace("proof w="+w+" h="+h);
  stroke(clr); noFill();
  rect(0,0,w,h);
}