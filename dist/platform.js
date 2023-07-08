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
import { GameObjectType } from "./enums.js";
import { GameObject } from "./gameobject.js";
var Platform = /** @class */ (function (_super) {
    __extends(Platform, _super);
    function Platform(_a) {
        var pos = _a.pos, size = _a.size;
        var _this = _super.call(this) || this;
        _this.type = GameObjectType.Platform;
        _this.pos = pos;
        _this.size = size;
        _this.color = "green";
        _this.isStatic = true;
        _this.canLeaveMap = true;
        return _this;
    }
    return Platform;
}(GameObject));
export { Platform };
