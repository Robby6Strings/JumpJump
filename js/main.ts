import { ctx, bgCtx } from "./elements.js"
import { constants } from "./constants.js"
import { loadImages, images } from "./images.js"
import { game } from "./game.js"

let frameRef: number | null = null
let bgImage: HTMLImageElement | null = null

loadImages(() => {
  bgImage = images[0].image
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
  ctx.clearRect(0, 0, constants.screenWidth, constants.screenHeight)

  game.tick()
  for (const object of game.platforms) {
    object.draw(ctx, game.camera.offsetY)
  }
  game.player.draw(ctx, game.camera.offsetY)

  const distanceDif = -game.camera.offsetY - lastDistance
  lastDistance = -game.camera.offsetY
  const yTranslate = Math.round(distanceDif * images[0].speed)
  bgCtx.translate(0, yTranslate)
  bgCtx.fillRect(
    0,
    -constants.screenHeight * 999,
    constants.screenWidth,
    constants.screenHeight * 1000
  )

  // render score
  ctx.fillStyle = "white"
  ctx.font = "13px monospace"
  ctx.fillText(`Height: ${game.score}`, 10, 20)
  frameRef = requestAnimationFrame(loop)
}
