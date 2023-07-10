import { constants } from "./constants.js"
import { Player } from "./player.js"

export class Camera {
  maxDistance: number = constants.screenHeight / 2
  offsetY: number = 0
  targetY: number = 0

  constructor(private player: Player) {}

  tick() {
    this.targetY = this.player.pos.y
    if (this.targetY > constants.screenHeight / 2) {
      // player is at start
      this.targetY = constants.screenHeight / 2
    }
    this.lerpToTarget()
  }
  lerpToTarget() {
    const target = this.targetY - constants.screenHeight / 2
    const diff = target - this.offsetY
    this.offsetY += diff * 0.15
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red"
    const playerOffset = this.player.pos.y
    ctx.fillRect(constants.screenWidth / 2 - 2, playerOffset - this.offsetY - 2, 4, 4)
  }
}
