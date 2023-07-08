import { constants } from "./constants.js"
import { Player } from "./player.js"

export class Camera {
  maxDistance: number = constants.screenHeight / 2
  offsetY: number = 0

  constructor(private player: Player) {}

  tick() {
    const targetY = this.player.pos.y
    const playerOffset = this.player.pos.y
    this.offsetY = 0
    if (targetY < constants.screenHeight / 2) {
      this.offsetY = playerOffset - constants.screenHeight / 2
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red"
    const playerOffset = this.player.pos.y
    ctx.fillRect(constants.screenWidth / 2 - 2, playerOffset - this.offsetY - 2, 4, 4)
  }
}
