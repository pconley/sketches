var BLACK  = 0;
var WHITE  = 255;
var GRAY   = 125;
var ORANGE = 204;

var RED = 0;
var PINK = 0;
var CYAN = 0;
var BLUE = 0;
var GREEN = 0;
var YELLOW = 0;

var set_global_colors = function(){
  RED    = color(255,0,0)
 	CYAN   = color(0,255,255)
 	BLUE   = color(21, 125, 236);
 	PINK   = color(252, 108, 133);
 	GREEN  = color(0,255,0);
 	YELLOW = color(255,255,0)
}

var sum = function(arr){
  var tot = 0;
  for( var i=0; i<arr.length; i++ ) tot += arr[i];
  return tot;
}
