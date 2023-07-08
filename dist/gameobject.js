import { constants } from "./constants.js";
import { GameObjectType, Shape } from "./enums.js";
var GameObject = /** @class */ (function () {
    function GameObject() {
        this.type = GameObjectType.Unset;
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.speed = 5;
        this.maxSpeed = 15;
        this.jumpPower = 15;
        this.isJumping = false;
        this.size = { width: 0, height: 0 };
        this.color = "white";
        this.shape = Shape.Rectangle;
        this.img = null;
        this.isStatic = true;
        this.affectedByGravity = false;
        this.isCollidable = true;
        this.canLeaveMap = false;
    }
    Object.defineProperty(GameObject.prototype, "halfSize", {
        get: function () {
            return {
                width: this.size.width / 2,
                height: this.size.height / 2,
            };
        },
        enumerable: false,
        configurable: true
    });
    GameObject.prototype.draw = function (ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.pos.x, this.pos.y, this.size.width, this.size.height);
            return;
        }
        ctx.fillStyle = this.color;
        if (this.shape === Shape.Circle) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.halfSize.width, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            return;
        }
        ctx.fillRect(this.pos.x - this.size.width / 2, this.pos.y - this.size.height / 2, this.size.width, this.size.height);
    };
    GameObject.prototype.tick = function () {
        this.applyVelocity();
        this.applyGravity();
        this.applyFriction();
    };
    GameObject.prototype.applyFriction = function () {
        if (this.isStatic)
            return;
        if (this.vel.x > 0) {
            this.vel.x -= constants.friction;
            if (this.vel.x < 0)
                this.vel.x = 0;
        }
        else if (this.vel.x < 0) {
            this.vel.x += constants.friction;
            if (this.vel.x > 0)
                this.vel.x = 0;
        }
    };
    GameObject.prototype.applyGravity = function () {
        if (!this.affectedByGravity || this.isStatic)
            return;
        if (this.pos.y + this.halfSize.height >= constants.screenHeight) {
            this.pos.y = constants.screenHeight - this.halfSize.height;
            this.vel.y = 0;
            this.isJumping = false;
            return;
        }
        this.vel.y += constants.gravity;
    };
    GameObject.prototype.applyVelocity = function () {
        if (this.isStatic)
            return;
        if (this.vel.x > this.maxSpeed)
            this.vel.x = this.maxSpeed;
        if (this.vel.x < -this.maxSpeed)
            this.vel.x = -this.maxSpeed;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        if (!this.canLeaveMap) {
            if (this.pos.x - this.halfSize.width < 0) {
                this.pos.x = this.halfSize.width;
                if (this.vel.x < 0)
                    this.vel.x = -this.vel.x;
            }
            if (this.pos.x + this.halfSize.width > constants.screenWidth) {
                this.pos.x = constants.screenWidth - this.halfSize.width;
                if (this.vel.x > 0)
                    this.vel.x = -this.vel.x;
            }
        }
    };
    GameObject.prototype.handleCollisions = function (objects) {
        if (!this.isCollidable)
            return;
        if (this.isStatic)
            return;
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var object = objects_1[_i];
            if (object === this)
                continue;
            if (!object.isCollidable)
                continue;
            if (!this.isColliding(object))
                continue;
            this.handleCollision(object);
        }
    };
    GameObject.prototype.handleCollision = function (object) {
        if (this.isStatic || !this.isCollidable)
            return;
        if (!object.isCollidable)
            return;
        if (this.isJumping && object.type === GameObjectType.Platform) {
            this.isJumping = false;
        }
        if (object.type === GameObjectType.Platform) {
            this.handlePlatformCollision(object);
        }
    };
    GameObject.prototype.handlePlatformCollision = function (object) {
        if (this.isStatic || !this.isCollidable)
            return;
        if (!object.isCollidable)
            return;
        if (this.pos.y < object.pos.y) {
            this.pos.y = object.pos.y - object.halfSize.height - this.halfSize.height;
            this.vel.y = 0;
            this.isJumping = false;
        }
        else if (this.pos.y > object.pos.y) {
            this.pos.y = object.pos.y + object.halfSize.height + this.halfSize.height;
            this.vel.y = 0;
        }
    };
    GameObject.prototype.isColliding = function (object) {
        if (this.shape === Shape.Circle) {
            if (object.shape === Shape.Circle) {
                return this.isCircleCollidingCircle(object);
            }
            return this.isCircleCollidingRectangle(object);
        }
        if (object.shape === Shape.Circle) {
            return this.isCircleCollidingRectangle(object);
        }
        return this.isRectangleCollidingRectangle(object);
    };
    GameObject.prototype.isCircleCollidingCircle = function (object) {
        var distance = Math.sqrt(Math.pow((this.pos.x - object.pos.x), 2) + Math.pow((this.pos.y - object.pos.y), 2));
        return distance < this.halfSize.width + object.halfSize.width;
    };
    GameObject.prototype.isCircleCollidingRectangle = function (object) {
        var distance = Math.sqrt(Math.pow((this.pos.x - object.pos.x), 2) + Math.pow((this.pos.y - object.pos.y), 2));
        return distance < this.halfSize.width + object.halfSize.width;
    };
    GameObject.prototype.isRectangleCollidingRectangle = function (object) {
        return (this.pos.x - this.halfSize.width < object.pos.x + object.halfSize.width &&
            this.pos.x + this.halfSize.width > object.pos.x - object.halfSize.width &&
            this.pos.y - this.halfSize.height <
                object.pos.y + object.halfSize.height &&
            this.pos.y + this.halfSize.height > object.pos.y - object.halfSize.height);
    };
    return GameObject;
}());
export { GameObject };
