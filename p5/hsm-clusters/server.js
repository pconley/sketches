const SERVER_WIDTH = 100;
const SERVER_HEIGHT = 200;
const HSM_PER_SERVER = 10
const HSM_HEIGHT = SERVER_HEIGHT / HSM_PER_SERVER;

class Zone {
    constructor(name, color_string) {
        this.name = name;
        this.color_string = color_string;
        console.log("Zone", name, color_string, this.color);
        this.color = color(color_string);
        this.start = 0;
        this.stop = 0;
        this.servers = [];
        this.draw = (x,y,radius, c=RED) =>{
            stroke(this.color); noFill();
            arc( x, y, 2*radius, 2*radius, this.start, this.stop);
        }
    }
}

class Hsm {
    constructor(_name, _color="white") {
        const color = COLORS[_color]; 
        this.name = _name;
        this.current_top = 0; 
        this.position = 0; // position on the arc in radians
        this.draw = (_left, _top, _width, _height) => {
            // we want to end up at the target top, but
            // get there over time from the current_top
            const target_top = _top;
            const drop_speed = 3 // pixels per frame
            this.current_top = Math.min(
                target_top, 
                this.current_top+drop_speed
            );
            stroke(color); fill(color);
            rect(_left, this.current_top, _width, _height);
            stroke(BLACK); fill(BLACK);
            textAlign(CENTER);
            text(this.name, _left + _width / 2, this.current_top+3+HSM_HEIGHT/2);
        };
    }
}

class Cluster {
    constructor(_name) {
        this.name = _name;
        this.hsms = [];
        this.add_hsm = (hsm) => {
            this.hsms.push(hsm);
        }
        // draw?
    }
};

class Server {
    constructor(name, zone, color_string='yellow') {
        this.name = name;
        this.zone = zone;
        this.color_string = color_string;
        this.color = color(color_string);
        console.log("Server", name, color_string, this.color);
        this.hsms = [];
        this.start = 0;
        this.stop = 0;
        this.add_hsm = (hsm) => {
            this.hsms.push(hsm);
        }
        this.draw = (x,y,radius,c) => {
            // console.log("draw server", this.name, radius, this.start, this.stop, this.color_string);
            stroke(this.color); noFill();
            arc( x, y, 2*radius, 2*radius, this.start, this.stop);
        };
        var draw_name = function (left, top, w, h, color='red') {
            textSize(16);
            const c = COLORS[color]
            stroke(c); fill(c);
            textAlign(CENTER);
            text(this.name, left + w / 2, top + 30);
        };
    }
}
