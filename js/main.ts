import { ctx, bgCtx } from "./elements.js"
import { constants } from "./constants.js"
import { getImages, loadImages } from "./images.js"
import { Game } from "./game.js"

const createNewGame = () => {
  return new Game(createNewGame)
}
export let game: Game | undefined = undefined

let frameRef: number | null = null
let bgImage: HTMLImageElement | null = null
let bgImageSpeed = 0

loadImages(() => {
  const images = getImages()
  bgImage = images[0].image
  bgImageSpeed = images[0].speed
  main()
})

let bgPattern: CanvasPattern | null = null

function main() {
  if (!bgImage) throw new Error("Background image not loaded")
  bgPattern = bgCtx.createPattern(bgImage, "repeat")!
  bgCtx.fillStyle = bgPattern
  bgCtx.fillRect(
    0,
    -constants.screenHeight * 999,
    constants.screenWidth,
    constants.screenHeight * 1000
  )
  game = createNewGame()

  loop()
}
function stop() {
  if (frameRef) {
    cancelAnimationFrame(frameRef)
    frameRef = null
  }
}
let lastDistance = 0
function loop() {
  if (!game) return
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
  const yTranslate = Math.round(distanceDif * bgImageSpeed)
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

  frameRef = requestAnimationFrame(loop)
}
