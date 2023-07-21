import { GameObjectType } from "./enums"
import { GameObject } from "./gameobject"
import { Platform } from "./platform"
import { images } from "./state"
import { Vec2 } from "./v2"

export class Boss extends GameObject {
  size = { width: 100, height: 100 }
  jumpCooldown: number = 0
  jumpCooldownMax: number = 1000
  jumpPower: number = 35
  frictionMultiplier: number = 0.5

  constructor(pos: Vec2, private player: GameObject) {
    super()
    this.pos = pos
    this.type = GameObjectType.Boss
    this.img = images.value.find((i) => i.name === "angryface.png")!.image
    this.color = "#F44"
    this.glowColor = "red"
    this.glowSize = 12
    this.glows = true
    this.isStatic = false
    this.affectedByGravity = true
    this.isCollidable = true
    this.isColliding = false
  }

  tick() {
    if (this.distanceTo(this.player) > 5000) {
      this.deleted = true
      return
    }
    super.tick()
    this.jumpCooldown += 1000 / 60
    if (this.jumpCooldown >= this.jumpCooldownMax && !this.isJumping) {
      this.size.height = 100
      this.jumpCooldown = 0
      this.jump()
    } else if (!this.isJumping && this.size.height > 50) {
      this.size.height -= 1.5
    }
  }

  jump() {
    this.vel.y = -this.jumpPower * 0.75
    this.vel.x =
      this.player.pos.x < this.pos.x
        ? -this.jumpPower * 50
        : this.jumpPower * 50
    this.isJumping = true
  }

  handlePlatformCollision(platform: Platform): void {
    const objBottom = this.pos.y + this.halfSize.height - this.vel.y
    const platformTop = platform.pos.y - platform.halfSize.height
    const magicNumberForPersistentCollisions = 2

    if (
      this.vel.y >= 0 &&
      objBottom - magicNumberForPersistentCollisions <= platformTop
    ) {
      this.pos.y =
        platform.pos.y -
        platform.halfSize.height -
        this.halfSize.height +
        magicNumberForPersistentCollisions

      this.vel.y = 0
      this.isJumping = false
    }
  }
}
