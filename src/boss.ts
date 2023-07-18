import { GameObjectType } from "./enums"
import { GameObject } from "./gameobject"
import { Platform } from "./platform"
import { images } from "./state"

export class Boss extends GameObject {
  size = { width: 100, height: 100 }
  onKilledFunc: { (): void } | null = null
  constructor() {
    super()
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

  onKilled(func: { (): void }) {
    this.onKilledFunc = func
  }
}
