import { constants } from "./constants.js"
import { GameObject } from "./gameobject.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import { Player } from "./player.js"
import { Camera } from "./camera.js"
import { GameObjectType } from "./enums.js"

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
  maxSection: number
  isGameOver: boolean = false
  constructor() {
    this.player = new Player()
    this.objects = [
      this.player,
      new Platform({
        size: { width: 250, height: 20 },
        pos: { x: 200, y: constants.screenHeight - 120 },
        behaviours: [PlatformBehaviour.Bounce, PlatformBehaviour.MovesX],
      }),
    ]
    this.camera = new Camera(this.player)
    this.maxSection = 1
    this.generateNextSection()
  }

  set section(index: number) {
    if (index <= this.maxSection) {
      if (index === this.maxSection - 3) {
        this.onGameOver()
      }
      return
    }
    this.maxSection = index
    this.generateNextSection()
  }

  onGameOver() {
    if (this.isGameOver) return
    this.isGameOver = true
    setTimeout(() => {
      game = new Game()
    }, 1000)
  }

  tick() {
    this.handleCollisions()
    for (const object of this.objects) {
      object.tick()
    }
    this.camera.tick()
    this.score = 0
    this.score = Math.floor(
      Math.abs(this.player.pos.y - constants.screenHeight + this.player.halfSize.height) / 50
    )
    this.section = Math.abs(Math.floor(this.player.pos.y / constants.sectionHeight)) + 1
  }

  generateNextSection() {
    const platforms = []
    const platformCount = 3
    const areaWidth = constants.screenWidth / platformCount

    if (this.maxSection > 2) {
      if (this.maxSection % 2 === 0) {
        if (this.maxSection === 4) {
          // delete our starter platform
          const platform = this.objects.find((o) => o.type === GameObjectType.Platform)!
          this.objects.splice(this.objects.indexOf(platform), 1)
        }

        // find the first 3 platforms in the objects array and delete them
        for (let i = 0; i < platformCount * 2; i++) {
          const platform = this.objects.find((o) => o.type === GameObjectType.Platform)
          if (platform) {
            this.objects.splice(this.objects.indexOf(platform), 1)
          }
        }
      }
    }

    for (let i = 0; i < platformCount; i++) {
      const heightVariance = 100

      platforms.push(
        Platform.randomPlatform({
          x: Math.random() * (i + 1) * areaWidth,
          y:
            constants.sectionHeight -
            this.maxSection * constants.sectionHeight +
            Math.random() * heightVariance -
            heightVariance / 2,
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

export let game = new Game()
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
