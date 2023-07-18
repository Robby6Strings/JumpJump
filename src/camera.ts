import { constants } from "./constants.js"
import { Player } from "./player.js"

export class Camera {
  maxDistance: number = constants.screenHeight / 2
  offsetY: number = 0
  offsetX: number = 0
  targetY: number = 0
  targetX: number = 0

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
    const targetY = this.targetY - constants.screenHeight / 2
    const diff = targetY - this.offsetY
    this.offsetY += diff * 0.15

    const targetX = this.targetX - constants.screenWidth / 2
    const diffX = targetX - this.offsetX
    this.offsetX += diffX * 0.15
  }
}
