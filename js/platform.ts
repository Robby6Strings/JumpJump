import { GameObjectType } from "./enums.js"
import { GameObject } from "./gameobject.js"

type PlatformConstructor = {
  pos: { x: number; y: number }
  size: { width: number; height: number }
  behaviours?: PlatformBehaviour[]
}

export enum PlatformBehaviour {
  Bounce,
  MovesX,
  MovesY,
  MovesXY,
}

export class Platform extends GameObject {
  behaviours: PlatformBehaviour[] = []
  constructor({ pos, size }: PlatformConstructor) {
    super()
    this.type = GameObjectType.Platform
    this.pos = pos
    this.size = size
    this.color = "green"
    this.isStatic = true
    this.canLeaveMap = true
  }

  hasBehaviour(behaviour: PlatformBehaviour) {
    return this.behaviours.includes(behaviour)
  }
}
