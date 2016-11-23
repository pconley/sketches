function dampen(value,frames){
  // dampen will gradually reduce the value to zero until frames
  return value * max(0,1 - frameCount/frames);
}

function accelerator(rate){
  // accel will gradually increase the value returned
  return rate * (frameCount * frameCount)/100;
}

function oscillator(range,rate){
  // returns a value between -range and range
  // this is essentially a frictionless spring
  return range*sin(rate * frameCount);
}

function spring(range,rate,duration){
  // now we simply add friction to dampen the 
  // oscilattor and turn it into a slowing spring
  return dampen(oscillator(range,rate),duration);
}

function constant(rate){
  // returns a constant spin rate; that is, the returned rate keeps
  // time with the changing frame count... so it appears steady
  return rate * frameCount;
}

function stopped(){
  // causes no motion
  return 0;
}