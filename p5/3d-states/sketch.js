function preload() {
  set_global_colors();
}

function get_current_position(speed, origin, orbit, tilt=0){
  orbital_angle = speed * millis()/1000
  polar = orbital_angle % TWO_PI; // polar angle, in radians (zero is up)
  azimu =	PI/2 + tilt * sin(orbital_angle);  // azimuthal angle; PI/2 is a flat orbit
  position = p5.Vector.fromAngles(azimu, polar, orbit); 
  position.add(origin);
  return position;
}

class Body {
  constructor(size, colors, rotation=0, tilt=0){
    this.size = size;
    this.tilt = tilt;
    this.colors = colors;
    this.rotation = rotation;
  }

  display(origin){
    push();
      const [f_color,s_color] = this.colors;
      f_color ? fill(f_color) : noFill();
      stroke(s_color);
      translate(origin);
      rotateX(-this.tilt);
      rotateY(this.rotation *(millis() / 10000));
      sphere(this.size);
    pop();
  }
}

class System {
  constructor(members) {
    this.members = members;
  }

  add_thing(thing, orbit, speed=1, tilt=0) {
    // thing can be system or body
    const member = {thing: thing, orbit: orbit, speed: speed, tilt: tilt}
    this.members.push(member);
  }

  display(origin) {
    push();
      const center = get_current_position(this.speed, origin, this.orbit, this.tilt)
      this.members.forEach((member)=>{
        const member_pos = get_current_position(member.speed, center, member.orbit, member.tilt)
        member.thing.display(member_pos)
      });
    pop();
  }
}

function setup_buttons() {
  button = createButton('zoom-');
  button.position(10, 20);
  button.mousePressed(function(){zoom/=1.1;});

  button = createButton('zoom+');
  button.position(60, 20);
  button.mousePressed(function(){zoom*=1.1;});

  button = createButton('faster');
  button.position(10, 40);
  button.mousePressed(function(){speed*=1.1;});

  button = createButton('slower');
  button.position(60, 40);
  button.mousePressed(function(){speed/=1.1;});
}

function setup() {
  zoom = 1.0
  speed = 1.0
  origin = createVector(0, 0, 0)
  createCanvas(800, 600, WEBGL);
  setup_buttons();

  m1 = new Body(5, [GRAY,GRAY])
  m2 = new Body(10, [GRAY,BLACK])
  sol = new Body(80, [YELLOW, BLACK], rotation=5, tilt=PI/4)
  mars = new Body( 30, [RED, BLACK])
  earth = new Body(40, [GREEN, WHITE])

  earth_system = new System([
    {thing:earth, orbit:0, speed:0, tilt:0},
    {thing:m1, orbit:40, speed:2, tilt:0},
    {thing:m2, orbit:55, speed:3, tilt:0}
  ]);

  solar_system = new System([
    {thing:sol, orbit:0, speed:0,tilt:0},
    {thing:mars, orbit:120, speed:2, tilt:0.3},
    {thing:earth_system, orbit:200, speed:1, tilt:0}
  ]);

  ellipseMode(CENTER)
}

function draw() {
  background(200); // clear page
  orbitControl(); // drag and zoom 

  //move your mouse to change light direction
  // let dirX = (mouseX / width - 0.5) * 2;
  // let dirY = (mouseY / height - 0.5) * 2;
  // directionalLight(250, 250, 250, -dirX, -dirY, -1);

  scale(zoom) 
  solar_system.display(origin)
  if( frameCount > 5000 ) noLoop();
}
