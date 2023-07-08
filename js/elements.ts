import { constants } from "./constants.js"

export const canvas = document.querySelector("canvas") as HTMLCanvasElement
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
canvas.width = constants.screenWidth
canvas.height = constants.screenHeight
