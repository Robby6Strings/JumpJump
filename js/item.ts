import { GameObjectType, ItemType, Shape } from "./enums.js"
import { GameObject } from "./gameobject.js"
import { getImages } from "./images.js"
import { Vec2 } from "./v2.js"

export interface IItem {
  itemType: ItemType
}

export class Item extends GameObject implements IItem {
  itemType: ItemType = ItemType.Unset
  deleted: boolean = false

  constructor(pos: Vec2, itemType: ItemType) {
    super()
    this.type = GameObjectType.Item
    this.pos = pos
    this.itemType = itemType
    this.size = { width: 20, height: 20 }
    // this.color = "#FF0"
    this.glowColor = "#FF0"
    this.glows = true
    this.setImg()
  }

  setImg() {
    const images = getImages()
    switch (this.itemType) {
      case ItemType.Coin:
        this.img = images.find((i) => i.name === "coin.png")!.image
        this.size = { width: 50, height: 50 }
        this.shape = Shape.Circle
        break
      case ItemType.Jetpack:
        this.img = images.find((i) => i.name === "jetpack.png")?.image || null
        this.size = { width: 20, height: 20 }
        break
      case ItemType.Portal:
        this.img = images.find((i) => i.name === "portal.png")?.image || null
        this.size = { width: 20, height: 20 }
        break
      case ItemType.Checkpoint:
        this.img = images.find((i) => i.name === "checkpoint.png")?.image || null
        this.size = { width: 20, height: 20 }
        break
      default:
        break
    }
  }
  tick() {}

  draw(ctx: CanvasRenderingContext2D, yOffset: number): void {
    if (this.deleted) return
    super.draw(ctx, yOffset)
    // ctx.strokeStyle = "#FFF"
    // ctx.lineWidth = 2
    // ctx.strokeRect(this.pos.x, this.pos.y - yOffset, this.size.width, this.size.height)
  }
}
