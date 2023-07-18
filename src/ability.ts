import { GameObject } from "./gameobject"
import { images } from "./state"
import { Vec2 } from "./v2"

export enum AbilityType {
  SlowMo = "SlowMo",
  DoubleJump = "DoubleJump",
}

export class Ability {
  img: HTMLImageElement
  cost: number = 100

  constructor(public type: AbilityType, public price: number = 50) {
    switch (type) {
      case AbilityType.SlowMo:
        this.img = images.value.find((i) => i.name === "snail.png")!.image
        this.cost = 1
        break
      case AbilityType.DoubleJump:
        this.img = images.value.find((i) => i.name === "boot.png")!.image
        break
      default:
        break
    }
    //@ts-ignore
    if (!this.img) {
      throw new Error("No image found for ability " + type)
    }
  }

  use(player: GameObject) {
    switch (this.type) {
      case AbilityType.SlowMo:
        GameObject.speedMultiplier = 0.5
        break
      case AbilityType.DoubleJump:
        player.vel.y -= player.jumpPower * 2
        break
      default:
        break
    }
  }

  unuse(_player: GameObject) {
    switch (this.type) {
      case AbilityType.SlowMo:
        GameObject.speedMultiplier = 1
        break
      default:
        break
    }
  }

  render(ctx: CanvasRenderingContext2D, pos: Vec2, size: number): void {
    ctx.drawImage(this.img, pos.x - size / 2, pos.y - size / 2, size, size)
  }
}
