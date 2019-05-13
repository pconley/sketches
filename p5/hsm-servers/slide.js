function Slide(_title) {
  
  var title = _title;
  
  this.draw_header = function(){
    var header_margin = 40;
    textSize(32); fill(RED);
    textAlign(CENTER);
    text(title, width/2, header_margin);
    textAlign(LEFT);
    return header_margin;
  }
  
}
