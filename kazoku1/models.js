var PW = 60;    // person width
var PH = 40;    // person height
var CHS = 10;   // child horizontal spaces
var CVS = 40;   // child vertical spacer
var XW = CHS;   // spouse connector width
var XH = 10;    // spouse connector height

function Group(name,set,gen){

  this.set = set || [];
  this.gen = gen || 0;
  this.name = name;
  
  this.rows = [];
  var that = this;
  // calculate the rows based on the person set
  this.set.forEach(function(person){
      person.set_gen(gen);
      var offset = maxOfPartial(that.rows,person.rows);
      if( offset>0 ) offset += CHS;
      person.shiftBox(offset,0);
      that.rows = merge(that.rows,person.rows,false);
  });

  this.shiftBoxes = function(x,y){
    that.set.forEach(function(person){ person.shiftBox(x,y); });
  }

  this.set_gen = function(g){
    this.set.forEach(function(person){ person.set_gen(g); });
  }

  this.draw = function(){
    this.set.forEach(function(person){ person.draw(); });
  };
  
  this.print = function(label){
    print("=== "+label);
    print("=== "+this.name+" group of "+this.set.length+" person");
    print("=== has rows = "+rowsToString(this.rows));
  }
}

function Person(name,spouses,children){

  this.x = 0;
  this.y = 0;
  this.w = PW;
  this.h = PH;
  this.name = name;
  this.generation = 0;
  this.spouses = new Group(name+" spouses",spouses);
  this.children = new Group(name+" children",children); 
  
  // the starting set of rows
  this.rows = [[this.w,this.h]];
  
  //print("~~~ person: "+name+" create c="+this.children.set.length);

  // the children hang directly under the person
  // but only one row lower, so only y needs to change
  if( this.children.set.length > 0 ){
      this.children.shiftBoxes(0,this.h + CVS);
      this.rows = this.rows.concat(this.children.rows);
  }

  // spouses are to the right of the person but
  // on the same row... so only X changes
  if( this.spouses.set.length > 0 ){
    var s_rows = this.spouses.rows;
    var setoff = maxOfPartial(this.rows,s_rows);
    this.spouses.shiftBoxes(setoff+CHS,0);
    this.rows = merge(this.rows,s_rows,false);
  }
  //print("~~~ person: "+this.name+" final rows="+rowsToString(this.rows));

  this.set_pos = function(x,y){ this.x = x; this.y = y; }
  this.shiftBox = function(x,y){ this.x += x; this.y += y; }
  
  this.set_gen =function(g){ 
    this.generation = g; 
    this.spouses.set_gen(g+.5);
    this.children.set_gen(g+1);
  }
    
  this.grands = function(){
    if( !this.children ) return 0;
    // returns the sume of the count of the children's children
    return this.children.set.map(function(c){ return countOf(c.children); }).reduce(sumOf, 0);
  }
  
  this.draw = function(clr){
    //print("person.draw  = "+this.name);
    translate(this.x,this.y);
      this.draw_box(clr);
      this.draw_spouses(BLUE);
      this.draw_children(BLACK);
    translate(-this.x,-this.y);
  }
  
  this.draw_box = function(clr){
    //print("draw box = "+this.name);
    var base = BLACK; if( clr ) base = clr;
    // override the first generation with a color
    var c = base; if (this.generation==0) c=RED;
    stroke(c); // fill(WHITE);
    rect(0, 0, this.w, this.h);
    text(this.name,10,15);
  }

  this.draw_spouses = function(clr){
    if( this.spouses.set.length == 0 ) return;
    var cx = PW; // first connector X
    //print("draw spouses for "+this.name+" at "+cx);
    this.spouses.set.forEach( function(person){
        // draw the connector
        stroke(clr);
        var sx = person.x;
        rect(cx, PH/2-5, sx-cx, 5); 
        cx = sx+PW; // next connector X
        person.draw(clr);
    });
  }

  this.draw_children = function(clr){
    if( this.children.set.length == 0 ) return;
    //print("draw children for "+this.name);
    var mid1, mid;
    this.children.set.forEach(function(child,k){
      mid = child.x+PW/2;
      stroke(RED);
      if( k==0 ){
        mid1 = mid;
        // upper half on the first child
        line(mid,PH,mid,PH+CVS);
      }
      // lower half on every child
      line(mid,PH+CVS/2,mid,PH+CVS);
      child.draw(clr);
    });
    stroke(RED);
    line(mid1,PH+CVS/2,mid,PH+CVS/2);
  }
}

function maxOfPartial(left,right){
  // returns the max width from the left side, based
  // on the depth of the right side so that the right
  // can "fit" into the profile of the left
  var m = Math.min(right.length,left.length);
  var partial = left.slice(0,m);
  return widths(partial).reduce( maxOf, 0 );
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
  if( debug ) print("merge: m = "+m);

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
    if( debug ) print(m+" ? "+i+": lefty = "+lefty+" r_w="+r_w);
    // finally, combine the left and right values
    var w = parseInt(lefty) + parseInt(r_w);
    // and add a spacer as needed
    if( lefty>0 && r_w>0 ) w += CHS;
    
    rows[i] = [w,h];
  }
  // show you work for unit tests
  if( debug ) print("merge: left = "+rowsToString(left));
  if( debug ) print("merge: right = "+rowsToString(right));
  if( debug ) print("merge: result = "+rowsToString(rows));
  return rows;
}

function val(x,n){
  // return the n-th value of the array
  // or a zero if the array does not exist
  var v = 0; if(x && x[n]) v=x[n];
  return v;
}