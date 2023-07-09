import { GameObjectType } from "./enums.js"
import { GameObject } from "./gameobject.js"
import type { Vec2 } from "./v2"

type PlatformConstructor = {
  pos: Vec2
  size: { width: number; height: number }
  behaviours?: PlatformBehaviour[]
}

export enum PlatformBehaviour {
  Bounce,
  SuperBounce,
  MovesX,
  MovesY,
}

export class Platform extends GameObject {
  behaviours: PlatformBehaviour[] = []
  moveSpeed = Math.random() * 2 + 1
  moveDirectionX = 1
  moveDirectionY = 1
  moveDistanceX = 200
  moveDistanceY = 100
  moveDistanceTravelledX = 0
  moveDistanceTravelledY = 0
  constructor({ pos, size, behaviours = [] }: PlatformConstructor) {
    super()
    this.type = GameObjectType.Platform
    this.pos = pos
    this.size = size
    this.color = "#66A"
    this.isStatic = true
    this.canLeaveMap = true
    this.behaviours = behaviours
    if (this.hasBehaviour(PlatformBehaviour.SuperBounce)) {
      this.color = "#55F"
    }
  }

  static randomPlatform(pos: Vec2): Platform {
    const size = {
      width: Math.random() * 100 + 50,
      height: Math.random() * 10 + 20,
    }
    const behaviours = [PlatformBehaviour.Bounce]
    if (Math.random() > 0.95) {
      behaviours.push(PlatformBehaviour.SuperBounce)
    }
    if (Math.random() > 0.5) {
      behaviours.push(PlatformBehaviour.MovesX)
    }
    if (Math.random() > 0.5) {
      behaviours.push(PlatformBehaviour.MovesY)
    }
    return new Platform({ pos, size, behaviours })
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
    this.vel.x = this.moveSpeed * this.moveDirectionX
    this.pos.x += this.vel.x
    this.moveDistanceTravelledX += this.moveSpeed
    if (this.moveDistanceTravelledX >= this.moveDistanceX) {
      this.moveDirectionX *= -1
      this.moveDistanceTravelledX = 0
    }
  }

  moveY() {
    this.vel.y = this.moveSpeed * this.moveDirectionY
    this.pos.y += this.vel.y
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
