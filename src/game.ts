import { constants } from "./constants.js"
import { Platform, PlatformBehaviour } from "./platform.js"
import { Charger, IItem, Item, Portal, Shop } from "./item.js"
import { Player } from "./player.js"
import { Camera } from "./camera.js"
import { ItemType } from "./enums.js"
import { Ability } from "./ability.js"
import { shopInventory } from "./state.js"
import { Vec2 } from "./v2.js"
import { Projectile } from "./projectile.js"
import { LaserTurret, Turret } from "./turret.js"
import { Boss } from "./boss.js"
import { GameObject } from "./gameobject.js"

export class Game {
  camera: Camera
  score: number = 0
  player: Player
  platforms: Platform[] = []
  turrets: Turret[] = []
  projectiles: Projectile[] = []
  lasers: GameObject[] = []
  items: Item[] = []
  bosses: Boss[] = []
  maxSection: number
  isGameOver: boolean = false
  currentShop: Item | null = null
  directionIndicator: Vec2 | null = null
  directionIndicatorIcon: HTMLImageElement | null = null
  speedMultiplier: number = 1
  horizontalVariation: number = 0

  constructor() {
    this.player = new Player()
    this.platforms = [
      new Platform({
        size: { width: 250, height: 20 },
        pos: { x: 200, y: constants.screenHeight - 120 },
        behaviours: [PlatformBehaviour.Bounce, PlatformBehaviour.MovesX],
      }),
    ]
    this.camera = new Camera(this.player)
    this.maxSection = 1
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
    this.platforms = this.platforms.filter((p) => !p.deleted)
    for (const item of this.items) {
      item.tick()
    }
    this.items = this.items.filter((i) => !i.deleted)
    for (const turret of this.turrets) {
      turret.tick()
    }
    this.turrets = this.turrets.filter((t) => !t.deleted)
    for (const projectile of this.projectiles) {
      projectile.tick()
      if (projectile.distanceTo(this.player) > constants.screenHeight * 4) {
        projectile.deleted = true
      }
    }
    this.projectiles = this.projectiles.filter((p) => !p.deleted)

    for (const laser of this.lasers) {
      laser.tick()
    }
    this.lasers = this.lasers.filter((l) => !l.deleted)

    for (const boss of this.bosses) {
      boss.tick()
    }

    // if (this.currentBoss?.deleted) this.currentBoss = null
    // if (!this.currentBoss && this.bosses.length > 0) {
    //   // get closest boss to the player
    //   this.currentBoss = this.bosses.sort((a, b) => {
    //     const aDist = Math.sqrt(
    //       Math.pow(a.pos.x - this.player.pos.x, 2) +
    //         Math.pow(a.pos.y - this.player.pos.y, 2)
    //     )
    //     const bDist = Math.sqrt(
    //       Math.pow(b.pos.x - this.player.pos.x, 2) +
    //         Math.pow(b.pos.y - this.player.pos.y, 2)
    //     )
    //     return aDist - bDist
    //   })[0]
    // }

    this.bosses = this.bosses.filter((n) => !n.deleted)

    // if (this.currentBoss) {
    //   const dist = this.currentBoss.distanceTo(this.player)
    //   const shouldZoom =
    //     dist < constants.screenHeight * this.camera.zoomMultiplier

    //   if (this.camera.zoom > 0.5 && shouldZoom) {
    //     this.camera.zoom -= 0.025
    //   } else if (this.camera.zoom < 1 && !shouldZoom) {
    //     this.camera.zoom += 0.025
    //   }
    // } else if (this.camera.zoom < 1) {
    //   this.camera.zoom += 0.025
    // }

    this.player.tick()
    this.camera.tick()

    this.score = 0
    this.score = Math.floor(
      Math.abs(
        this.player.pos.y - constants.screenHeight + this.player.halfSize.height
      ) / 50
    )

    let curSection =
      Math.abs(Math.floor(this.player.pos.y / constants.sectionHeight)) + 1
    if (curSection > this.maxSection) {
      this.maxSection = curSection
      this.generateNextSection()
    }
    this.renderShopIndicator()
  }

  renderShopIndicator() {
    this.currentShop = this.items
      .filter((i) => i.itemType === ItemType.Shop)
      .sort((a, b) => {
        const aDist = Math.sqrt(
          Math.pow(a.pos.x - this.player.pos.x, 2) +
            Math.pow(a.pos.y - this.player.pos.y, 2)
        )
        const bDist = Math.sqrt(
          Math.pow(b.pos.x - this.player.pos.x, 2) +
            Math.pow(b.pos.y - this.player.pos.y, 2)
        )
        return aDist - bDist
      })[0]

    if (this.currentShop) {
      // check if the shop is outside of the player's view

      const shopPos = this.currentShop.pos
      const playerPos = this.player.pos

      let x = 0
      let y = 0

      const dist = Math.sqrt(
        Math.pow(shopPos.x - playerPos.x, 2) +
          Math.pow(shopPos.y - playerPos.y, 2)
      )

      if (
        dist > constants.screenHeight / 2 &&
        dist < constants.screenHeight * 2
      ) {
        // calculate a coordinate 300px away from the player at an angle that points to the shop

        const angle = Math.atan2(
          shopPos.y - playerPos.y,
          shopPos.x - playerPos.x
        )
        x = constants.screenWidth / 2 + Math.cos(angle) * 250
        y = constants.screenHeight / 2 + Math.sin(angle) * 250

        this.directionIndicator = { x, y }
        this.directionIndicatorIcon = this.currentShop.img
      } else {
        this.clearDirectionIndicator()
      }
    } else {
      this.clearDirectionIndicator()
    }
  }

  clearDirectionIndicator() {
    this.directionIndicator = null
    this.directionIndicatorIcon = null
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
      const x = this.horizontalVariation + Math.random() * (i + 1) * areaWidth
      const y = spawnShop
        ? constants.sectionHeight - this.maxSection * constants.sectionHeight
        : constants.sectionHeight -
          this.maxSection * constants.sectionHeight +
          Math.random() * heightVariance -
          heightVariance / 2

      if (spawnShop) {
        let shopX = Math.random() * constants.screenWidth
        this.items.push(
          new Shop({
            x: shopX,
            y: y - 48,
          })
        )
        didSpawnShop = true
        platforms.push(
          Platform.randomPlatform({ x: shopX, y }, { height: 30, width: 160 }, [
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
      } else if (this.maxSection % 8 === 0) {
        if (Math.random() > 0.8) {
          const y =
            constants.sectionHeight -
            (this.maxSection + 1) * constants.sectionHeight
          this.items.push(new Item({ x, y }, ItemType.AntiGravity))
        }
      } else if (this.maxSection % 3 === 0 && this.maxSection > 5) {
        if (Math.random() > 0.8) {
          this.turrets.push(
            new Turret(
              { x, y: y - 100 },
              [this.player],
              this.addProjectile.bind(this)
            )
          )
        }
      }

      if (
        this.maxSection > 50 &&
        this.maxSection % 3 === 0 &&
        Math.random() > 0.6
      ) {
        this.bosses.push(
          new Boss(
            {
              x,
              y: y - 100,
            },
            this.player
          )
        )
      }

      platforms.push(Platform.randomPlatform({ x, y }))
    }

    this.horizontalVariation += Math.random() * 300 - 150

    this.platforms.push(...platforms)
  }

  addProjectile(proj: GameObject) {
    this.projectiles.push(proj as Projectile)
  }

  addLaser(laser: GameObject) {
    this.lasers.push(laser)
  }

  handleCollisions() {
    this.player.handleCollisions([
      ...this.platforms,
      ...this.items,
      ...this.projectiles,
      ...this.bosses,
    ])
    this.bosses.forEach((b) => {
      b.handleCollisions([...this.platforms, ...this.lasers])
    })
  }

  onShopContinueClick() {
    this.player.vel.y -= 50
  }
  onShopAbilityClick(ability: Ability) {
    this.player.abilities.push(ability)
    shopInventory.value = shopInventory.value.filter((a) => a !== ability)

    this.player.coins.value.splice(0, ability.price)
    this.player.coins.notify()
  }
}
