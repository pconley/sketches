function setup() {
  setColors();
  w = 3000; h = 2000;
  createCanvas(w,h);
  noFill();
  noLoop();
}

var PW = 60;    // person width
var PH = 40;    // person height

var CHS = 20;   // child horizontal spaces
var CVS = 40;   // child vertical spacer

var XW = 20;    // spouse connector width
var XH = 10;    // spouse connextor height

function draw(){
  
  var mjo  = {name: "mary jo"}
  var tom = {name: "tom"}
  var claire = {name: "claaare"}
  var ted = {name: "ted"}
  var tim = {name: "tim"}
  var jill = {name: "jill"}
  var aaa  = {name: "aaa", children: ["a","b","c"]}
  var xxx  = {name: "xxx"}
  var matt = {name: "matty"}
  var andrew = {name: "andrew", spouses: ["audrey"], children: ["aaa"]}
  
  var pat = {name: "pat", spouses: ["mary jo"], children: [claire,ted,tim]};
  var ann = {name: "anne", children: [aaa,"bbb"]};
  var jim = {name: "jim", spouses: [jill,xxx], children: [matt,andrew]};
  
  var fams = new Array(pat,ann,jim);
  
  var margin = 10;
  translate(margin,margin);
  
      var padding = [20,20,60,20]; // LRTB
      var dims = draw_graph(fams,padding);
      draw_frame(dims[0],dims[1]);

  translate(-margin,-margin);
  
  proof(BLACK,dims[0] + 2*margin,dims[1] + 2*margin);
}

function draw_graph(fams,padding){
  
  var left = padding[0];
  var right = padding[1];
  var top = padding[2];
  var bottom = padding[3];
  
  translate(left,top);
          
      var x = 0;
      var h = 0;
      var space = 10;
      for( var i=0; i<fams.length; i++ ){
        if( i> 0 ) x += space;
        var dims = draw_family(x,0,CYAN,fams[i]);
        x += dims[0];            // family width
        h = Math.max(h,dims[1]); // family width
      }
      proof(GREEN,x,h);
            
  translate(-left,-top);
  
  return [x+left+right,h+top+bottom]
}

function draw_family(x0,y0,clr,fam){
  
  translate(x0,y0);

  if( typeof fam == "object" ) print("fam obj = "+fam.name);
  else print("fam str = "+fam);

  var ind = draw_person(0,0,CYAN,fam);
  var ind_w = ind[0]; // individual width
  var ind_h = ind[1]; // individual height

  var s_dims = draw_spouses(ind_w,0,RED,fam.spouses);
  var sps_w = s_dims[0]; // spouse width
  var sps_h = s_dims[1]; // spouse height

  /*** the children ***/
  var k_dims = draw_children(0,ind_h,RED,fam.children);
  var kid_w = k_dims[0]; // children width
  var kid_h = k_dims[1]; // children height
  
  var w = Math.max(ind_w+sps_w,kid_w);
  var h = Math.max(ind_h,sps_h)+kid_h;
  
  //proof(w,h);
  
  translate(-x0,-y0);

  return [w,h]
}
  
function draw_children(x0,y0,clr,set){
  
  if( !set || set.count == 0 ) return[0,0];
  
  translate(x0,y0)
  
        stroke(clr);
      
        // draw first child
        var dims = draw_family(0,CVS,BLUE,set[0]);
        var w1 = dims[0];
        var c_x = dims[0];
        var c_h = dims[1];
        // and the first vertical line
        line(PW/2, 0, PW/2, CVS);
        
        // draw the remaing children
        var x_last;
        for( var i=1; i<set.length; i++ ){
          c_x += CHS; // add space to right
          var dims = draw_family(c_x,CVS,BLUE,set[i]);
          var w = dims[0];
          var h = dims[1];
          x_last = c_x; 
      
          // draw lower part of connector
          stroke(RED)
          line(x_last+PW/2,CVS/2,x_last+PW/2,CVS)
            
          c_x += w; // add width of child
          c_h = Math.max(c_h,h);
        }
      
        // the horizontal child line goes
        // from the mid of first to the last
        // halfway of the vertical spacing
        line(PW/2,CVS/2,x_last+PW/2,CVS/2)
       
        //proof( c_x, c_h+CVS );
  
  translate(-x0,-y0);
  
  return [c_x,c_h+CVS];
}

function draw_spouses(x0, y0, clr, set){
  
  if( !set ) return [0,0];
  
  stroke(clr);

  var x = x0;         // x offset
  var h = 0;          // the height
  for( var i=0; i<set.length; i++ ){
    
    // first draw the person
    var dims = draw_person(x+XW,y0,clr,set[i]);
    var wide = dims[0];
    var deep = dims[1];
    
    // connector top (centered)
    var XT = y0+deep/2-XH/2; 
    // draw the connector
    rect(x, XT, XW, XH);
    
    x += wide + XW; 
    h = Math.max(h,deep);
  }
  return [x-x0,h];
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
  return [PW,PH]
}

function draw_frame(wide,deep) {
  stroke(BLUE); noFill();
  rect(0,0,wide,deep);
  textAlign(CENTER);
  text("Kazoku Tree",60,20);
}

function proof(w,h){
  stroke(GREEN); noFill();
  rect(0,0,w,h);
}