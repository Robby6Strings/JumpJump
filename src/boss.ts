import { GameObjectType } from "./enums"
import { GameObject } from "./gameobject"
import { Platform } from "./platform"
import { images } from "./state"

export class Boss extends GameObject {
  size = { width: 100, height: 100 }
  onKilledFunc: { (): void } | null = null
  platforms: Platform[] = []
  currentPlatform: number = 0
  jumpCooldown: number = 0
  jumpCooldownMax: number = 1250
  jumpPower: number = 35
  frictionMultiplier: number = 0.5

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

  tick() {
    super.tick()
    this.jumpCooldown += 1000 / 60
    if (this.jumpCooldown >= this.jumpCooldownMax) {
      this.jumpCooldown = 0
      this.jump()
    }
  }

  jump() {
    let nextPlatformIndex = this.currentPlatform + Math.floor(Math.random() * 2)
    if (nextPlatformIndex >= this.platforms.length) nextPlatformIndex = 0
    if (nextPlatformIndex < 0) nextPlatformIndex = 0
    this.currentPlatform = nextPlatformIndex
    this.vel.y = -this.jumpPower * 0.75
    this.vel.x =
      this.platforms[this.currentPlatform].pos.x < this.pos.x
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

  onKilled(func: { (): void }) {
    this.onKilledFunc = func
  }
}
