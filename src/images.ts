import { images } from "./state"

export const imageRefs = [
  { image: "space.png", speed: 0.166 },
  { image: "coin.png", speed: 0.166 },
  { image: "portal.png", speed: 0 },
  { image: "portal2.png", speed: 0 },
  { image: "antigravity.png", speed: 0 },
  { image: "shop.png", speed: 0 },
  { image: "snail.png", speed: 0 },
  { image: "boot.png", speed: 0 },
  { image: "thaw.png", speed: 0 },
]

export type GameImage = {
  image: HTMLImageElement
  speed: number
  name: string
}
let imagesLoaded = 0

export const loadImages = (cb: { (): void }) => {
  imageRefs.forEach((imgRef) => {
    const image = new Image()
    image.src = `../img/${imgRef.image}`
    image.onload = () => {
      imagesLoaded++
      if (imagesLoaded === imageRefs.length) {
        cb()
      }
    }
    images.value.push({
      image,
      speed: imgRef.speed,
      name: imgRef.image,
    })
  })
}
