var RH = 40;

function Row(x,w){
  this.w = w;
  this.left = x;
  this.right = x+w;
  
  this.shift = function(d){
    this.left += d;
    this.right += d;
  }
  
  this.draw = function(y,clr){
    stroke(clr); fill(clr);
    rect(this.left, y, this.w, RH);
  }
  
  this.tos = function(){
    return "left="+left+" wide="+w;
  }
}
  
function Piece(pairs){

  this.rows = [];
  
  for( var i=0; i<pairs.length; i++ ){
    var row = new Row(pairs[i][0],pairs[i][1]);
    this.rows.push(row);
  }
  
  this.shift = function(d){
    for( var i=0; i<this.rows.length; i++ ) this.rows[i].shift(d);
  }

  this.draw = function(clr){ 
    for( var i=0; i<this.rows.length; i++ ) this.rows[i].draw(i*RH,clr);
  }
  
  this.tos = function(){
    var result = "";
    for( var i=0; i<this.rows.length; i++ ) result += i+": "+this.rows[i].tos();
  }
}
