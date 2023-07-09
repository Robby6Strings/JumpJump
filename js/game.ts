import { constants } from "./constants.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import { IItem, Item } from "./item.js"
import { Player } from "./player.js"
import { Camera } from "./camera.js"
import { ItemType } from "./enums.js"

export class Game {
  camera: Camera
  score: number = 0
  player: Player
  platforms: Platform[] = []
  items: Item[] = []
  maxSection: number
  isGameOver: boolean = false
  constructor(private _onGameOver: () => void) {
    this.player = new Player()
    this.platforms = [
      new Platform({
        size: { width: 250, height: 20 },
        pos: { x: 200, y: constants.screenHeight - 120 },
        behaviours: [PlatformBehaviour.Bounce, PlatformBehaviour.MovesX],
      }),
    ]
    this.items = []
    this.camera = new Camera(this.player)
    this.maxSection = 1
    this.generateNextSection()
  }

  set section(index: number) {
    if (index <= this.maxSection) {
      if (index === this.maxSection - 6) {
        this.onGameOver()
      }
      return
    }
    this.maxSection = index
    this.generateNextSection()
  }

  removeItem(item: IItem) {
    this.items.splice(this.items.indexOf(item as any), 1)
  }

  onGameOver() {
    if (this.isGameOver) return
    this.isGameOver = true
    setTimeout(() => {
      this._onGameOver()
    }, 1000)
  }

  tick() {
    this.handleCollisions()
    for (const platform of this.platforms) {
      platform.tick()
    }
    for (const item of this.items) {
      item.tick()
    }
    this.player.tick()
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

    if (this.maxSection > 4) {
      if (this.maxSection % 4 === 0) {
        if (this.maxSection === 4) {
          // delete our starter platform
          this.platforms.shift()
        }

        this.platforms.splice(0, platformCount * 4)
      }
    }

    for (let i = 0; i < platformCount; i++) {
      const heightVariance = 100
      const x = Math.random() * (i + 1) * areaWidth
      const y =
        constants.sectionHeight -
        this.maxSection * constants.sectionHeight +
        Math.random() * heightVariance -
        heightVariance / 2

      // chance to spawn a coin above the platform
      if (Math.random() > 0.5) {
        this.items.push(new Item({ x, y: y - 50 }, ItemType.Coin))
      }
      platforms.push(Platform.randomPlatform({ x, y }))
    }
    this.platforms.push(...platforms)
  }

  handleCollisions() {
    this.player.handleCollisions(this.platforms)
    this.player.handleCollisions(this.items)
  }
}
