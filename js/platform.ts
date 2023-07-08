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
}

export class Platform extends GameObject {
  behaviours: PlatformBehaviour[] = []
  moveSpeed = 3
  moveDirectionX = 1
  moveDirectionY = 1
  moveDistanceX = 200
  moveDistanceY = 100
  moveDistanceTravelledX = 0
  moveDistanceTravelledY = 0
  constructor({ pos, size, behaviours }: PlatformConstructor) {
    super()
    this.type = GameObjectType.Platform
    this.pos = pos
    this.size = size
    this.color = "green"
    this.isStatic = true
    this.canLeaveMap = true
    if (behaviours) {
      this.behaviours = behaviours
    }
  }

  tick(): void {
    if (this.hasBehaviour(PlatformBehaviour.MovesX)) {
      this.moveX()
    }
    if (this.hasBehaviour(PlatformBehaviour.MovesY)) {
      this.moveY()
    }
  }

  moveX() {
    this.pos.x += this.moveSpeed * this.moveDirectionX
    this.moveDistanceTravelledX += this.moveSpeed
    if (this.moveDistanceTravelledX >= this.moveDistanceX) {
      this.moveDirectionX *= -1
      this.moveDistanceTravelledX = 0
    }
  }

  moveY() {
    this.pos.y += this.moveSpeed * this.moveDirectionY
    this.moveDistanceTravelledY += this.moveSpeed
    if (this.moveDistanceTravelledY >= this.moveDistanceY) {
      this.moveDirectionY *= -1
      this.moveDistanceTravelledY = 0
    }
  }

  hasBehaviour(behaviour: PlatformBehaviour) {
    return this.behaviours.includes(behaviour)
  }
}
