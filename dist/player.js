var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { constants } from "./constants.js";
import { GameObjectType } from "./enums.js";
import { game } from "./game.js";
import { GameObject } from "./gameobject.js";
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.type = GameObjectType.Player;
        _this.size.width = 50;
        _this.size.height = 50;
        _this.pos.x = constants.screenWidth / 2;
        _this.pos.y = constants.screenHeight - _this.size.height / 2;
        _this.isStatic = false;
        _this.affectedByGravity = true;
        return _this;
    }
    Player.prototype.tick = function () {
        this.handleInputs();
        _super.prototype.tick.call(this);
    };
    Player.prototype.handleInputs = function () {
        if (game.playerInputs.left) {
            this.vel.x -= this.speed;
        }
        if (game.playerInputs.right) {
            this.vel.x += this.speed;
        }
        if (game.playerInputs.up && !this.isJumping) {
            this.vel.y -= this.jumpPower;
            this.isJumping = true;
        }
    };
    return Player;
}(GameObject));
export { Player };
