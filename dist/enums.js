export var Shape;
(function (Shape) {
    Shape[Shape["Rectangle"] = 0] = "Rectangle";
    Shape[Shape["Circle"] = 1] = "Circle";
})(Shape || (Shape = {}));
export var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
export var GameObjectType;
(function (GameObjectType) {
    GameObjectType[GameObjectType["Unset"] = 0] = "Unset";
    GameObjectType[GameObjectType["Player"] = 1] = "Player";
    GameObjectType[GameObjectType["Platform"] = 2] = "Platform";
})(GameObjectType || (GameObjectType = {}));
