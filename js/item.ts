import { GameObject } from "./gameobject.js"
import { Vec2 } from "./v2.js"

export enum ItemType {
  Unset,
  Coin,
  Jetpack,
  Portal,
  Checkpoint,
}

export class Item extends GameObject {
  itemType: ItemType = ItemType.Unset

  constructor(pos: Vec2, itemType: ItemType) {
    super()
    this.pos = pos
    this.itemType = itemType
    this.size = { width: 20, height: 20 }
    this.color = "#FF0"
    this.glowColor = "#FF0"
    this.glows = true
  }

  tick() {
    this.pos.y += 1
  }

  draw(ctx: CanvasRenderingContext2D, yOffset: number = 0) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y - yOffset, this.halfSize.width, 0, Math.PI * 2)
    ctx.fill()
  }
}
