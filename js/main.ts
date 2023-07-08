import { ctx, bgCtx } from "./elements.js"
import { constants } from "./constants.js"
import { game } from "./game.js"

let frameRef: number | null = null

const backgroundLayers = [{ image: "castle.jpg", speed: 0.33 }]

type Image = {
  image: HTMLImageElement
  speed: number
  name: string
}
const images: Image[] = []
let imagesLoaded = 0

backgroundLayers.forEach((layer) => {
  const image = new Image()
  image.src = `../img/${layer.image}`
  image.onload = () => {
    imagesLoaded++
    if (imagesLoaded === backgroundLayers.length) {
      // All images are loaded, start the game
      main()
    }
  }
  images.push({
    image,
    speed: layer.speed,
    name: layer.image,
  })
})

let bgPattern: CanvasPattern | null = null

function main() {
  bgPattern = bgCtx.createPattern(images[0].image, "repeat")!
  bgCtx.fillStyle = bgPattern

  loop()
}
function stop() {
  if (frameRef) {
    cancelAnimationFrame(frameRef)
    frameRef = null
  }
}

function loop() {
  ctx.clearRect(0, 0, constants.screenWidth, constants.screenHeight)
  bgCtx.clearRect(0, 0, constants.screenWidth, constants.screenHeight)
  bgCtx.translate(0, game.player.vel.y * -images[0].speed)
  bgCtx.fillRect(
    0,
    -constants.screenHeight * 999,
    constants.screenWidth,
    constants.screenHeight * 1000
  )

  game.tick()
  for (const object of game.objects) {
    object.draw(ctx, game.camera.offsetY)
  }

  //game.camera.draw(ctx)

  // render score
  ctx.fillStyle = "white"
  ctx.font = "13px monospace"
  ctx.fillText(`Height: ${game.score}`, 10, 20)
  frameRef = requestAnimationFrame(loop)
}
