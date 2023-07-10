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
} from "./state"

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
      >
        <h1>Shop</h1>
        <div style="margin-top:auto">
          <button
            onclick={() => {
              isShopOpen.value = false
              console.log(game)
              game?.onShopContinueClick()
            }}
          >
            Continue
          </button>
        </div>
      </Transition>
    </div>
  )
}

let bgPattern: CanvasPattern | null = null

function main() {
  if (!bgImage.value) throw new Error("Background image not loaded")
  let ctx = HtmlElements.value.ctx
  let bgCtx = HtmlElements.value.bgCtx

  if (!ctx) throw new Error("Context not loaded")
  if (!bgCtx) throw new Error("Background context not loaded")

  bgPattern = bgCtx.createPattern(bgImage.value, "repeat")!
  bgCtx.fillStyle = bgPattern
  bgCtx.fillRect(
    0,
    -constants.screenHeight * 999,
    constants.screenWidth,
    constants.screenHeight * 1000
  )
  createNewGame()

  loop()
}

let lastDistance = 0
function loop() {
  let ctx = HtmlElements.value.ctx
  let bgCtx = HtmlElements.value.bgCtx
  if (!game || !ctx || !bgCtx) return
  ctx.clearRect(0, 0, constants.screenWidth, constants.screenHeight)

  game.tick()
  for (const platform of game.platforms) {
    platform.draw(ctx, game.camera.offsetY)
  }
  for (const item of game.items) {
    item.draw(ctx, game.camera.offsetY)
  }
  game.player.draw(ctx, game.camera.offsetY)

  const distanceDif = -game.camera.offsetY - lastDistance
  lastDistance = -game.camera.offsetY
  const yTranslate = Math.round(distanceDif * bgImageSpeed.value)
  bgCtx.translate(0, yTranslate)
  bgCtx.fillRect(
    0,
    -constants.screenHeight * 999,
    constants.screenWidth,
    constants.screenHeight * 1000
  )

  // render height
  ctx.fillStyle = "white"
  ctx.font = "13px monospace"
  ctx.fillText(`Height: ${game.score}`, 10, 20)

  // render coins
  ctx.fillText(`Coins: ${game.player.coins}`, 10, 40)

  frameRef.value = requestAnimationFrame(loop)
}
