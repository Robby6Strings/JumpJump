import { ctx } from "./elements.js";
import { constants } from "./constants.js";
import { game } from "./game.js";
var frameRef = null;
function main() {
    loop();
    frameRef = requestAnimationFrame(main);
}
function stop() {
    if (frameRef) {
        cancelAnimationFrame(frameRef);
        frameRef = null;
    }
}
function loop() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, constants.screenWidth, constants.screenHeight);
    game.tick();
    for (var _i = 0, _a = game.objects; _i < _a.length; _i++) {
        var object = _a[_i];
        object.draw(ctx);
    }
}
main();
