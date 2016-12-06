function setColors(){
  RED    = color(255,0,0)
 	CYAN   = color(0,255,255)
 	BLUE   = color(21, 125, 236);
 	PINK   = color(252, 108, 133);
 	GREEN  = color(0,255,0);
 	YELLOW = color(255,255,0)
 	BLACK  = 0;
  WHITE  = 255;
  GRAY   = 125;
  ORANGE = 204;
}

// simple drawing utility
function offset(x,y,code){
  translate(x,y);
  code();
  translate(-x,-y);
}

// functions to use with reduce
function sumOf(a,b){ return a+b; }
function maxOf(a,b){ return Math.max(a,b); }

// general utils

function countOf(arr){ var cnt=0; if(arr) cnt=arr.length; return cnt; }

function ifdef(x,v) { 
  if(typeof x == "undefined") return v;
  return x; 
}
