import { constants } from "./constants.js"
import { Player } from "./player.js"

export class Camera {
  maxDistance: number = constants.screenHeight / 2
  offsetY: number = 0

  constructor(private player: Player) {}

  tick() {
    const targetY =
      this.player.pos.y +
      this.player.halfSize.height -
      constants.screenHeight / 2

    const distance = targetY - this.offsetY - this.player.size.height
    if (Math.abs(distance) > this.maxDistance - this.player.size.height) {
      this.offsetY += Math.sign(distance) * (this.maxDistance / 20)
    }
  }
}
