import { constants } from "./constants.js"
import { GameObject } from "./gameobject.js"
import { Platform } from "./platform.js"
import { Player } from "./player.js"

export class Game {
  objects: GameObject[] = []
  playerInputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  }
  constructor() {
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
    ]
  }

  tick() {
    for (const object of this.objects) {
      object.tick()
    }
    this.handleCollisions()
  }

  handleCollisions() {
    for (const object of this.objects) {
      object.handleCollisions(this.objects)
    }
  }
}

export const game = new Game()
window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "arrowleft":
    case "a":
      game.playerInputs.left = true
      break
    case "arrowright":
    case "d":
      game.playerInputs.right = true
      break
    case "arrowup":
    case "w":
      game.playerInputs.up = true
      break
    case "arrowdown":
    case "s":
      game.playerInputs.down = true
      break
    case " ":
      game.playerInputs.space = true
      break
  }
})

window.addEventListener("keyup", (e) => {
  switch (e.key.toLowerCase()) {
    case "arrowleft":
    case "a":
      game.playerInputs.left = false
      break
    case "arrowright":
    case "d":
      game.playerInputs.right = false
      break
    case "arrowup":
    case "w":
      game.playerInputs.up = false
      break
    case "arrowdown":
    case "s":
      game.playerInputs.down = false
      break
    case " ":
      game.playerInputs.space = false
      break
  }
})
