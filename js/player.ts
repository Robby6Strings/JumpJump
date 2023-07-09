import { constants } from "./constants.js"
import { GameObjectType } from "./enums.js"
import { game } from "./game.js"
import { GameObject } from "./gameobject.js"
import { Vec2 } from "./v2.js"

type VelocityParticle = {
  pos: Vec2
  vel: Vec2
  color: string
  size: number
}

export class Player extends GameObject {
  velocityParticles: VelocityParticle[] = []
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

    this.emitVelocityParticles()

    this.handleInputs()
    super.tick()
  }

  draw(ctx: CanvasRenderingContext2D, yOffset: number): void {
    super.draw(ctx, yOffset)
    this.drawVelocityParticles(ctx, yOffset)
  }

  drawVelocityParticles(ctx: CanvasRenderingContext2D, yOffset: number): void {
    if (this.velocityParticles.length === 0) return
    this.velocityParticles.forEach((particle) => {
      ctx.fillStyle = particle.color
      ctx.fillRect(particle.pos.x, particle.pos.y - yOffset, particle.size, particle.size)
    })
  }

  emitVelocityParticles(): void {
    const absVelX = Math.abs(this.vel.x)
    const absVelY = Math.abs(this.vel.y)
    if (absVelX > 0.5) {
      const particle: VelocityParticle = {
        pos: { x: this.pos.x, y: this.pos.y },
        vel: { x: this.vel.x / 2, y: 0 },
        color: "#55F",
        size: absVelX / 2,
      }
      this.velocityParticles.push(particle)
    }
    if (absVelY > 0.5) {
      const particle: VelocityParticle = {
        pos: { x: this.pos.x, y: this.pos.y },
        vel: { x: 0, y: this.vel.y / 2 },
        color: "#55F",
        size: absVelY / 2,
      }
      this.velocityParticles.push(particle)
    }
    this.velocityParticles.forEach((particle) => {
      particle.pos.x += particle.vel.x
      particle.pos.y += particle.vel.y
      particle.vel.x *= 0.9
      particle.vel.y *= 0.9
      particle.size *= 0.9
    })
    this.velocityParticles = this.velocityParticles.filter((particle) => particle.size > 0.5)
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
