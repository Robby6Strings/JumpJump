import { constants } from "./constants.js"
import { GameObjectType, Shape } from "./enums.js"
import { IItem, Item } from "./item.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import type { Vec2 } from "./v2"

export class GameObject {
  type: GameObjectType = GameObjectType.Unset
  pos: Vec2 = { x: 0, y: 0 }
  vel: Vec2 = { x: 0, y: 0 }
  speed: number = 3
  maxSpeed: number = 12
  jumpPower: number = 20
  isJumping: boolean = false
  items: IItem[] = []

  size: { width: number; height: number } = { width: 0, height: 0 }
  get halfSize() {
    return {
      width: this.size.width / 2,
      height: this.size.height / 2,
    }
  }
  color: string = "white"
  glowColor: string = "white"
  glows: boolean = false
  glowSize: number = 10
  shape: Shape = Shape.Rectangle
  img: HTMLImageElement | null = null
  isStatic: boolean = true
  affectedByGravity: boolean = false
  isCollidable: boolean = true
  isColliding: boolean = false
  canLeaveMap: boolean = false

  draw(ctx: CanvasRenderingContext2D, yOffset: number = 0) {
    if (this.glows) {
      ctx.shadowBlur = this.glowSize
      ctx.shadowColor = this.glowColor
    } else {
      ctx.shadowBlur = 0
    }

    if (this.img) {
      ctx.drawImage(
        this.img,
        this.pos.x - this.halfSize.width,
        this.pos.y - yOffset - this.halfSize.height,
        this.size.width,
        this.size.height
      )
      return
    }

    ctx.fillStyle = this.color
    ctx.beginPath()

    if (this.shape === Shape.Circle) {
      ctx.arc(this.pos.x, this.pos.y - yOffset, this.halfSize.width, 0, Math.PI * 2)
    } else {
      ctx.roundRect(
        this.pos.x - this.halfSize.width,
        this.pos.y - this.halfSize.height - yOffset,
        this.size.width,
        this.size.height,
        3
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
    this.isColliding = false

    for (const object of objects) {
      if (object === this) continue
      if (!object.isCollidable) continue
      if (!this.isCollidingWith(object)) continue
      this.isColliding = true
      this.handleCollision(object)
    }
  }

  handleCollision(object: GameObject) {
    if (this.type === GameObjectType.Player) {
      switch (object.type) {
        case GameObjectType.Platform:
          this.handlePlatformCollision(object as Platform)
          break
        case GameObjectType.Item:
          const item = object as Item
          const remove = item.interactWith(this)
          if (remove) {
            item.deleted = true
            item.isCollidable = false
          }
          break
        default:
          break
      }
    }
  }

  addItem(item: IItem) {
    this.items.push(item)
  }

  handlePlatformCollision(platform: Platform) {
    if (this.isStatic || !this.isCollidable) return
    if (
      this.pos.y + this.halfSize.height - this.vel.y <=
      platform.pos.y + platform.halfSize.height
    ) {
      if (this.vel.y >= 0) {
        this.pos.y = platform.pos.y - platform.halfSize.height - this.halfSize.height
        this.vel.y = 0
        this.isJumping = false
        if (platform.hasBehaviour(PlatformBehaviour.SuperBounce)) {
          this.vel.y = -(this.jumpPower * 1.5)
        } else if (platform.hasBehaviour(PlatformBehaviour.Bounce)) {
          this.vel.y = -(this.jumpPower * 0.75)
        }
      }
    } else if (this.pos.y > platform.pos.y + platform.halfSize.height) {
      // this.pos.y = platform.pos.y + platform.halfSize.height + this.halfSize.height
      // this.vel.y = (this.vel.y * -1) / 2
    }
  }

  isCollidingWith(object: GameObject) {
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
    const distance = Math.sqrt(
      Math.pow(object.pos.x - this.pos.x, 2) + Math.pow(object.pos.y - this.pos.y, 2)
    )
    return distance < this.halfSize.width + object.halfSize.width
  }

  isCircleCollidingRectangle(object: GameObject) {
    const circleDistance = {
      x: Math.abs(this.pos.x - object.pos.x),
      y: Math.abs(this.pos.y - object.pos.y),
    }

    if (circleDistance.x > object.halfSize.width + this.halfSize.width) return false
    if (circleDistance.y > object.halfSize.height + this.halfSize.height) return false

    if (circleDistance.x <= object.halfSize.width) return true
    if (circleDistance.y <= object.halfSize.height) return true

    const cornerDistance_sq =
      Math.pow(circleDistance.x - object.halfSize.width, 2) +
      Math.pow(circleDistance.y - object.halfSize.height, 2)

    return cornerDistance_sq <= Math.pow(this.halfSize.width, 2)
  }

  isRectangleCollidingRectangle(object: GameObject) {
    return (
      this.pos.x + this.halfSize.width > object.pos.x - object.halfSize.width &&
      this.pos.x - this.halfSize.width < object.pos.x + object.halfSize.width &&
      this.pos.y + this.halfSize.height > object.pos.y - object.halfSize.height &&
      this.pos.y - this.halfSize.height < object.pos.y + object.halfSize.height
    )
  }
}
