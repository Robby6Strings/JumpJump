import { constants } from "./constants"
import { GameObjectType, ItemType, Shape } from "./enums"
import { GameObject } from "./gameobject"
import { Vec2 } from "./v2"
import { images, isShopOpen } from "./state"

export interface IItem {
  itemType: ItemType
}

export class Item extends GameObject implements IItem {
  itemType: ItemType = ItemType.Unset
  deleted: boolean = false
  isInteracting: boolean = false

  constructor(pos: Vec2, itemType: ItemType) {
    super()
    this.type = GameObjectType.Item
    this.pos = pos
    this.itemType = itemType
    this.size = { width: 42, height: 42 }
    // this.color = "#FF0"
    this.glowColor = "#FF0"
    this.glows = true
    this.setImg()
  }

  setImg() {
    switch (this.itemType) {
      case ItemType.Coin:
        this.img =
          images.value.find((i) => i.name === "coin.png")?.image || null
        this.shape = Shape.Circle
        break
      case ItemType.Jetpack:
        this.img =
          images.value.find((i) => i.name === "jetpack.png")?.image || null
        break
      case ItemType.Checkpoint:
        this.img =
          images.value.find((i) => i.name === "checkpoint.png")?.image || null
        break
      case ItemType.AntiGravity:
        this.img =
          images.value.find((i) => i.name === "antigravity.png")?.image || null
        break
      case ItemType.Shop:
        this.img =
          images.value.find((i) => i.name === "shop.png")?.image || null
        this.size = { width: 64, height: 64 }
        this.glows = false
        break
      default:
        break
    }
  }
  tick() {
    if (this instanceof Portal && this.otherPortal) {
      if (this.isColliding || this.otherPortal.isColliding) return
      this.isInteracting = false
      this.otherPortal.isInteracting = false
      return
    }
    if (this.itemType === ItemType.Shop) {
      if (!this.isColliding && isShopOpen.value) isShopOpen.value = false
    }
  }

  interactWith(object: GameObject) {
    switch (this.itemType) {
      case ItemType.Portal:
        if (this instanceof Portal && this.otherPortal) {
          if (this.isInteracting) return false
          if (this.otherPortal.isInteracting) return false

          this.isInteracting = true
          this.otherPortal.isInteracting = true
          this.otherPortal.isColliding = true

          object.pos.x = this.otherPortal.pos.x
          object.pos.y = this.otherPortal.pos.y
          setTimeout(() => {
            if (this instanceof Portal && this.otherPortal)
              this.otherPortal.isColliding = false
          }, 100)
        }
        break
      case ItemType.Coin:
        object.addItem(this)
        return true
      case ItemType.AntiGravity:
        object.gravityMultiplier -= 0.5
        setTimeout(() => {
          object.gravityMultiplier += 0.5
        }, 8_000)
        return true
      case ItemType.Shop:
        if (isShopOpen.value) return false
        isShopOpen.value = true
        return false
      default:
        break
    }
    return false
  }

  draw(ctx: CanvasRenderingContext2D, yOffset: number): void {
    if (this.deleted) return
    super.draw(ctx, yOffset)
    // ctx.strokeStyle = "#FFF"
    // ctx.lineWidth = 2
    // ctx.strokeRect(this.pos.x, this.pos.y - yOffset, this.size.width, this.size.height)
  }
}

export class Portal extends Item {
  otherPortal: Portal | null = null
  static portalSize: number = 100
  constructor(pos: Vec2, private idx: number) {
    super(pos, ItemType.Portal)
    this.size.width = Portal.portalSize
    this.size.height = Portal.portalSize
    this.glowColor = "#0FF"
    this.setImg()
  }

  static createPair(yOffset: number): [Portal, Portal] {
    const size = Portal.portalSize
    const x1 = size + Math.random() * (constants.screenWidth - size)
    const pos1 = {
      x: x1,
      y: Math.random() * 500 + 100 + yOffset,
    }

    const nextAbove = Math.random() > 0.5

    const y2 = nextAbove
      ? pos1.y - 100 - Math.random() * 300
      : pos1.y + 100 + Math.random() * 300

    const pos2 = {
      x:
        x1 > constants.screenWidth / 2
          ? x1 - constants.screenWidth / 2
          : x1 + constants.screenWidth / 2,
      y: y2,
    }

    const portal1 = new Portal(pos1, 0)
    const portal2 = new Portal(pos2, 1)
    portal1.otherPortal = portal2
    portal2.otherPortal = portal1
    return [portal1, portal2]
  }

  setImg(): void {
    this.img =
      images.value.find(
        (i) => i.name === `portal${this.idx === 0 ? "2" : ""}.png`
      )?.image || null
    console.log("new portal img", this.img, this.idx)
  }
}

export class Shop extends Item {
  constructor(pos: Vec2) {
    super(pos, ItemType.Shop)
    this.size.width = 64
    this.size.height = 64
    this.glowColor = "#FF0"
    this.setImg()
  }
}
