import { constants } from "./constants.js"
import { GameObjectType, Shape } from "./enums.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import type { Vec2 } from "./v2"

export class GameObject {
  type: GameObjectType = GameObjectType.Unset
  pos: Vec2 = { x: 0, y: 0 }
  vel: Vec2 = { x: 0, y: 0 }
  speed: number = 3
  maxSpeed: number = 12
  jumpPower: number = 15
  isJumping: boolean = false

  size: { width: number; height: number } = { width: 0, height: 0 }
  get halfSize() {
    return {
      width: this.size.width / 2,
      height: this.size.height / 2,
    }
  }
  color: string = "white"
  shape: Shape = Shape.Rectangle
  img: HTMLImageElement | null = null
  isStatic: boolean = true
  affectedByGravity: boolean = false
  isCollidable: boolean = true
  canLeaveMap: boolean = false

  draw(ctx: CanvasRenderingContext2D, yOffset: number = 0) {
    if (this.img) {
      ctx.drawImage(this.img, this.pos.x, this.pos.y - yOffset, this.size.width, this.size.height)
      return
    }

    ctx.fillStyle = this.color
    ctx.beginPath()

    if (this.shape === Shape.Circle) {
      ctx.arc(this.pos.x, this.pos.y - yOffset, this.halfSize.width, 0, Math.PI * 2)
    } else {
      ctx.roundRect(
        this.pos.x - this.size.width / 2,
        this.pos.y - this.size.height / 2 - yOffset,
        this.size.width,
        this.size.height,
        2
      )
    }

    ctx.fill()
    ctx.closePath()
  }

  tick() {
    this.applyVelocity()
    this.applyGravity()
    this.applyFriction()
  }

  applyFriction() {
    if (this.isStatic) return
    if (this.vel.x > 0) {
      this.vel.x -= constants.friction
      if (this.vel.x < 0) this.vel.x = 0
    } else if (this.vel.x < 0) {
      this.vel.x += constants.friction
      if (this.vel.x > 0) this.vel.x = 0
    }
  }

  applyGravity() {
    if (!this.affectedByGravity || this.isStatic) return
    if (this.pos.y + this.halfSize.height >= constants.screenHeight) {
      this.pos.y = constants.screenHeight - this.halfSize.height
      this.vel.y = 0
      this.isJumping = false
      return
    }
    this.vel.y += constants.gravity
  }

  applyVelocity() {
    if (this.isStatic) return
    if (this.vel.x > this.maxSpeed) this.vel.x = this.maxSpeed
    if (this.vel.x < -this.maxSpeed) this.vel.x = -this.maxSpeed
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    if (!this.canLeaveMap) {
      if (this.pos.x - this.halfSize.width < 0) {
        this.pos.x = this.halfSize.width
        if (this.vel.x < 0) this.vel.x = -this.vel.x * 0.5
      }
      if (this.pos.x + this.halfSize.width > constants.screenWidth) {
        this.pos.x = constants.screenWidth - this.halfSize.width
        if (this.vel.x > 0) this.vel.x = -this.vel.x * 0.5
      }
    }
  }

  handleCollisions(objects: GameObject[]) {
    if (!this.isCollidable) return
    if (this.isStatic) return
    for (const object of objects) {
      if (object === this) continue
      if (!object.isCollidable) continue
      if (!this.isColliding(object)) continue
      this.handleCollision(object)
    }
  }

  handleCollision(object: GameObject) {
    if (this.isStatic || !this.isCollidable) return

    if (this.type === GameObjectType.Player && object.type === GameObjectType.Platform) {
      this.handlePlatformCollision(object as Platform)
    }
  }

  handlePlatformCollision(platform: Platform) {
    if (this.isStatic || !this.isCollidable) return
    if (this.pos.y - this.halfSize.height < platform.pos.y - platform.halfSize.height) {
      if (this.vel.y >= 0) {
        this.pos.y = platform.pos.y - platform.halfSize.height - this.halfSize.height
        this.vel.y = 0
        this.isJumping = false
        if (platform.hasBehaviour(PlatformBehaviour.SuperBounce)) {
          this.vel.y = -this.jumpPower * 2
        } else if (platform.hasBehaviour(PlatformBehaviour.Bounce)) {
          this.vel.y = -this.jumpPower
        }
      }
    } else if (this.pos.y > platform.pos.y + platform.halfSize.height) {
      // this.pos.y = platform.pos.y + platform.halfSize.height + this.halfSize.height
      // this.vel.y = (this.vel.y * -1) / 2
    }
  }

  isColliding(object: GameObject) {
    if (this.shape === Shape.Circle) {
      if (object.shape === Shape.Circle) {
        return this.isCircleCollidingCircle(object)
      }
      return this.isCircleCollidingRectangle(object)
    }
    if (object.shape === Shape.Circle) {
      return this.isCircleCollidingRectangle(object)
    }
    return this.isRectangleCollidingRectangle(object)
  }

  isCircleCollidingCircle(object: GameObject) {
    const distance = Math.sqrt((this.pos.x - object.pos.x) ** 2 + (this.pos.y - object.pos.y) ** 2)
    return distance < this.halfSize.width + object.halfSize.width
  }

  isCircleCollidingRectangle(object: GameObject) {
    const distance = Math.sqrt((this.pos.x - object.pos.x) ** 2 + (this.pos.y - object.pos.y) ** 2)
    return distance < this.halfSize.width + object.halfSize.width
  }

  isRectangleCollidingRectangle(object: GameObject) {
    return (
      this.pos.x - this.halfSize.width < object.pos.x + object.halfSize.width &&
      this.pos.x + this.halfSize.width > object.pos.x - object.halfSize.width &&
      this.pos.y - this.halfSize.height < object.pos.y + object.halfSize.height &&
      this.pos.y + this.halfSize.height > object.pos.y - object.halfSize.height
    )
  }
}
