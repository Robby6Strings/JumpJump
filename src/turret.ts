import { Camera } from "./camera"
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
    public enemies: GameObject[],
    public addProj: { (proj: GameObject): void }
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
    this.lastShot += 1000 / 60
    const enemy = this.getEnemyInRange()
    if (!enemy) return
    if (this.lastShot >= this.shootCooldown) {
      this.shoot(enemy)
      this.lastShot = 0
    }
  }

  getEnemyInRange(): GameObject | null {
    for (const enemy of this.enemies) {
      const distToEnemy = this.distanceTo(enemy)
      if (distToEnemy > this.shootRange) {
        continue
      }
      return enemy
    }
    return null
  }

  shoot(enemy: GameObject): void {
    const angle = this.angleTo(enemy)
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

export class LaserTurret extends Turret {
  shootCooldown: number = 5000
  targetBoss: GameObject | null = null
  rotation: number = 0
  color: string = "#777"
  enabled: boolean = false
  tick() {
    if (!this.enabled) return
    super.tick()
    if (!this.targetBoss) return

    this.rotation = this.angleTo(this.targetBoss)
  }
  shoot(enemy: GameObject): void {
    const angle = this.angleTo(enemy)
    const vel = {
      x: Math.cos(angle) * 30,
      y: Math.sin(angle) * 30,
    }

    const laser = new GameObject()
    laser.type = GameObjectType.Laser
    laser.color = "#F00"
    laser.shape = Shape.Rectangle
    laser.size = { width: 10, height: 10 }
    laser.pos = {
      x: this.pos.x,
      y: this.pos.y,
    }
    laser.vel = vel
    laser.isCollidable = false
    laser.isStatic = true
    laser.tick = () => {
      laser.size.width += 10
      laser.size.height += 10
      laser.pos.x += laser.vel.x
      laser.pos.y += laser.vel.y
    }
    this.addProj(laser)
    this.enabled = false
    this.onShoot()
  }

  onShoot(): void {}

  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    this.color = this.enabled ? "#777a" : "#777"
    super.draw(ctx, camera)

    if (!this.targetBoss) return
    if (!this.enabled) return

    const { offsetX, offsetY } = camera
    // draw laser cannon on top of turret
    ctx.save()
    ctx.translate(
      (this.pos.x - offsetX) * camera.zoom,
      (this.pos.y - offsetY) * camera.zoom
    )
    ctx.rotate(this.rotation)
    ctx.fillStyle = this.color
    ctx.fillRect(0, -5, 30, 10)
    ctx.restore()
  }
}
