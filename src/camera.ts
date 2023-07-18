import { constants } from "./constants.js"
import { Player } from "./player.js"

export class Camera {
  offsetY: number = 0
  offsetX: number = 0
  targetY: number = 0
  targetX: number = 0
  zoom: number = 1

  get zoomMultiplier() {
    return 1 / this.zoom
  }

  constructor(private player: Player) {}

  tick() {
    this.targetY = this.player.pos.y
    this.targetX = this.player.pos.x
    if (this.targetY > constants.screenHeight / 2) {
      // player is at start
      this.targetY = constants.screenHeight / 2
    }
    this.lerpToTarget()
  }
  lerpToTarget() {
    const targetY =
      this.targetY - (constants.screenHeight / 2) * this.zoomMultiplier
    const diff = targetY - this.offsetY
    this.offsetY += diff * 0.15

    const targetX =
      this.targetX - (constants.screenWidth / 2) * this.zoomMultiplier
    const diffX = targetX - this.offsetX
    this.offsetX += diffX * 0.15
  }
}
