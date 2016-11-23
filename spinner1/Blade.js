
function Blade(flipped,render,motor){
  var orientation = flipped ? -1 : 1;
  this.draw = function(count,x_start){
    var position = motor();
    rotate(position);
    this.draw_all(count,x_start);
    rotate(-position);
  }
  this.draw_all = function(count,x_offset){ 
    var r_offset = TAU/count;
    for( r=0; r<count; r++ ){
      rotate(r_offset);
      translate(x_offset,0);
      render(orientation); 
      translate(-x_offset,0);
    }
  }
}

function drawComplex(flip){ 
  // a complex blade that appriximate the view that
  // that was the inspiration for this entire project
  beginShape();
    vertex(0, 0);
    vertex(0, flip*10) // a thick base
    bezierVertex(10,flip*25, 30,flip*25, 40,flip*20);
    vertex(40, flip*10);
    bezierVertex(30,flip*20, 10,flip*20, 0,0);
  endShape();
  quad(40,flip*20, 40,flip*10, 70,-60*flip, 70,-50*flip);
  beginShape();
    vertex(70, -60*flip);
    vertex(70, -50*flip);
    bezierVertex(90,-30*flip,  110,0,  120,flip*40);
    bezierVertex(115,0,  100,-30*flip,  70,-60*flip)
  endShape();
}

function drawDiamond(flip){ 
  // a simple diamond shaped blade that extend
  // an offset from the ceneter poit of rotation
  quad(0,0,  40,0,  80,30*flip,  40,30*flip);
}

function drawTriangle(flip){ 
  // simple right triangle
  triangle(0,0,80,0,40,20*flip);
}

function drawSegment(flip){ 
  beginShape();
    vertex(20, 0);
    bezierVertex(80,0,       80,75*flip,  30,75*flip);
    bezierVertex(50,80*flip, 60,25*flip,  20,0);
  endShape();
}

