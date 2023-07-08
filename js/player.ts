import { constants } from "./constants.js"
import { GameObjectType } from "./enums.js"
import { game } from "./game.js"
import { GameObject } from "./gameobject.js"

export class Player extends GameObject {
  constructor() {
    super()
    this.type = GameObjectType.Player
    this.size.width = 50
    this.size.height = 50
    this.pos.x = constants.screenWidth / 2
    this.pos.y = constants.screenHeight - this.halfSize.height
    this.isStatic = false
    this.affectedByGravity = true
    this.color = "#69c"
  }

  tick(): void {
    let tempWidth = 50
    // if (this.pos.y === constants.screenHeight - this.halfSize.height) {

    // }
    const absVelX = Math.abs(this.vel.x)
    if (absVelX > 0) {
      this.size.height = Math.min(50, 50 - Math.abs(this.vel.x) / 2)
      tempWidth = tempWidth + (50 - this.size.height)
    }

    if (this.vel.y < 0 && this.isJumping) {
      this.size.width = Math.min(tempWidth, tempWidth - Math.abs(this.vel.y) / 1.5)
    } else {
      this.size.width = tempWidth
    }

    this.handleInputs()
    super.tick()
  }

  draw(ctx: CanvasRenderingContext2D, yOffset?: number): void {
    super.draw(ctx, yOffset)
  }

  handleInputs(): void {
    if (game.playerInputs.left) {
      this.vel.x -= this.speed
    }
    if (game.playerInputs.right) {
      this.vel.x += this.speed
    }
    if (game.playerInputs.up && !this.isJumping) {
      if (this.vel.y > 0) this.vel.y = 0
      this.vel.y -= this.jumpPower
      this.isJumping = true
    }
  }
}
