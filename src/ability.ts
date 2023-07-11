import { images } from "./state"
import { Vec2 } from "./v2"

export enum AbilityType {
  SlowMo = "SlowMo",
}

export class Ability {
  img: HTMLImageElement

  constructor(public type: AbilityType, public price: number = 50) {
    switch (type) {
      case AbilityType.SlowMo:
        this.img = images.value.find((i) => i.name === "snail.png")!.image
        break
      default:
        break
    }
    //@ts-ignore
    if (!this.img) {
      throw new Error("No image found for ability " + type)
    }
  }

  render(ctx: CanvasRenderingContext2D, pos: Vec2, size: number): void {
    ctx.drawImage(this.img, pos.x - size / 2, pos.y - size / 2, size, size)
  }
}
