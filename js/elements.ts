import { constants } from "./constants.js"

export const canvas = document.getElementById("game") as HTMLCanvasElement
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
canvas.width = constants.screenWidth
canvas.height = constants.screenHeight

export const bgCanvas = document.getElementById("bg") as HTMLCanvasElement
export const bgCtx = bgCanvas.getContext("2d") as CanvasRenderingContext2D
bgCanvas.width = constants.screenWidth
bgCanvas.height = constants.screenHeight
