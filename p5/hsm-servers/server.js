class Hsm {
    constructor(_arrivalFrameCount,_color="white") {
        const color = COLORS[_color]; 
        this.arrival = _arrivalFrameCount;
        this.draw = (_left, _top, _width, _height) => {
            stroke(color); fill(color);
            rect(_left, _top, _width, _height);
        };
    }
}

class Server {
    constructor(_name, color='yellow') {
        const SERVER_WIDTH = 100;
        const SERVER_HEIGHT = 200;
        const HSM_PER_SERVER = 10
        const HSM_HEIGHT = SERVER_HEIGHT / HSM_PER_SERVER;

        const name = _name;
        var hsms = [];
        this.add_hsm = (hsm) => {
            hsms.push(hsm);
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
            for (const h in hsms){
                console.log('hsm_top', hsm_top, hsms[h].arrival)
                hsms[h].draw(serverLeft+2, hsm_top, serverWidth-4, HSM_HEIGHT-2);
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
