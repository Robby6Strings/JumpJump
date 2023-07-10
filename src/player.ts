import { Ability } from "./ability.js"
import { constants } from "./constants.js"
import { GameObjectType, ItemType } from "./enums.js"
import { GameObject } from "./gameobject.js"
import { Item } from "./item.js"
import { Vec2 } from "./v2.js"

type VelocityParticle = {
  pos: Vec2
  color: string
  size: number
}

export class Player extends GameObject {
  velocityParticles: VelocityParticle[] = []
  abilities: Ability[] = []

  inputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
  }

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
    this.glows = true
    this.glowColor = "#000A"
    this.glowSize = 3
    this.attachKeybinds()
    for (let i = 0; i < 1000; i++) {
      this.items.push(new Item({ x: 0, y: 0 }, ItemType.Coin))
    }
  }

  get coins(): number {
    return this.items.filter((i) => i.itemType === ItemType.Coin).length
  }

  get distanceFromGround(): number {
    return constants.screenHeight - this.pos.y - this.halfSize.height
  }

  tick(): void {
    let tempWidth = 50
    const absVelX = Math.abs(this.vel.x)
    if (absVelX > 0) {
      this.size.height = Math.min(50, 50 - Math.abs(this.vel.x) / 2)
      tempWidth = tempWidth + (50 - this.size.height)
    }

    if (this.vel.y < 0 && this.isJumping) {
      this.size.width = Math.min(
        tempWidth,
        tempWidth - Math.abs(this.vel.y) / 1.5
      )
    } else {
      this.size.width = tempWidth
    }

    this.emitVelocityParticles()
    this.handleInputs()
    super.tick()
  }

  draw(ctx: CanvasRenderingContext2D, yOffset: number): void {
    this.drawVelocityParticles(ctx, yOffset)
    super.draw(ctx, yOffset)
  }

  drawVelocityParticles(ctx: CanvasRenderingContext2D, yOffset: number): void {
    if (this.velocityParticles.length === 0) return
    ctx.shadowBlur = 0
    this.velocityParticles.forEach((particle) => {
      ctx.fillStyle = particle.color
      ctx.fillRect(
        particle.pos.x,
        particle.pos.y - yOffset,
        particle.size,
        particle.size
      )
    })
  }

  emitVelocityParticles(): void {
    const minVel = 5
    const absVelX = Math.abs(this.vel.x)
    const absVelY = Math.abs(this.vel.y)
    const color = "#55F"
    if (absVelX > minVel) {
      const particle: VelocityParticle = {
        pos: { x: this.pos.x, y: this.pos.y },
        color,
        size: absVelX / 3,
      }
      this.velocityParticles.push(particle)
    }
    if (absVelY > minVel) {
      const particle: VelocityParticle = {
        pos: { x: this.pos.x, y: this.pos.y },
        color,
        size: absVelY / 3,
      }
      this.velocityParticles.push(particle)
    }
    this.velocityParticles.forEach((particle) => {
      particle.size *= 0.9
    })
    this.velocityParticles = this.velocityParticles.filter(
      (particle) => particle.size > 0.5
    )
  }

  handleInputs(): void {
    if (this.inputs.left) {
      this.vel.x -= this.speed
    }
    if (this.inputs.right) {
      this.vel.x += this.speed
    }
    if (this.inputs.up && !this.isJumping) {
      if (this.vel.y > 0) this.vel.y = 0
      this.vel.y -= this.jumpPower
      this.isJumping = true
    }
  }

  attachKeybinds(): void {
    window.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          this.inputs.left = true
          break
        case "arrowright":
        case "d":
          this.inputs.right = true
          break
        case "arrowup":
        case "w":
          this.inputs.up = true
          break
        case "arrowdown":
        case "s":
          this.inputs.down = true
          break
        case " ":
          this.inputs.space = true
          break
      }
    })

    window.addEventListener("keyup", (e) => {
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          this.inputs.left = false
          break
        case "arrowright":
        case "d":
          this.inputs.right = false
          break
        case "arrowup":
        case "w":
          this.inputs.up = false
          break
        case "arrowdown":
        case "s":
          this.inputs.down = false
          break
        case " ":
          this.inputs.space = false
          break
      }
    })
  }
}
