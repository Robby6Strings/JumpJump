import { constants } from "./constants.js";
export var canvas = document.querySelector("canvas");
export var ctx = canvas.getContext("2d");
canvas.width = constants.screenWidth;
canvas.height = constants.screenHeight;
