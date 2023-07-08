import { constants } from "./constants.js";
import { Platform } from "./platform.js";
import { Player } from "./player.js";
var Game = /** @class */ (function () {
    function Game() {
        this.objects = [];
        this.playerInputs = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false,
        };
        this.objects = [
            new Player(),
            new Platform({
                size: { width: 200, height: 20 },
                pos: { x: 100, y: constants.screenHeight - 120 },
            }),
            new Platform({
                size: { width: 200, height: 20 },
                pos: {
                    x: constants.screenWidth - 100,
                    y: constants.screenHeight - 120,
                },
            }),
            new Platform({
                size: { width: 200, height: 20 },
                pos: { x: 200, y: constants.screenHeight - 260 },
            }),
        ];
    }
    Game.prototype.tick = function () {
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var object = _a[_i];
            object.tick();
        }
        this.handleCollisions();
    };
    Game.prototype.handleCollisions = function () {
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var object = _a[_i];
            object.handleCollisions(this.objects);
        }
    };
    return Game;
}());
export { Game };
export var game = new Game();
window.addEventListener("keydown", function (e) {
    switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
            game.playerInputs.left = true;
            break;
        case "arrowright":
        case "d":
            game.playerInputs.right = true;
            break;
        case "arrowup":
        case "w":
            game.playerInputs.up = true;
            break;
        case "arrowdown":
        case "s":
            game.playerInputs.down = true;
            break;
        case " ":
            game.playerInputs.space = true;
            break;
    }
});
window.addEventListener("keyup", function (e) {
    switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
            game.playerInputs.left = false;
            break;
        case "arrowright":
        case "d":
            game.playerInputs.right = false;
            break;
        case "arrowup":
        case "w":
            game.playerInputs.up = false;
            break;
        case "arrowdown":
        case "s":
            game.playerInputs.down = false;
            break;
        case " ":
            game.playerInputs.space = false;
            break;
    }
});
