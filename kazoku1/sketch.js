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

var trace_on = false;
var generation = 0;

function draw(){
  
  var dan    = {name: "dan", spouses:[{name: "diana"}]};
  var tom    = {name: "tom", spouses:[{name: "valerie"}]};
  var kids   = [{name: "mathew"},{name: "andrew"}];
  var jim    = {name: "jim", spouses:[{name: "jill"}], children:kids};
  var kids1  = [{name: "jahred"},{name: "brian"},{name: "megan"}]
  var elaine = {name: "elaine", spouses: [{name: "don"}], children: kids1};
  var kids2  = [{name: "claire"},{name: "ted"},{name: "tim"}]
  var pat    = {name: "pat", spouses: [{name: "mary jo"}], children: kids2};
  var wives  = [{name: "michelle"},{name: "margaret"}];
  var mike   = {name: "mike", spouses:wives};
  
  var sibs = [mike,pat,elaine,jim,tom,dan];
  var jerry = {name: "jerry", spouses: [{name: "ruth"}], children: sibs};
  
  var sps1 = {name: "spouse1" };
  var sps2 = {name: "spouse2" };
  var a21  = {name: "a2-1"}
  var a22  = {name: "a2-2" }
  var a23  = {name: "a2-3" }
  var a1   = {name: "a1"};
  var a2   = {name: "a2", children: [a21,a22]};
  var s3   = {name: "s3"};
  var a3   = {name: "a3", spouses: [s3]};
  var test = {name: "test", spouses: [sps1], children: [a1,a2,a3]};
  
  // var r = merge([[200,0]],[[130,0],[200,0]])
  // print("r = "+rowsToString(r));
  
  process_group([test,jerry]);
  //process_group([a1,a2,a3]);
  //process_group([test]);
}

function process_group(group){
  // CALCULATION PHASE
  var rows = calc_group(0,0,group);
  var w = maxWidthFrom(rows);
  var h = PH + (PH+CVS) * (rows.length-1)
  // DEBUG the Calculations>_console
  // trace("group = "+rowsToString(rows));
  // DRAWING PHASE
  offset(20,20,function(){
    var v_margin = 40;
    var h_margin = 30;
    offset(h_margin,v_margin,function(){
      for( var i=0; i<group.length; i++ ) draw_segment(group[i]);
    });
    draw_frame(w+2*h_margin,h+2*v_margin);
  });
}

function calc_group(x0,y0,group){
  //print("calc group at "+x0+","+y0+"  length="+group.length);
  var result = [];
  for( var i=0; i<group.length; i++ ){
    var person = group[i];
    calc_segment(0,y0,person);
    // now that we know the profile (eg. rows) of the new person segement, so
    // we can position it up against growing left segments by shifting it over
    var offset = fit(result,person.rows);
    if( offset>0 ) offset += CHS;
    person.location[0] += offset+x0;
    // now calculate the new set of rows for the growing left
    //if( generation==0 ) print("group before: "+person.name+" person = "+rowsToString(person.rows));
    //if( generation==0 ) print("group before: "+person.name+" results = "+rowsToString(result));
    result = merge(result,person.rows);
    //if( generation==0 ) print("group after: "+person.name+" results = "+rowsToString(result));
  }
  return result;
}

function calc_spouses(parent){
  var spouses = parent.spouses;
  if( !spouses || spouses.length == 0 ) return;
  trace("calc spouses of "+parent.name+" count = "+spouses.length);
  var space = parent.location[W] + XW;
  
  generation += .5;
  var rows = calc_group(space,0,spouses);
  generation -= .5;

  // now alter the parent segment first row to
  // incorporrate the sposes on that same row
  parent.rows[0][0] = rows[0][0] + space;
  parent.rows[0][1] = rows[0][1];
  trace(parent.name+" now has rows = "+rowsToString(parent.rows));
}

function calc_children(parent){
  var children = parent.children;
  if( !children || children.length == 0 ) return;
  // print("calc children for "+parent.name);
  
  var x = 0; // hangs under parent    
  var y = parent.location[H] + CVS;
  
  generation += 1;
  var rows = calc_group(x,y,children);
  generation -= 1;

  //trace(parent.name+": child rows = "+rowsToString(rows));
  // concat child rows to the parent rows
  parent.rows = parent.rows.concat(rows);
}

function fit(left,right){
  // returns the max width from the left side, based
  // on the depth of the right side so that the right
  // can "fit" into the profile of the left
  var wide = 0;
  var m = Math.min(right.length,left.length);
  for( var i=0; i<m; i++ ){
    wide = Math.max(wide,left[i][0]);
  }
  return wide;
}

function merge(target, source){
  // if no target, return copy of source
  if( !target ) return source.slice(0);
  
  var rows = []; // the resulting rows
  
  var max_width = 0;
  // find the max of the target for length of source
  var n = Math.min(target.length,source.length);
  n = source.length;
  for( var i=0; i<n; i++ ){
    var temp = 0; if( target[i] ) temp=target[i][0];
    max_width = Math.max(max_width,temp);
  }
  //if( generation==0 ) print("max target partial = "+max_width);

  // construct rows of the larger of the two
  var m = Math.max(target.length,source.length);
  for( var i=0; i<m; i++ ){
    
    var th = 0; if(target[i]) th=target[i][1];
    var sh = 0; if(source[i]) sh=source[i][1];
    var rh = Math.max(th,sh)
    
    var tw = 0; if(target[i]) tw=target[i][0];
    var sw = 0; if(source[i]) sw=source[i][0];
    var rw = 0;

    //if( generation==0) print(i+": tw="+tw+" sw="+sw+" max="+max_width);
    
    // use max width on top part
    z = tw; if( i<n ) z = max_width;
    // combine the values
    rw = z + sw;
    // and add a spacer as needed
    if( z>0 && sw>0 ) rw += CHS;
    
    rows[i] = [rw,rh];
  }
  // if( generation==0 ){
  //   print("merge: target = "+rowsToString(target));
  //   print("merge: source = "+rowsToString(source));
  //   print("merge: result = "+rowsToString(rows));
  // }
  return rows;
}

function calc_segment(x0,y0,segment){
  //print("calc segment name="+segment.name);
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
  
  offset(segment.location[X],segment.location[Y],function(){
      draw_person(segment);
      draw_spouses(segment.spouses);
      draw_children( segment.children );
  });   
}

function draw_spouses(spouses){
  if( !spouses ) return
    
  for( var k=0; k<spouses.length; k++ ){
      var p = spouses[k];
      if( p.location ){
        offset(p.location[X],0,function(){
            stroke(BLUE);
            // the connector
            rect(-XW, PH/2-5, XW, 10); 
            draw_person(p,BLUE);
        });
      }
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

function draw_person(person,clr){
  var base = BLACK; if( clr ) base = clr;
  // override the first generation with a color
  var c = base; if (person.generation==0) c=RED;
  stroke(c); // fill(WHITE);
  rect(0, 0, person.location[W], person.location[H]);
  var txt = person.generation+": "+person.name;
  text(person.name,10,15);
}

function calc_person(x0,y0,segment){
  //print("calc person: name = "+segment.name+"  "+x0+","+y0);
  segment.generation = generation;
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