class Hsm {
    constructor(_color) {
        const color = _color;
        this.draw = (_left, _top, _width, _height) => {
            stroke(YELLOW);
            fill(COLORS[color]);
            rect(_left, _top, _width, _height);
        };
    }
}


class Server {
    constructor(_name, color='yellow') {
        const SERVER_WIDTH = 100;
        const SERVER_HEIGHT = 200;
        const name = _name;
        var hsms = [];
        this.add_hsm = (hsm) => {
            hsms.push(hsm);
        }
        this.draw = (_left, _top) => {
            // console.groupCollapsed("draw server", ip, _left, _top);
            draw_outline(_left, _top, SERVER_WIDTH, SERVER_HEIGHT, color);
            draw_name(_left, _top + height, SERVER_WIDTH, SERVER_HEIGHT, color);
            draw_hsms(_left, _top, SERVER_WIDTH, SERVER_HEIGHT);
            // console.groupEnd();
        };
        var draw_outline = function (left, top, width, height, c) {
            // console.log(c, left, top, width, height)
            stroke(COLORS[c]); noFill();
            rect(left, top, width, height);
        };
        const draw_hsms = (serverLeft, serverTop, serverWidth, serverHeight) => {
            // argument dimensions are those of the server
            const hsm_height = serverHeight / 10;
            for (const h in hsms){
                hsms[h].draw(serverLeft, serverTop + h * hsm_height, serverWidth, hsm_height);
            }
        };
        var draw_name = function (left, top, w, h, color='red') {
            textSize(16);
            fill(COLORS[color]);
            textAlign(CENTER);
            text(name, left + w / 2, top + 30);
        };
    }
}
