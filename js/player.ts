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
    this.color = "#ccca"
  }

  get distanceFromGround(): number {
    return constants.screenHeight - this.pos.y - this.halfSize.height
  }

  tick(): void {
    this.handleInputs()
    super.tick()
  }

  handleInputs(): void {
    if (game.playerInputs.left) {
      this.vel.x -= this.speed
    }
    if (game.playerInputs.right) {
      this.vel.x += this.speed
    }
    if (game.playerInputs.up && !this.isJumping) {
      this.vel.y -= this.jumpPower
      this.isJumping = true
    }
  }
}
