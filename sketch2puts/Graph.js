
function Graph(start, data, duration) {
  
  var bars = [];
  var value = start;
  var total_value = value;

  bars.push(new Bar(0,value,0,WHITE));
  for( var i=0; i<data.length; i++ ){
    total_value += abs(data[i][0])+abs(data[i][1]);
    var n = 3*i;
    bars.push(new Bar(value,value+data[i][0],n+1,RED));
    value += data[i][0];
    bars.push(new Bar(value,value+data[i][1],n+2,GREEN));
    value += data[i][1];
    total_value += abs(value);
    bars.push(new Bar(0,value,n+3,WHITE))
  }
  
  var rate = total_value/duration;

  this.draw = function(){
    var baseline = 300;
    translate(0,baseline)
    this.draw_grid(GRAY);
    translate(40,0)
    this.draw_bars();
  }
  
  this.draw_bars = function(){
    rectMode( CORNERS );
    var total_value_left_to_draw = frameCount * rate;
    for( var i=0; i<bars.length && total_value_left_to_draw > 0; i++ ){
      var bar = bars[i];
      var draw_value = min(total_value_left_to_draw,bar.pixels);
      bar.draw(draw_value,this.draw2);
      total_value_left_to_draw -= draw_value;
    }
  }
  
  this.draw_grid = function(color){
    stroke(color); fill(color);
    for( var v=0; v<=200; v+=50 ){ 
      // text(v,0,baseline-v+4);
      // line(22,baseline-v,400,baseline-v);
      text(v,0,4-v);
      line(22,-v,450,-v);
    }
  }
  
  this.draw2 = function(left,right,v1,v2,p2,color){
    var bottom = -v1;
    var final_top = -v2;
    var partial_top = -p2;
 
    noFill(); stroke(CYAN);
    rect(left,final_top,right,bottom);

    fill(color); stroke(color);
    rect(left,partial_top,right,bottom);
  }

  
  this.draw_rect = function(left,right,v1,v2,pct,color){
    
    rectMode( CORNERS );

    var bottom = -v1;           // -80
    var final_top = -v2;        // -130
    var delta = v2-v1           // 50
    var portion = pct * delta;  // 25
    var top = bottom - portion; // -105
    
    noFill(); stroke(CYAN);
    rect(left,final_top,right,bottom);

    //print("v1="+v1+"  v2="+v2+"  pct="+pct+"  bottom="+bottom+"  top="+top+" final="+final_top);
    
    rectMode( CORNERS );
    fill(color); 
    stroke(color);
    rect(left,top,right,bottom);
    
    return abs(bottom-top);
  }
}
  
