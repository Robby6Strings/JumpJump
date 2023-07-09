import { Shape } from "./enums.js"
import { GameObject } from "./gameobject.js"
import { getImages } from "./images.js"
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
  tick() {
    this.pos.y += 1
  }
}
