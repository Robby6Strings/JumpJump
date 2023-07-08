import { constants } from "./constants.js"
import { GameObject } from "./gameobject.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import { Player } from "./player.js"
import { Camera } from "./camera.js"

export class Game {
  objects: GameObject[] = []
  camera: Camera
  playerInputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  }
  score: number = 0
  player: Player
  sectionIndex: number
  constructor() {
    this.player = new Player()
    this.objects = [
      this.player,
      new Player(),
      new Platform({
        size: { width: 200, height: 20 },
        pos: {
          x: 100,
          y: constants.screenHeight - 120,
        },
        behaviours: [PlatformBehaviour.MovesY],
      }),
      new Platform({
        size: { width: 200, height: 20 },
        pos: {
          x: 500,
          y: constants.screenHeight - 200,
        },
        behaviours: [PlatformBehaviour.MovesY],
      }),

      new Platform({
        size: { width: 200, height: 20 },
        pos: { x: 200, y: constants.screenHeight - 260 },
        behaviours: [PlatformBehaviour.Bounce, PlatformBehaviour.MovesX],
      }),
    ]
    this.camera = new Camera(this.player)
    this.sectionIndex = 0
  }

  set section(index: number) {
    if (index <= this.sectionIndex) return
    this.sectionIndex = index
    this.generateNextSection()
  }

  tick() {
    for (const object of this.objects) {
      object.tick()
    }
    this.handleCollisions()
    this.camera.tick()
    this.score = 0
    const halfScreenHeight = constants.screenHeight / 2
    if (this.player.pos.y < halfScreenHeight) {
      this.score = Math.abs(
        Math.floor(this.player.pos.y - halfScreenHeight / 10)
      )
    }
    this.section =
      Math.abs(Math.floor(this.player.pos.y / constants.screenHeight)) + 1
  }

  generateNextSection() {
    console.log("Generating section", this.sectionIndex)
    const platforms = []
    for (let i = 0; i < 3; i++) {
      platforms.push(
        Platform.randomPlatform({
          x: Math.random() * constants.screenWidth,
          y:
            constants.screenHeight - this.sectionIndex * constants.screenHeight,
        })
      )
    }
    this.objects.push(...platforms)
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
