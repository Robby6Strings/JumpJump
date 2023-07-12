import { StatusEffectType } from "./enums"

export class StatusEffect {
  type: StatusEffectType = StatusEffectType.Unset
  duration: number = 0
  constructor(type: StatusEffectType, duration: number) {
    this.type = type
    this.duration = duration
  }

  tick() {
    this.duration -= 1000 / 60
    if (this.duration <= 0) {
      this.type = StatusEffectType.Unset
    }
  }
}

export class StatusEffectManager {
  effects: StatusEffect[] = []
  constructor() {}

  add(effect: StatusEffect) {
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
