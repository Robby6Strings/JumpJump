import * as Cinnabun from "cinnabun"
import { Transition } from "cinnabun-transitions"
import { constants } from "./constants"
import { loadImages } from "./images"
import {
  HtmlElements,
  bgImage,
  bgImageSpeed,
  createNewGame,
  frameRef,
  game,
  images,
  isShopOpen,
  shopInventory,
} from "./state"
import { Ability, AbilityType } from "./ability"
import { GameObject } from "./gameobject"

export const App = () => {
  let canvasRef: HTMLCanvasElement | undefined = undefined
  let bgCanvasRef: HTMLCanvasElement | undefined = undefined
  const onCanvasRefSet = () => {
    if (canvasRef && bgCanvasRef) {
      HtmlElements.value = {
        canvas: canvasRef,
        bgCanvas: bgCanvasRef,
      }
      loadImages(() => {
        const bgImageData = images.value.find((i) => i.name === "space.png")
        if (!bgImageData) throw new Error("Background image not loaded")
        bgImage.value = bgImageData.image
        bgImageSpeed.value = bgImageData.speed
        main()
      })
    }
  }

  return (
    <div
      style={{
        width: constants.screenWidth + "px",
        height: constants.screenHeight + "px",
        position: "relative",
      }}
    >
      <canvas
        id="bg-canvas"
        onMounted={(el) => {
          bgCanvasRef = el.element as HTMLCanvasElement
          onCanvasRefSet()
        }}
      />
      <canvas
        onMounted={(el) => {
          canvasRef = el.element as HTMLCanvasElement
          onCanvasRefSet()
        }}
      />
      <Transition
        properties={[{ name: "opacity", from: "0", to: "1" }]}
        id="shop-ui"
        watch={isShopOpen}
        bind:visible={() => isShopOpen.value}
        cancelExit={() => isShopOpen.value}
      >
        <h1>Shop</h1>
        <div className="shop-inventory" watch={shopInventory} bind:children>
          {() =>
            shopInventory.value.length > 0 ? (
              shopInventory.value.map((ability) => (
                <ShopAbilityButton ability={ability} />
              ))
            ) : (
              <i>All abilities purchased</i>
            )
          }
        </div>
      </Transition>
    </div>
  )
}

const ShopAbilityButton = ({ ability }: { ability: Ability }) => {
  const player = game!.player
  return (
    <button
      className="shop-ability"
      onclick={() => game!.onShopAbilityClick(ability)}
      watch={player.coins}
      bind:disabled={() => player.numCoins < ability.price}
      bind:title={() =>
        player.numCoins >= ability.price ? "" : "Not enough coins"
      }
    >
      <span className="shop-ability-title">{ability.type}</span>
      <img src={ability.img.src} />
      <small className="shop-ability-price">{ability.price}</small>
    </button>
  )
}

let bgPattern: CanvasPattern | null = null

function main() {
  if (!bgImage.value) throw new Error("Background image not loaded")
  let ctx = HtmlElements.value.ctx
  let bgCtx = HtmlElements.value.bgCtx

  if (!ctx) throw new Error("Context not loaded")
  if (!bgCtx) throw new Error("Background context not loaded")

  shopInventory.value = [new Ability(AbilityType.SlowMo)]

  bgPattern = bgCtx.createPattern(bgImage.value, "repeat")!
  bgCtx.fillStyle = bgPattern
  bgCtx.fillRect(
    -constants.screenWidth * 500,
    -constants.screenHeight * 999,
    constants.screenWidth * 1000,
    constants.screenHeight * 1000
  )
  createNewGame()

  interval = window.setInterval(() => {
    loop()
  }, 1000 / 60)
}

let lastDistanceY = 0
let lastDistanceX = 0
let interval: number | undefined = undefined

function loop() {
  let ctx = HtmlElements.value.ctx
  let bgCtx = HtmlElements.value.bgCtx
  if (!game || !ctx || !bgCtx) return
  ctx.clearRect(0, 0, constants.screenWidth, constants.screenHeight)

  game.tick()
  for (const platform of game.platforms) {
    platform.draw(ctx, game.camera)
  }
  for (const item of game.items) {
    item.draw(ctx, game.camera)
  }
  for (const turret of game.turrets) {
    turret.draw(ctx, game.camera)
  }
  for (const projectile of game.projectiles) {
    projectile.draw(ctx, game.camera)
  }
  for (const boss of game.bosses) {
    boss.draw(ctx, game.camera)
  }
  for (const laser of game.lasers) {
    laser.draw(ctx, game.camera)
  }

  game.player.draw(ctx, game.camera)

  if (game.directionIndicator && game.directionIndicatorIcon) {
    const { x, y } = game.directionIndicator
    ctx.drawImage(game.directionIndicatorIcon, x, y, 50, 50)
  }

  const distanceDifY = -game.camera.offsetY - lastDistanceY
  lastDistanceY = -game.camera.offsetY
  const distanceDifX = -game.camera.offsetX - lastDistanceX
  lastDistanceX = -game.camera.offsetX

  const yTranslate = Math.round(distanceDifY * bgImageSpeed.value)
  const xTranslate = Math.round(distanceDifX * bgImageSpeed.value)

  bgCtx.translate(xTranslate, yTranslate)
  bgCtx.fillRect(
    -constants.screenWidth * 500,
    -constants.screenHeight * 999,
    constants.screenWidth * 1000,
    constants.screenHeight * 1000
  )

  ctx.textAlign = "left"
  // render height
  ctx.fillStyle = "white"
  ctx.font = "13px monospace"
  ctx.fillText(`Height: ${game.score}`, 10, 20)

  // render coins
  ctx.fillText(`Coins: ${game.player.numCoins}`, 10, 40)
}
