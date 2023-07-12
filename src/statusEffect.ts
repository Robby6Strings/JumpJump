import { StatusEffectType } from "./enums"
import { images } from "./state"
import { Vec2 } from "./v2"

export class StatusEffect {
  type: StatusEffectType = StatusEffectType.Unset
  img: HTMLImageElement | null = null
  duration: number = 0
  constructor(type: StatusEffectType, duration: number) {
    this.type = type
    this.duration = duration
    switch (type) {
      case StatusEffectType.Chill:
        this.img =
          images.value.find((i) => i.name === "thaw.png")?.image || null
        break
      default:
        break
    }
  }

  tick() {
    this.duration -= 1000 / 60
    if (this.duration <= 0) {
      this.type = StatusEffectType.Unset
    }
  }

  draw(ctx: CanvasRenderingContext2D, pos: Vec2, width: number) {
    if (!this.img) return
    ctx.drawImage(this.img, pos.x - width / 2, pos.y, width, width)
  }
}

export class StatusEffectManager {
  effects: StatusEffect[] = []

  draw(
    ctx: CanvasRenderingContext2D,
    playerPos: Vec2,
    cameraOffset: number,
    playerSize: {
      width: number
      height: number
    }
  ) {
    this.effects.forEach((effect) => {
      effect.draw(
        ctx,
        {
          x: playerPos.x,
          y: playerPos.y - playerSize.height / 2 - cameraOffset,
        },
        playerSize.width
      )
    })
  }

  has(type: StatusEffectType): boolean {
    return this.effects.some((effect) => {
      return effect.type === type
    })
  }

  add(effect: StatusEffect) {
    const existingEffect = this.effects.find((e) => {
      return e.type === effect.type
    })
    if (existingEffect) {
      existingEffect.duration += effect.duration
      return
    }
    this.effects.push(effect)
  }

  tick() {
    this.effects.forEach((effect) => {
      effect.tick()
    })
    this.effects = this.effects.filter((effect) => {
      return effect.type != StatusEffectType.Unset
    })
  }
}
