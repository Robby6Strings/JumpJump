import { ctx } from "./elements.js"
import { constants } from "./constants.js"
import { game } from "./game.js"

let frameRef: number | null = null

function main() {
  loop()
  frameRef = requestAnimationFrame(main)
}
function stop() {
  if (frameRef) {
    cancelAnimationFrame(frameRef)
    frameRef = null
  }
}

function loop() {
  ctx.fillStyle = "#333"
  ctx.fillRect(0, 0, constants.screenWidth, constants.screenHeight)

  game.tick()
  for (const object of game.objects) {
    object.draw(ctx)
  }
}

main()
