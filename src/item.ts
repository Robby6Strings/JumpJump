import { constants } from "./constants"
import { GameObjectType, ItemType, Shape } from "./enums"
import { GameObject } from "./gameobject"
import { Vec2 } from "./v2"
import { game, images, isShopOpen } from "./state"
import { Player } from "./player"
import { Camera } from "./camera"

export interface IItem {
  itemType: ItemType
}

export class Item extends GameObject implements IItem {
  itemType: ItemType = ItemType.Unset
  isInteracting: boolean = false

  constructor(pos: Vec2, itemType: ItemType) {
    super()
    this.type = GameObjectType.Item
    this.pos = pos
    this.itemType = itemType
    this.size = { width: 42, height: 42 }
    this.color = "transparent"
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
      case ItemType.AntiGravity:
        this.img =
          images.value.find((i) => i.name === "antigravity.png")?.image || null
        break
      case ItemType.Shop:
        this.img =
          images.value.find((i) => i.name === "shop.png")?.image || null
        this.glows = false
        break
      case ItemType.Charger:
        this.img =
          images.value.find((i) => i.name === "charger.png")?.image || null
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
    if (this.itemType === ItemType.Shop && this === game?.currentShop) {
      if (!this.isColliding && isShopOpen.value) isShopOpen.value = false
    }
  }

  interactWith(object: GameObject) {
    switch (this.itemType) {
      case ItemType.Portal:
        if (this instanceof Portal && this.otherPortal) {
          if (this.isInteracting) return
          if (this.otherPortal.isInteracting) return

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
        this.deleted = true
        break
      case ItemType.AntiGravity:
        object.gravityMultiplier -= 0.5
        setTimeout(() => {
          object.gravityMultiplier += 0.5
        }, 4_000)
        this.deleted = true
        break
      case ItemType.Shop:
        if (isShopOpen.value) return
        isShopOpen.value = true
        break
      default:
        break
    }
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
  }
}

export class Shop extends Item {
  constructor(pos: Vec2) {
    super(pos, ItemType.Shop)
    this.size = { width: 64, height: 64 }
    this.glowColor = "#FF0"
  }
}

export class Charger extends Item {
  chargeAmount: number = 0
  chargeMax: number = 100
  constructor(pos: Vec2, private onCharged: { (): void }) {
    super(pos, ItemType.Charger)
    this.size = { width: 64, height: 64 }
    this.glows = false
  }

  interactWith(object: GameObject) {
    if (!(object instanceof Player)) return
    if (object.inputs.interact) this.charge()
  }

  charge() {
    if (this.chargeAmount === this.chargeMax) return
    this.chargeAmount += 0.66
    if (this.chargeAmount > this.chargeMax) {
      this.chargeAmount = this.chargeMax
      this.onCharged()
    }
  }

  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {
    super.draw(ctx, camera)

    // draw a radial charging indicator above

    const { offsetX, offsetY } = camera
    const x = (this.pos.x - offsetX) * camera.zoom
    const y = (this.pos.y - offsetY) * camera.zoom

    const fillColor = "gold"

    ctx.beginPath()
    ctx.arc(
      x,
      y - this.size.height / 2 - 10,
      10,
      0,
      (Math.PI * 2 * this.chargeAmount) / this.chargeMax
    )
    ctx.strokeStyle = fillColor
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(
      x,
      y - this.size.height / 2 - 10,
      10,
      (Math.PI * 2 * this.chargeAmount) / this.chargeMax,
      Math.PI * 2
    )
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(
      x,
      y - this.size.height / 2 - 10,
      8,
      0,
      Math.PI * 2 * (this.chargeAmount / this.chargeMax)
    )
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(
      x,
      y - this.size.height / 2 - 10,
      8,
      Math.PI * 2 * (this.chargeAmount / this.chargeMax),
      Math.PI * 2
    )
    ctx.fillStyle = "#333"
    ctx.fill()
    ctx.closePath()

    ctx.beginPath()
    ctx.arc(
      x,
      y - this.size.height / 2 - 10,
      6,
      0,
      Math.PI * 2 * (this.chargeAmount / this.chargeMax)
    )
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.closePath()
  }
}
