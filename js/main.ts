import { ctx } from "./elements.js"
import { constants } from "./constants.js"
import { game } from "./game.js"

let frameRef: number | null = null

function main() {
  loop()
}
function stop() {
  if (frameRef) {
    cancelAnimationFrame(frameRef)
    frameRef = null
  }
}

function loop() {
  ctx.fillStyle = "#111"
  ctx.fillRect(0, 0, constants.screenWidth, constants.screenHeight)

  game.tick()
  for (const object of game.objects) {
    object.draw(ctx, game.camera.offsetY)
  }

  game.camera.draw(ctx)

  // render score
  ctx.fillStyle = "white"
  ctx.font = "20px Arial"
  ctx.fillText(`Height: ${game.score}`, 10, 20)
  frameRef = requestAnimationFrame(loop)
}

main()
