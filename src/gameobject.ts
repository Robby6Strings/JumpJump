import { Signal } from "cinnabun"
import { constants } from "./constants.js"
import { GameObjectType, Shape } from "./enums.js"
import { IItem, Item } from "./item.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import type { Vec2 } from "./v2"
import { Projectile } from "./projectile.js"
import { type Player } from "./player.js"
import { Camera } from "./camera.js"
import { Boss } from "./boss.js"

export class GameObject {
  type: GameObjectType = GameObjectType.Unset
  pos: Vec2 = { x: 0, y: 0 }
  vel: Vec2 = { x: 0, y: 0 }
  speed: number = 3
  maxSpeedX: number = 12
  maxSpeedY: number = 100
  jumpPower: number = 20
  isJumping: boolean = false
  hasJumpBoost: boolean = false
  gravityMultiplier: number = 1
  frictionMultiplier: number = 1
  static speedMultiplier: number = 1
  items: Signal<IItem[]> = new Signal([] as IItem[])

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
  deleted: boolean = false

  shouldDraw(camera: Camera) {
    return (
      this.pos.y + this.size.height >
        camera.offsetY - constants.screenHeight * camera.zoomMultiplier &&
      this.pos.y + this.size.height <
        camera.offsetY + constants.screenHeight * camera.zoomMultiplier * 2
    )
  }

  draw(ctx: CanvasRenderingContext2D, camera: Camera) {
    if (!this.shouldDraw(camera)) return

    const { offsetX, offsetY } = camera
    if (this.glows) {
      ctx.shadowBlur = this.glowSize * camera.zoom
      ctx.shadowColor = this.glowColor
    } else {
      ctx.shadowBlur = 0
    }

    ctx.fillStyle = this.color
    ctx.beginPath()

    if (this.shape === Shape.Circle) {
      ctx.arc(
        (this.pos.x - offsetX) * camera.zoom,
        (this.pos.y - offsetY) * camera.zoom,
        this.halfSize.width * camera.zoom,
        0,
        Math.PI * 2
      )
    } else {
      ctx.roundRect(
        (this.pos.x - this.halfSize.width - offsetX) * camera.zoom,
        (this.pos.y - this.halfSize.height - offsetY) * camera.zoom,
        this.size.width * camera.zoom,
        this.size.height * camera.zoom,
        3
      )
    }

    ctx.fill()
    ctx.closePath()

    if (this.img) {
      ctx.drawImage(
        this.img,
        (this.pos.x - offsetX - this.halfSize.width) * camera.zoom,
        (this.pos.y - offsetY - this.halfSize.height) * camera.zoom,
        this.size.width * camera.zoom,
        this.size.height * camera.zoom
      )
    }
  }

  tick() {
    this.applyVelocity()
    this.applyGravity()
    this.applyFriction()
  }

  applyFriction() {
    if (this.isStatic) return
    if (this.vel.x > 0) {
      this.vel.x -=
        constants.friction *
        this.frictionMultiplier *
        GameObject.speedMultiplier
      if (this.vel.x < 0) this.vel.x = 0
    } else if (this.vel.x < 0) {
      this.vel.x +=
        constants.friction *
        this.frictionMultiplier *
        GameObject.speedMultiplier
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
    this.vel.y +=
      constants.gravity * this.gravityMultiplier * GameObject.speedMultiplier
  }

  applyVelocity() {
    if (this.isStatic) return
    if (this.vel.x > this.maxSpeedX) this.vel.x = this.maxSpeedX
    if (this.vel.x < -this.maxSpeedX) this.vel.x = -this.maxSpeedX
    if (this.vel.y > this.maxSpeedY) this.vel.y = this.maxSpeedY
    if (this.vel.y < -this.maxSpeedY) this.vel.y = -this.maxSpeedY
    this.pos.x += this.vel.x * GameObject.speedMultiplier
    this.pos.y += this.vel.y * GameObject.speedMultiplier
  }

  handleCollisions(objects: GameObject[]) {
    if (!this.isCollidable) return
    if (this.isStatic) return

    this.isColliding = false

    for (const object of objects) {
      if (object === this) continue
      object.isColliding = false
      if (!object.isCollidable) continue
      if (!this.isCollidingWith(object)) continue
      this.isColliding = true
      object.isColliding = true
      this.handleCollision(object)
    }
  }

  handleCollision(object: GameObject) {
    if (this.type === GameObjectType.Player) {
      switch (object.type) {
        case GameObjectType.Boss:
          this.handleBossCollision(object as Boss)

          break
        case GameObjectType.Platform:
          this.handlePlatformCollision(object as Platform)
          break
        case GameObjectType.Item:
          const item = object as Item
          item.interactWith(this)
          break
        case GameObjectType.Projectile:
          const projectile = object as Projectile
          projectile.deleted = true
          if (projectile.statusEffect) {
            ;(this as any as Player).statusEffects.add(projectile.statusEffect)
          }

          break
        default:
          break
      }
    } else if (this.type === GameObjectType.Boss) {
      switch (object.type) {
        case GameObjectType.Platform:
          this.handlePlatformCollision(object as Platform)
          break
        default:
          break
      }
    }
  }

  handleBossCollision(boss: Boss) {
    // rebound the player away
    const angle = this.angleTo(boss)
    const distance = this.distanceTo(boss)
    const reboundDistance = this.halfSize.width + boss.halfSize.width - distance
    this.pos.x += Math.cos(angle) * reboundDistance
    this.pos.y += Math.sin(angle) * reboundDistance
    this.vel.x = Math.cos(angle) * 500
    this.vel.y = Math.sin(angle) * 10
    this.isCollidable = false
    setTimeout(() => {
      this.isCollidable = true
    }, 150)
  }

  addItem(item: IItem) {
    this.items.value.push(item)
    this.items.notify()
  }

  handlePlatformCollision(platform: Platform) {
    if (platform.hasBehaviour(PlatformBehaviour.JumpBoost)) {
      this.hasJumpBoost = true
    }
    const playerTop = this.pos.y - this.halfSize.height - this.vel.y
    const playerBottom = this.pos.y + this.halfSize.height - this.vel.y
    const platformTop = platform.pos.y - platform.halfSize.height
    const platformBottom = platform.pos.y + platform.halfSize.height
    const magicNumberForPersistentCollisions = 2

    if (
      this.vel.y >= 0 &&
      playerBottom - magicNumberForPersistentCollisions <= platformTop
    ) {
      if (platform.hasBehaviour(PlatformBehaviour.DestroyOnTouch)) {
        platform.deleted = true
      }
      this.pos.y =
        platform.pos.y -
        platform.halfSize.height -
        this.halfSize.height +
        magicNumberForPersistentCollisions

      this.vel.y = 0
      this.isJumping = false
      if (platform.hasBehaviour(PlatformBehaviour.MegaBounce)) {
        this.vel.y = -(this.jumpPower * 5)
      } else if (platform.hasBehaviour(PlatformBehaviour.SuperBounce)) {
        this.vel.y = -(this.jumpPower * 1.5)
      } else if (platform.hasBehaviour(PlatformBehaviour.Bounce)) {
        this.vel.y = -(this.jumpPower * 0.75)
      }
    } else if (
      this.vel.y <= 0 &&
      playerTop - magicNumberForPersistentCollisions >= platformBottom
    ) {
      if (platform.hasBehaviour(PlatformBehaviour.NoPassThrough)) {
        this.vel.y = -this.vel.y
      }
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
      Math.pow(object.pos.x - this.pos.x, 2) +
        Math.pow(object.pos.y - this.pos.y, 2)
    )
    return distance < this.halfSize.width + object.halfSize.width
  }

  isCircleCollidingRectangle(object: GameObject) {
    const circleDistance = {
      x: Math.abs(this.pos.x - object.pos.x),
      y: Math.abs(this.pos.y - object.pos.y),
    }

    if (circleDistance.x > object.halfSize.width + this.halfSize.width)
      return false
    if (circleDistance.y > object.halfSize.height + this.halfSize.height)
      return false

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
      this.pos.y + this.halfSize.height >
        object.pos.y - object.halfSize.height &&
      this.pos.y - this.halfSize.height < object.pos.y + object.halfSize.height
    )
  }

  distanceTo(object: GameObject) {
    return Math.sqrt(
      Math.pow(object.pos.x - this.pos.x, 2) +
        Math.pow(object.pos.y - this.pos.y, 2)
    )
  }
  angleTo(target: GameObject): number {
    const dx = target.pos.x - this.pos.x
    const dy = target.pos.y - this.pos.y
    return Math.atan2(dy, dx)
  }
}
