import { constants } from "./constants.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import { IItem, Item, Portal, Shop } from "./item.js"
import { Player } from "./player.js"
import { Camera } from "./camera.js"
import { ItemType } from "./enums.js"
import { Ability } from "./ability.js"
import { shopInventory } from "./state.js"
import { Vec2 } from "./v2.js"

export class Game {
  camera: Camera
  score: number = 0
  player: Player
  platforms: Platform[] = []
  items: Item[] = []
  maxSection: number
  isGameOver: boolean = false
  currentShop: Item | null = null
  directionIndicator: Vec2 | null = null
  directionIndicatorIcon: HTMLImageElement | null = null
  speedMultiplier: number = 1

  constructor() {
    this.player = new Player()
    this.platforms = [
      new Platform({
        size: { width: 250, height: 20 },
        pos: { x: 200, y: constants.screenHeight - 120 },
        behaviours: [PlatformBehaviour.Bounce, PlatformBehaviour.MovesX],
      }),
    ]
    this.items = []
    this.camera = new Camera(this.player)
    this.maxSection = 1
    this.generateNextSection()
  }

  set section(index: number) {
    if (index <= this.maxSection) return

    this.maxSection = index
    this.generateNextSection()
  }

  removeItem(item: IItem) {
    this.items.splice(this.items.indexOf(item as any), 1)
  }

  tick() {
    this.handleCollisions()
    for (const platform of this.platforms) {
      platform.tick()
    }
    for (const item of this.items) {
      item.tick()
    }
    this.player.tick()
    this.camera.tick()

    this.score = 0
    this.score = Math.floor(
      Math.abs(
        this.player.pos.y - constants.screenHeight + this.player.halfSize.height
      ) / 50
    )
    this.section =
      Math.abs(Math.floor(this.player.pos.y / constants.sectionHeight)) + 1

    if (this.currentShop) {
      // check if the shop is in view, based on the camera offset
      const dist = Math.abs(
        this.currentShop.pos.y -
          this.camera.offsetY -
          constants.screenHeight / 2
      )
      if (
        dist > constants.screenHeight / 2 &&
        dist < constants.screenHeight * 3
      ) {
        const x = this.currentShop.pos.x - this.currentShop.halfSize.width
        const y =
          this.camera.offsetY > this.currentShop.pos.y
            ? 0
            : constants.screenHeight

        this.directionIndicator = { x, y }
        this.directionIndicatorIcon = this.currentShop.img
      } else {
        this.directionIndicator = null
        this.directionIndicatorIcon = null
      }
    } else {
      this.directionIndicator = null
      this.directionIndicatorIcon = null
    }
  }

  generateNextSection() {
    const platforms = []
    const platformCount = 3
    const areaWidth = constants.screenWidth / platformCount

    let didSpawnShop = false

    for (let i = 0; i < platformCount; i++) {
      const spawnShop =
        !didSpawnShop && this.maxSection % constants.shopDistance === 0

      const heightVariance = 100
      const x = Math.random() * (i + 1) * areaWidth
      const y = spawnShop
        ? constants.sectionHeight - this.maxSection * constants.sectionHeight
        : constants.sectionHeight -
          this.maxSection * constants.sectionHeight +
          Math.random() * heightVariance -
          heightVariance / 2

      if (spawnShop) {
        if (this.currentShop) {
          this.items.splice(this.items.indexOf(this.currentShop), 1)
        }
        this.currentShop = new Shop({ x, y: y - 48 })
        this.items.push(this.currentShop)
        didSpawnShop = true
        platforms.push(
          Platform.randomPlatform({ x, y }, { height: 30, width: 160 }, [
            PlatformBehaviour.JumpBoost,
          ])
        )
        break
      }

      // chance to spawn a coin above the platform
      if (Math.random() > 0.66) {
        this.items.push(
          new Item({ x, y: y - constants.sectionHeight / 2 }, ItemType.Coin)
        )
        if (Math.random() > 0.66) {
          this.items.push(
            new Item(
              { x, y: y - constants.sectionHeight / 2 - 64 },
              ItemType.Coin
            )
          )
          if (Math.random() > 0.66) {
            this.items.push(
              new Item(
                { x, y: y - constants.sectionHeight / 2 - 128 },
                ItemType.Coin
              )
            )
          }
        }
      }

      // chance to spawn a portal pair in the next section
      platforms.push(Platform.randomPlatform({ x, y }))
    }

    //portal pair
    if (this.maxSection % 4 === 0 && this.maxSection > 60) {
      if (Math.random() > 0.9) {
        const y =
          constants.sectionHeight -
          (this.maxSection + 1) * constants.sectionHeight
        this.items.push(...Portal.createPair(y))
      }
    }
    //antigrav
    if (this.maxSection % 8 === 0) {
      if (Math.random() > 0.8) {
        const y =
          constants.sectionHeight -
          (this.maxSection + 1) * constants.sectionHeight
        this.items.push(
          new Item({ x: constants.screenWidth / 2, y }, ItemType.AntiGravity)
        )
      }
    }
    this.platforms.push(...platforms)
  }

  handleCollisions() {
    this.player.handleCollisions([...this.platforms, ...this.items])
  }

  onShopContinueClick() {
    this.player.vel.y -= 50
  }
  onShopAbilityClick(ability: Ability) {
    this.player.abilities.push(ability)
    if (!this.player.selectedAbility) {
      this.player.selectedAbility = ability
    }
    shopInventory.value = shopInventory.value.filter((a) => a !== ability)

    this.player.coins.value.splice(0, ability.price)
    this.player.coins.notify()
  }
}
