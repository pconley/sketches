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
  
  translate(30,40);
  
      calc_segment(0,0,pat);
      draw_segment(pat);
      print_segment(pat);

  translate(-30,-40);
  
  //proof(BLACK,dims[0] + 2*margin,dims[1] + 2*margin);
}

function rowsToString(rows){
  result = "";
  for( var i=0; i<rows.length; i++) result += "   "+i+": ["+rows[i]+"]";
  return result;
}

function calc_segment(x0,y0,segment){
  //if( !segment ) return;
  if( !segment.rows ) segment.rows = [];
  if( !segment.location ) segment.location = [];
  calc_person(x0,y0,segment);
  calc_spouses(segment);
  calc_children(segment);
}

function draw_segment(segment){
  
  translate(segment.location[X],segment.location[Y]);

        draw_sperson(segment.location,segment.name,BLACK);
        
        if( segment.spouses){
          translate(segment.location[W],0);
          for( var k=0; k<segment.spouses.length; k++ ){
            var p = segment.spouses[k];
            translate(p.location[X],0);
            rect(-XW, PH/2-5, XW, 10); 
            draw_sperson(p.location,p.name,BLUE);
            translate(-p.location[X],0);
          }
          translate(-segment.location[W],0);
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
        
  translate(-segment.location[X],-segment.location[Y]);

}

function draw_sperson(location,name,clr){
  stroke(clr);
  rect(0, 0, location[W], location[H]);
  stroke(BLUE);
  text(name,10,15);
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

function calc_person(x0,y0,segment){
  print("calc person: name = "+segment.name+"  "+x0+","+y0);
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
  
  print("calc children of "+segment.name+"  at "+x+","+y+"  length="+children.length);

  for( var i=0; i<children.length; i++ ){
    var child = children[i];
    print(i+" here "+child);
    calc_segment(x,y,child);
    print("*** child");
    print_segment(child);
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

function adjustRowsToRight(rows,accum){
  print("adjust in rows: "+rowsToString(rows));
  print("adjust in accum: "+rowsToString(accum));
  
  // first implementation is a "not fit" slide all
  // of row over by the mas accumulated so fall
  
  var m = 0;
  for( var n=0; n<accum.length; n++ ) m = Math.max(m,accum[n][0]);
  
  for( var i=0; i<rows.length; i++ ){
    rows[i][0] += m;
  }
  print("adjust out rows: "+rowsToString(rows));

  return rows;
}

function accumulateRowsInto(accum, rows){
  // accum += rows
  return rows;
}


function add_rows(arr1,arr2){
  //print("arr1 = "+arr1);
  //print("arr2 = "+arr2);
  var result = [];
  var depth = Math.max(arr1.length,arr2.length);
  //print("depth="+depth);
  var xxx = acopy(arr1,99);
  //print("xxx = "+xxx);
  xxx.splice(arr2.length,99);
  //print("xxx = "+xxx);
  var max1 = getMaxOfArray(xxx);
  // print("max = "+max1);
  //   print("arr1 = "+arr1);
  // print("arr2 = "+arr2);

  for( var i=0; i<depth; i++){
      a = 0; if( arr1[i] ) { a = arr1[i]; }
      b = 0; if( arr2[i] ) { b = arr2[i]; }
      var spacer = 0;
      if( a>0 && b>0 ){ spacer = CVS; }
      result[i] = a + spacer + b;
  }
  //print("res = "+result);
  return result;
}

function acopy(arr, len){
  var result = [];
  var m = Math.min(len,arr.length);
  for( var i=0; i<m; i++ ){
    result.push(arr[i]);
  }
  return result;
}

function draw_family(x0,y0,clr,fam){
  
  translate(x0,y0);

  var name = fam;
  if( typeof fam == "object" ) name = fam.name;
  //trace("DF: name = "+name);

  var ind = draw_person(0,0,CYAN,fam);
  var ind_w = PW; // individual width
  var ind_h = PH;     // individual height

  var s_dims = draw_spouses(ind_w,0,RED,fam.spouses);
  var sps_w = s_dims[0]; // spouse width
  var sps_h = PH; // spouse height
  
  /*** the children ***/
  var rows = draw_children(0,ind_h,RED,fam.children);
  var kid_w = rows[0]; // children width

  //trace("DF: "+name+" kids="+rows);
  var kh = (PH+CVS)*rows.length;
  
  rows.unshift(PW+s_dims[0]);
  //trace("DF: "+name+" rows="+rows);

  if( name == "anne" ){
      var kw = getMaxOfArray(rows);
      var h = kh + PH;
      //print("DF: "+name+" kw="+kw+" h="+h);
      //proof(kw,h);
  }
  
  translate(-x0,-y0);
  
  return rows
}

function getMaxOfArray(arr) {
  if( !arr || arr.length==0 ) return 0;
  return Math.max.apply(null, arr);
}
  
function draw_children(x0,y0,clr,set){
  
  if( !set || set.length == 0 ) return[0];
  
  if( set.length == 3 ) trace_on = true;
  
  translate(x0,y0)
  
        stroke(clr);
      
        var c_x_last;
        var c_x = 0;
        var accum = [];
        //trace( "DC: length = "+set.length);
        for( var k=0; k<set.length; k++ ){
          var rows = draw_family(c_x,CVS,BLUE,set[k]);

          stroke(RED)
          // draw upper part of connector
          if( k == 0 ){
            line(c_x+PW/2,0,c_x+PW/2,CVS);
          }
          // draw lower part of connector
          line(c_x+PW/2,CVS/2,c_x+PW/2,CVS);
          
          //trace("DC: k="+k+" children rows = "+rows);
          accum = add_rows(accum,rows);
          //trace("DC: k="+k+" children accum = "+accum);

          c_x_last = c_x;
          c_x += rows[0] + CHS;
        }
      
        // the horizontal child line goes
        // from the mid of first to the last
        // halfway of the vertical spacing
        line(PW/2,CVS/2,c_x_last+PW/2,CVS/2)
       
        // note there is a last item with the zero
        //print("*** accum = "+accum);
        var h = (accum.length-1) * (PH+CVS);
        var w = getMaxOfArray(accum);
        proof( GREEN, w, h );
  
  translate(-x0,-y0);
  
  return accum;
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

function draw_spouses(x0, y0, clr, set){
  
  if( !set || set.count == 0 ) return[0];

  translate(x0,y0);
  
        stroke(clr);
        var x = 0;        // x offset
        for( var i=0; i<set.length; i++ ){
          rect(x, XT, XW, XH); // connector below
          draw_person(x+XW,0,clr,set[i]);
          x += PW + XW; 
        }
  
  translate(-x0,-y0);

  return [x];
}


function xalc_children(set){
  if( !set || set.count == 0 ) return []; // or zeros ?
  // children are a complex "families" with spacers
  var count = set.count;
  var accum = [];
  for( var k=0; k<count; k++ ){
    
    // calculate the positions of the
    var k_rows = calc_family(set[k]);
    
    // slide the new rows over to the right based
    // on the current set of accummulated row widths
    AdjustRowsToRight(k_rows,accum);
    
    // accumulate the new set of rows in to the total
    // accumulated row widths
    AccumulateRowsInto(accum,k_rows);

          accum = add_rows(accum,rows);

          c_x_last = c_x;
          c_x += rows[0] + CHS;
        }
}

function draw_person(x,y,clr,input){
  
  //print("draw person. input = "+input);
  
  var name = input; // use the input as name, unless
  if( typeof input === "object" ) name = input.name;
  
  var txtclr = BLACK;
  if( typeof input === "object" ) txtclr = PINK;

  stroke(clr);
  rect(x, y, PW, PH);
  stroke(txtclr);
  text(name,x+10,y+15);
  return [PW];
}

function draw_frame(wide,deep) {
  stroke(BLUE); noFill();
  rect(0,0,wide,deep);
  textAlign(CENTER);
  text("Kazoku Tree",60,20);
}

function proof(clr,w,h){
  //trace("proof w="+w+" h="+h);
  stroke(clr); noFill();
  rect(0,0,w,h);
}