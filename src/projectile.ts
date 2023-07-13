import { GameObjectType, Shape } from "./enums"
import { GameObject } from "./gameobject"
import { StatusEffect } from "./statusEffect"
import { Vec2 } from "./v2"

export class Projectile extends GameObject {
  maxSpeedX: number = 30
  maxSpeedY: number = 30
  gravityMultiplier: number = 0.5

  constructor(
    public pos: Vec2,
    public vel: Vec2,
    radius: number,
    public statusEffect: StatusEffect
  ) {
    super()
    this.type = GameObjectType.Projectile
    this.pos = pos
    this.vel = vel
    this.isCollidable = true
    this.isStatic = false
    this.shape = Shape.Circle
    this.size = { width: radius * 2, height: radius * 2 }
    this.affectedByGravity = true
    this.frictionMultiplier = 0.5
  }

  tick(): void {
    super.tick()
    // if (this.pos.x - this.size.width < 0) {
    //   this.deleted = true
    // } else if (this.pos.x + this.size.width > constants.screenWidth) {
    //   this.deleted = true
    // }
  }
}
