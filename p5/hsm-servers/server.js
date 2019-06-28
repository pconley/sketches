const SERVER_WIDTH = 100;
const SERVER_HEIGHT = 200;
const HSM_PER_SERVER = 10
const HSM_HEIGHT = SERVER_HEIGHT / HSM_PER_SERVER;

class Hsm {
    constructor(_name, _color="white") {
        const color = COLORS[_color]; 
        this.name = _name;
        this.current_top = 0; 
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

class Server {
    constructor(_name, color='yellow') {
        // const SERVER_WIDTH = 100;
        // const SERVER_HEIGHT = 200;
        // const HSM_PER_SERVER = 10
        // const HSM_HEIGHT = SERVER_HEIGHT / HSM_PER_SERVER;

        const name = _name;
        this.hsms = [];
        this.add_hsm = (hsm) => {
            this.hsms.push(hsm);
        }
        this.draw = (_left, _top) => {
            //console.groupCollapsed("draw server", name, _left, _top);
            draw_outline(_left, _top, SERVER_WIDTH, SERVER_HEIGHT, color);
            draw_name(_left, _top + SERVER_HEIGHT, SERVER_WIDTH, SERVER_HEIGHT, color);
            draw_hsms(_left, _top, SERVER_WIDTH, SERVER_HEIGHT);
            // console.groupEnd();
        };
        var draw_outline = function (left, top, width, height, c) {
            // console.log("outline", left, top, width, height, c)
            stroke(COLORS[c]); noFill();
            rect(left, top, width, height);
        };
        const draw_hsms = (serverLeft, serverTop, serverWidth, serverHeight) => {
            // we are placing hsms at the bottom of the server
            const server_bottom = (serverTop+serverHeight);
            var hsm_top = server_bottom - HSM_HEIGHT;
            for (const h in this.hsms){
                // console.log('hsm_top', hsm_top, this.hsms[h].arrival)
                this.hsms[h].draw(serverLeft+2, hsm_top, serverWidth-4, HSM_HEIGHT-2);
                hsm_top -= HSM_HEIGHT;
            }
        };
        var draw_name = function (left, top, w, h, color='red') {
            textSize(16);
            const c = COLORS[color]
            stroke(c); fill(c);
            textAlign(CENTER);
            text(name, left + w / 2, top + 30);
        };
    }
}
