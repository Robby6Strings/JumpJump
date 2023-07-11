import { Signal } from "cinnabun"
import { Ability } from "./ability.js"
import { constants } from "./constants.js"
import { GameObjectType, ItemType } from "./enums.js"
import { GameObject } from "./gameobject.js"
import { IItem, Item } from "./item.js"
import { Vec2 } from "./v2.js"

type VelocityParticle = {
  pos: Vec2
  color: string
  size: number
}

export class Player extends GameObject {
  velocityParticles: VelocityParticle[] = []
  abilities: Ability[] = []
  coins: Signal<IItem[]> = new Signal([] as IItem[])

  abilityJuiceCost: number = 100
  abilityJuice: number = 0
  maxAbilityJuice: number = 300
  selectedAbilityIndex: number = -1

  inputs = {
    left: false,
    right: false,
    up: false,
    down: false,
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
    if (constants.testMode) {
      for (let i = 0; i < constants.testCoins; i++) {
        this.addItem(new Item({ x: 0, y: 0 }, ItemType.Coin))
      }
    }
  }

  get numCoins(): number {
    return this.coins.value.length
  }

  get distanceFromGround(): number {
    return constants.screenHeight - this.pos.y - this.halfSize.height
  }

  tick(): void {
    if (!this.isColliding) this.hasJumpBoost = false

    if (this.vel.y < 0 && this.isJumping) {
      this.size.width = Math.min(50, 50 - Math.abs(this.vel.y) / 1.5)
    } else {
      this.size.width = 50
    }

    this.emitVelocityParticles()
    this.handleInputs()
    super.tick()
    if (this.abilities.length > 0) {
      if (this.vel.y < 0) {
        this.abilityJuice += -this.vel.y / 42
        if (this.abilityJuice > this.maxAbilityJuice) {
          this.abilityJuice = this.maxAbilityJuice
        }
      }
    }
  }

  addItem(item: IItem) {
    switch (item.itemType) {
      case ItemType.Coin:
        this.coins.value.push(item)
        this.coins.notify()
        break
      default:
        this.items.value.push(item)
        this.items.notify()
        break
    }
  }

  draw(ctx: CanvasRenderingContext2D, yOffset: number): void {
    this.drawVelocityParticles(ctx, yOffset)
    super.draw(ctx, yOffset)
    if (this.abilities.length > 0) {
      this.renderAbilityJuiceBar(ctx)
      this.renderAbilities(ctx)
    }
  }

  renderAbilityJuiceBar(ctx: CanvasRenderingContext2D): void {
    // render a vertical bar that shows how much ability juice the player has
    // with a section that shows how much juice is needed to use an ability

    const bgColor = "#a28c17aa"
    const fillColor = "#d5bb30"
    const barWidth = 10
    const barHeight = this.maxAbilityJuice
    const barX = constants.screenWidth - barWidth - 10
    const barY = constants.screenHeight - barHeight - 10

    ctx.shadowBlur = 0

    ctx.fillStyle = bgColor
    ctx.fillRect(barX, barY, barWidth, barHeight)

    const juiceHeight = (this.abilityJuice / this.maxAbilityJuice) * barHeight
    ctx.fillStyle = fillColor
    ctx.fillRect(barX, barY + barHeight - juiceHeight, barWidth, juiceHeight)

    //render separator every 100px
    const separatorHeight = 2
    const numSeparators = Math.floor(barHeight / this.abilityJuiceCost)
    ctx.fillStyle = bgColor
    for (let i = 0; i < numSeparators; i++) {
      const y = barY + (i + 1) * this.abilityJuiceCost
      ctx.fillRect(barX, y, barWidth, separatorHeight)
    }
  }
  renderAbilities(ctx: CanvasRenderingContext2D): void {
    const abilitySize = 50
    const padding = 10
    const x = constants.screenWidth - abilitySize - padding - 30
    const y = constants.screenHeight - abilitySize - padding
    this.abilities.forEach((ability, i) => {
      const isSelected = i === this.selectedAbilityIndex
      ctx.beginPath()
      ctx.fillStyle = isSelected ? "#0004" : "transparent"
      ctx.roundRect(x - i * abilitySize, y, abilitySize, abilitySize, 5)
      ctx.fill()
      ctx.strokeStyle = isSelected ? "#fff" : "#0004"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()

      const padding = 5

      ctx.drawImage(
        ability.img,
        x + padding - i * abilitySize,
        y + padding,
        abilitySize - padding * 2,
        abilitySize - padding * 2
      )
    })
  }

  drawVelocityParticles(ctx: CanvasRenderingContext2D, yOffset: number): void {
    if (this.velocityParticles.length === 0) return
    ctx.shadowBlur = 0
    this.velocityParticles.forEach((particle) => {
      ctx.fillStyle = particle.color
      ctx.fillRect(
        particle.pos.x - particle.size / 2,
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
      this.vel.y -= this.jumpPower * (this.hasJumpBoost ? 2 : 1)
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
      }
    })
    window.addEventListener("wheel", (e) => {
      if (this.abilities.length > 1) {
        if (e.deltaY > 0) {
          this.selectedAbilityIndex++
          if (this.selectedAbilityIndex >= this.abilities.length) {
            this.selectedAbilityIndex = 0
          }
        } else {
          this.selectedAbilityIndex--
          if (this.selectedAbilityIndex < 0) {
            this.selectedAbilityIndex = this.abilities.length - 1
          }
        }
      }
    })

    window.addEventListener("keypress", (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
          if (this.abilities.length > 0) {
            if (this.abilityJuice >= this.abilityJuiceCost) {
              this.abilities[this.selectedAbilityIndex]?.use(this)
              this.abilityJuice -= this.abilityJuiceCost
            }
          }
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
      }
    })
  }
}
