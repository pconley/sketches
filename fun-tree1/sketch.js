function setup() {
  setColors();
  var w = 3000; var h = 2000;
  createCanvas(w,h);
  noFill();
  noLoop();
}

function draw() {
  
  stroke(RED);
  rect(10, 20, 30, 40);
  
  const nextCharFromNumberString = str => {
    const trimed = str.trim();
    const number = parseInt(trimed);
    const nextNumber = number + 1;
    return String.fromCharCode(nextNumber);
  }
  
  console.log( nextCharFromNumberString("  64  "));
}