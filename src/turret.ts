import { constants } from "./constants"
import { GameObjectType, Shape, StatusEffectType } from "./enums"
import { GameObject } from "./gameobject"
import { Projectile } from "./projectile"
import { StatusEffect } from "./statusEffect"
import { Vec2 } from "./v2"

export class Turret extends GameObject {
  shootRange: number = constants.screenWidth
  shootCooldown: number = 1000
  lastShot: number = 0

  constructor(
    public pos: Vec2,
    public player: GameObject,
    public addProj: { (proj: Projectile): void }
  ) {
    super()
    this.type = GameObjectType.Turret
    this.shape = Shape.Circle
    this.size = { width: 50, height: 50 }
    this.isCollidable = false
    this.isStatic = true
    this.color = "#F00A"
  }

  tick(): void {
    const distToPlayer = this.distanceTo(this.player)
    if (distToPlayer > this.shootRange) {
      this.lastShot = 0
      return
    }
    this.lastShot += 1000 / 60
    if (this.lastShot >= this.shootCooldown) {
      this.shoot()
      this.lastShot = 0
    }
  }

  shoot(): void {
    const angle = this.angleTo(this.player)
    const vel = {
      x: Math.cos(angle) * 30,
      y: Math.sin(angle) * 30,
    }
    const projectile = new Projectile(
      {
        x: this.pos.x,
        y: this.pos.y,
      },
      vel,
      10,
      new StatusEffect(StatusEffectType.Chill, 1000)
    )
    projectile.color = "#F00"
    this.addProj(projectile)
  }
}
