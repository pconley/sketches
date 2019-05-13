var BLACK  = 0;
var WHITE  = 255;
var GRAY   = 125;
var ORANGE = 204;
var RED = 0; //color(255,0,0);
var PINK = 0;

var set_global_colors = function(){
  RED    = color(255,0,0)
 	YELLOW = color(255,255,0)
 	GREEN  = color(0,255,0)
 	CYAN   = color(0,255,255)
 	BLUE   = color(21, 125, 236); 
  PINK   = color(252, 108, 133);
   
  COLORS = {
    'red' : RED, 'yellow' : YELLOW, 'white' : WHITE, 'gray' : GRAY,
    'pink' : PINK, 'orange' : ORANGE, 'blue': BLUE, 'green': GREEN
  }
  
}

const get_random_color = () => {
  return color(255*Math.random(), 255*Math.random(), 255*Math.random())
}


// var inside = color(204, 102, 0);
//  var middle = color(204, 153, 0);
//   var outside = color(153, 51, 0);


//var HEADER_COLOR = YELLOW;  

var get_month_text = function(month){
    // expecting a month number 1 - 12
    var index = month - 1;
    var m = index;
    if( index > 11 ) m = 0;  // Jan
    if( index < 0  ) m = 11; // Dec
    var labels = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"];
    return labels[m];
  }
