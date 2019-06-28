var factor = 0.13;

var normal = function(v){
  return factor * v;
}

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function Bar(n,i,c,bar_height) {
  this.name = n;
  this.index = i;
  this.color = c;
  this.values = [];
  this.ranks = [];
  var max_so_far = 0;

  this.draw = function(week,pct){
    
    var rank = this.ranks[week];
    var bar_top = bar_height*rank;

    var value = this.values[week];
    max_so_far = Math.max(max_so_far,value);

    var next_week = Math.min(week+1,this.values.length-1);
    var next_value = this.values[next_week];
    var diff = value - next_value;
    var adj_value = value + pct*diff;
    
    var next_rank = this.ranks[next_week];
    var next_base = bar_height*next_rank;
    var y_diff = bar_top - next_base;
    var y_pct = pct * y_diff;
    
    bar_top -= y_pct;
    
    draw_rect(bar_top,bar_height,max_so_far,GRAY);
    draw_rect(bar_top,bar_height,adj_value,this.color);

    textSize(bar_height/2); fill(WHITE);
    var base_line = bar_top+bar_height-3;
    var pos = 70;
    textAlign(RIGHT);
    text(this.values[week].format()+":",pos,base_line-(bar_height/10));
    textAlign(LEFT);
    text(this.name,pos+5,base_line-(bar_height/10));
  }
  
  var draw_rect = function(top,h,v,c){
    rectMode( CORNERS ); fill(c);
    stroke(c);
    var spacer = h/10;
    var right = Math.max(0,normal(v));
    rect(1,top+spacer,right,top+h-spacer);
  }
}
  
function Graph(sheet,params) {
  
  this.bars = [];
  
  var max_value = sheet.get_value_max();
  
  var c_top = params['top'];
  var c_left = params['left'];
  var c_width = params['width'];
  var c_height = params['height'];
  var c_bottom = c_top + c_height;
  
  var legend = 14;
  var g_top = legend-8;
  var g_left = 0;
  var g_width = c_width-40;
  var g_height = c_height-g_top-30;
  print("grid height = "+g_height);
  var g_bottom = g_top + g_height;
  
  var bar_height = g_height/10;

  factor = g_width/max_value;
  
  // create a bar for each customer
  for (var name in sheet.customers){
    var special = name == "XPO" || name == "Soreo In Home Support Services, LLC.";
    var hue = special ? PINK : BLUE;
    var cust_index = sheet.get_index(name);
    var bar = new Bar(name,cust_index,hue,bar_height);
    this.bars.push(bar);
    // copy values and ranks into the bar
    // for each week in the data sheet
    for( var w=0; w<sheet.week_count; w++ ){
      bar.values[w] = sheet.get_value(w,cust_index);
      bar.ranks[w] = sheet.get_rank(w,cust_index);
    }
  }
  
  this.draw = function(n,w,pct){
    //draw_outline(c_left, c_top, c_width, c_height,YELLOW);
    translate(30, 80);        // set left,top margin
    draw_grid();              // the gray lines
    draw_outline(g_left, g_top, g_width, g_height,GRAY);
    translate( 0, g_top );    // more top margin
    draw_bars(n,w,pct);       // the actual bars
    translate( 0, g_height ); // slide on down
    draw_hider();             // hides stuff moving below grid
    draw_total_bar(w);        // total bar
  }
  
  var draw_hider = function(){
    stroke(BLACK); fill(BLACK);
    rect(0, 1, g_width, 40);
  }
  
  var max_grand_so_far = 0;
  
  var draw_total_bar = function(w){
    var top = 10;
    var left = 0;
    var bottom = (g_height/10);
    var g_max = sheet.get_grand_max();

    var total = sheet.get_total(w)
    var grand = sheet.get_grand(w)
    max_grand_so_far = Math.max(max_grand_so_far,grand);
    
    draw_bottom_rect(max_grand_so_far,PINK,"");
    draw_bottom_rect(grand,GRAY,grand.format());

    var total_width = g_width * (total/g_max)
    
    var pct = Math.round( 100*total/grand );
    var label = total.format()+" ("+pct+"%)";
    draw_bottom_rect(total,WHITE,label);

    var pct = Math.round( 100*total/grand );
    fill(BLACK);
    text("Total Top 10", left+5, bottom-4);
  }
  
  var draw_bottom_rect= function(value,color,txt){
    var top = 10;
    var left = 0;
    var g_max = sheet.get_grand_max();
    var width = g_width * (value/g_max)
    var bottom = (g_height/10);
    stroke(color); fill(color);
    rect(left, top, left+width, bottom);
    
    fill(color == WHITE ? BLACK : WHITE);
    var w = textWidth(txt);
    textAlign(RIGHT);
    text(txt,width-5,bottom-4);
    textAlign(LEFT);
  }
  
  var draw_outline = function(left, top, width, height,c){
    stroke(c); noFill();
    rect(left, top, width, height);
  }
  
  var draw_bars = function(n,w,pct){
    graph.bars.forEach(function(bar, index, array){
      // display only the top N ranked bars
      next_week = min(w+1,sheet.week_count-1);
      var rank = min(bar.ranks[w],bar.ranks[next_week])
      if( rank < n ) {
        bar.draw(w,pct);
      }
    });
  }
  
  var draw_grid = function(){
    textSize(legend);
    fill(GRAY);
    stroke(GRAY);
    var biggie = 0;
    for( var v=500; normal(v)<=g_width; v+= 500){
      var p = normal(v);
      biggie = Math.max(p,biggie);
      text(v, p-15, 0);
      line(p, g_top-2, p, g_bottom);
    }
  }
}
