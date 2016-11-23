function Bar(val1,val2,ndx,color) {
  
  var dir = (val1 < val2) ? 1 : -1;

  var bar_width = 30;
  var bar_space = 10;
  
  var bar_left = ndx * (bar_width + bar_space);
  var bar_right = bar_left+bar_width;
  
  this.pixels = abs(val2-val1);

  this.draw = function(p2,drawer){
    //if( color == WHITE ) p2 = this.pixels;
    return drawer(bar_left,bar_right,val1,val2,val1+dir*p2,color);
  }
  
}
