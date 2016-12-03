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
var XT = PH/2-XH/2;  // connectpersonor top

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
  
  var sps1 = {name: "spouse1", children: [{name: "surprise"}] };
  var sps2 = {name: "spouse2" };
  var a21  = {name: "a2-1"}
  var a22  = {name: "a2-2" }
  var a23  = {name: "a2-3" }
  var a1   = {name: "a1"};
  var a2   = {name: "a2", children: [a21,a22]};
  var s3   = {name: "s3"};
  var a3   = {name: "a3", xpouses: [s3]};
  var test = {name: "test", spouses: [sps1], children: [a1,a2,a3]};
  
  // var r = merge([[200,0]],[[130,0],[200,0]])
  // print("r = "+rowsToString(r));
  
  process_group([test,jerry]);
  //process_group([a1,a2,a3]);
  //process_group([mike]);
}

function process_group(group){
  // CALCULATION PHASE
  var rows = calc_group(0,0,group);
  var w = maxWidthFrom(rows);
  var h = PH + (PH+CVS) * (rows.length-1)
  // DEBUG the Calculations>_console
  // trace("group = "+rowsToString(rows));
  // DRAWING PHASE
  var pm = 20; // page margin
  offset(pm,pm,function(){
    var v_margin = 40;
    var h_margin = 30;
    draw_frame(w+2*h_margin,h+2*v_margin);
    offset(h_margin,v_margin,function(){
      for( var i=0; i<group.length; i++ ) draw_segment(group[i]);
    });
  });
}

function calc_group(x0,y0,group){
  //print("calc group at "+x0+","+y0+"  length="+group.length);
  var profile = [];
  for( var i=0; i<group.length; i++ ){
    var person = group[i];
    calc_segment(0,y0,person);
    // now we know the profile (eg. rows) of the new person segement, so we
    // can position it up against growing left segments by shifting it over
    var offset = maxOfPartial(profile,person.rows);
    if( offset>0 ) offset += CHS;
    person.location[0] += offset+x0;
    // now calculate the new set of rows for the growing left
    profile = merge(profile,person.rows);
  }
  return profile;
}

function calc_spouses(x0,y0,parent){
  var spouses = parent.spouses;
  if( !spouses || spouses.length == 0 ) return;
  //print("calc spouses of "+parent.name+" count = "+spouses.length);
  var rows = calc_group(0,0,spouses);
  // now we know the profile (eg. rows) of the spouses group, so we
  // can position it up against the peron by shifting over ALL spouses
  var setoff = maxOfPartial(parent.rows,rows) + CHS;
  for( var i=0; i<spouses.length; i++ ){
      spouses[i].location[X] += setoff;
  }
  parent.rows = merge(parent.rows,rows,false);
}


function calc_children(x0,y0,parent){
  var children = parent.children;
  if( !children || children.length == 0 ) return;
  // print("calc children for "+parent.name);
  var rows = calc_group(x0,y0,children);
  
  
  rows.unshift([0,0]); // insert a dummy row
  parent.rows = merge(parent.rows,rows,true);

  
  // concat child rows to the parent rows
  //parent.rows = parent.rows.concat(rows);
}

function calc_segment(x0,y0,segment){
  //print("calc segment name="+segment.name);
  if( !segment.rows ) segment.rows = [];
  if( !segment.location ) segment.location = [];
  
  // the main person or parent of the segement
  calc_person(x0,y0,segment);

  // the children hang directly under the person
  // but one row lower, so only y need to change
  var c_y = segment.location[H] + CVS;
  generation += 1;
  calc_children(0,c_y,segment);
  generation -= 1;
  
  // spouses are to the right of the person but
  // on the same row... so only X changes
  var s_x = segment.location[W] + XW;
  generation += .5;
  calc_spouses(s_x,0,segment);
  generation -= .5;
}

function calc_person(x0,y0,segment){
  //print("calc person: name = "+segment.name+"  "+x0+","+y0);
  segment.generation = generation;
  segment.location = [x0,y0,PW,PH];
  segment.rows = [[PW,PH]]; // single row
}

function maxOfPartial(left,right){
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

function merge(left, right, debug){
  // this is the heart of the "fitting" mechanism that merges the
  // profiles (rows) of the existing left object by adding the right
  
  // if no left, return copy of right
  if( !left ) return right.slice(0);
  
  var rows = []; // the resulting profile
  var max_left = maxOfPartial(left,right);
  if( debug ) print("max left="+max_left);

  // construct profile sized to the larger 
  var m = Math.max(left.length,right.length);
  for( var i=0; i<m; i++ ){
    // calculate height for row
    var l_h = val(left[i],1);
    var r_h = val(right[i],1);
    var h = Math.max(r_h,l_h);
    // calculate width for row
    var l_w = val(left[i],0);
    var r_w = val(right[i],0);
    // use max left width on top part of the array, but 
    // use the normal left width in the bottom of the array
    var lefty = l_w; if( i<right.length ) lefty = max_left;
    if( debug ) print(right.length+" ? "+i+": lefty = "+lefty+" r_w="+r_w);
    // finally, combine the left and right values
    var w = lefty + r_w;
    // and add a spacer as needed
    if( lefty>0 && r_w>0 ) w += CHS;
    
    rows[i] = [w,h];
  }
  // show you work for unit tests
  if( debug ){
    print("merge: left = "+rowsToString(left));
    print("merge: right = "+rowsToString(right));
    print("merge: result = "+rowsToString(rows));
  }
  return rows;
}

function val(x,n){
  // return the n-th value of the array
  // or a zero if the array does not exist
  var v = 0; if(x && x[n]) v=x[n];
  return v;
}

function offset(x,y,code){
    translate(x,y);
    code();
    translate(-x,-y);
}

function draw_segment(segment,clr){
  
  offset(segment.location[X],segment.location[Y],function(){
      draw_person(segment,clr);
      draw_spouses(segment,BLUE);
      draw_children(segment,BLACK);
  });   
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

function draw_spouses(person,clr){
  var spouses = person.spouses;
  if( !spouses ) return
  //print("draw spouses for "+person.name);

  var cx = PW; // first connector X
  for( var k=0; k<spouses.length; k++ ){
      var spouse = spouses[k];
      if( spouse.location ){
          // draw the spuse connector
          stroke(clr);
          var sx = spouse.location[X];
          rect(cx, PH/2-5, sx-cx, 5); 
          cx = sx+PW; // next connector X
          // then the person (via segment)
          draw_segment(spouse,clr);
      }
  }
}

function draw_children(parent,clr){
  var children = parent.children;
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
      draw_segment(child,clr);
    }
    stroke(RED);
    line(mid1,PH+CVS/2,mid,PH+CVS/2);
}

function maxWidthFrom(rows){
  var wide = 0;
  for( var i=0; i<rows.length; i++ ){
    wide = Math.max(wide,rows[i][0]);
  }
  return wide;
}

function trace(a1,a2,a3,a4,a5){
  if( !trace_on ) return;
  
  var line = a1;
  if( a2 ) line += " "+a2;
  if( a3 ) line += " "+a3;
  if( a4 ) line += " "+a4;
  if( a5 ) line += " "+a5;
  print(line);
}

function draw_frame(wide,deep) {
  stroke(BLUE); noFill();
  rect(0,0,wide,deep);
  text("Kazoku Tree",20,20);
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