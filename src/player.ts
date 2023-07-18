import { Signal } from "cinnabun"
import { Ability, AbilityType } from "./ability.js"
import { constants } from "./constants.js"
import { GameObjectType, ItemType, StatusEffectType } from "./enums.js"
import { GameObject } from "./gameobject.js"
import { IItem, Item } from "./item.js"
import { Vec2 } from "./v2.js"
import { StatusEffectManager } from "./statusEffect.js"
import { Camera } from "./camera.js"

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

  defaultColor: string = "#69c"
  chilledColor: string = "#8ac"

  statusEffects: StatusEffectManager = new StatusEffectManager()

  inputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    ability1: false,
    ability2: false,
    ability3: false,
  }

  get isChilled(): boolean {
    return this.statusEffects.has(StatusEffectType.Chill)
  }
  get isStunned(): boolean {
    return this.statusEffects.has(StatusEffectType.Stun)
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
    this.color = this.defaultColor
    this.glows = true
    this.glowColor = "#000A"
    this.glowSize = 3
    this.abilities.push(new Ability(AbilityType.DoubleJump))

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

    this.statusEffects.tick()
    this.emitVelocityParticles()
    this.handleInputs()
    this.color = this.defaultColor

    if (this.isChilled) {
      this.color = this.chilledColor
      this.vel.x *= 0.9
      if (this.vel.y < 0) {
        this.vel.y *= 0.9
      } else {
        this.vel.y *= 0.95
      }
    }
    if (this.isStunned) {
      this.vel.x = 0
      this.vel.y = 0
    }
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

  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    this.drawVelocityParticles(ctx, camera)
    super.draw(ctx, camera)
    if (this.abilities.length > 0) {
      this.renderAbilityJuiceBar(ctx)
      this.renderAbilities(ctx)
    }
    this.statusEffects.draw(ctx, this.pos, camera, this.size)
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
      ctx.strokeStyle = "#0004"
      ctx.fillStyle = "#0004"
      ctx.lineWidth = 2

      const offset = this.abilities.length - i - 1
      ctx.beginPath()
      ctx.roundRect(x - offset * abilitySize, y, abilitySize, abilitySize, 5)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()

      const padding = 5

      ctx.drawImage(
        ability.img,
        x + padding - offset * abilitySize,
        y + padding,
        abilitySize - padding * 2,
        abilitySize - padding * 2
      )

      // render button prompts
      ctx.fillStyle = "#fff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      let txt = "space"

      switch (i) {
        case 0:
          txt = "space"
          break
        case 1:
          txt = "c"
          break
        case 2:
          txt = "v"
          break
        case 3:
          txt = "b"
          break
        default:
          break
      }
      ctx.fillText(txt, abilitySize / 2 + x - offset * abilitySize, y)
    })
  }

  drawVelocityParticles(ctx: CanvasRenderingContext2D, camera: Camera): void {
    if (this.velocityParticles.length === 0) return
    ctx.shadowBlur = 0
    this.velocityParticles.forEach((particle) => {
      ctx.fillStyle = particle.color
      ctx.fillRect(
        (particle.pos.x - particle.size / 2 - camera.offsetX) * camera.zoom,
        (particle.pos.y - camera.offsetY) * camera.zoom,
        particle.size * camera.zoom,
        particle.size * camera.zoom
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
    if (this.inputs.down) {
      this.vel.y += this.speed / 2
    }

    const ability1 = this.abilities[1]
    if (ability1) {
      if (this.inputs.ability1 && this.abilityJuice >= ability1.cost) {
        ability1.use(this)
        this.abilityJuice -= ability1.cost
      } else {
        ability1.unuse(this)
      }
    }

    const ability2 = this.abilities[2]
    if (ability2) {
      if (this.inputs.ability2 && this.abilityJuice >= ability2.cost) {
        ability2.use(this)
        this.abilityJuice -= ability2.cost
      } else {
        ability2.unuse(this)
      }
    }

    const ability3 = this.abilities[3]
    if (ability3) {
      if (this.inputs.ability3 && this.abilityJuice >= ability3.cost) {
        ability3.use(this)
        this.abilityJuice -= ability3.cost
      } else {
        ability3.unuse(this)
      }
    }
  }

  attachKeybinds(): void {
    window.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "a":
          this.inputs.left = true
          break
        case "d":
          this.inputs.right = true
          break
        case "w":
          this.inputs.up = true
          break
        case "s":
          this.inputs.down = true
          break
        case "c":
          this.inputs.ability1 = true
          break
        case "v":
          this.inputs.ability2 = true
          break
        case "b":
          this.inputs.ability3 = true
          break
      }
    })

    window.addEventListener("keypress", (e) => {
      switch (e.key.toLowerCase()) {
        case " ":
          const ability = this.abilities.find(
            (a) => a.type === AbilityType.DoubleJump
          )!
          if (this.abilityJuice >= ability.cost) {
            ability.use(this)
            this.abilityJuice -= ability.cost
          }
          break
      }
    })

    window.addEventListener("keyup", (e) => {
      switch (e.key.toLowerCase()) {
        case "a":
          this.inputs.left = false
          break
        case "d":
          this.inputs.right = false
          break
        case "w":
          this.inputs.up = false
          break
        case "s":
          this.inputs.down = false
          break
        case "c":
          this.inputs.ability1 = false
          break
        case "v":
          this.inputs.ability2 = false
          break
        case "b":
          this.inputs.ability3 = false
          break
      }
    })
  }
}
