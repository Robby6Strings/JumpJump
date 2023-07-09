export const imageRefs = [
  { image: "space.png", speed: 0.166 },
  { image: "stars.jpg", speed: 0.166 },
  { image: "castle.jpg", speed: 0.166 },
]

type Image = {
  image: HTMLImageElement
  speed: number
  name: string
}
export const images: Image[] = []
let imagesLoaded = 0

export const loadImages = (cb: { (): void }) => {
  imageRefs.forEach((layer) => {
    const image = new Image()
    image.src = `../img/${layer.image}`
    image.onload = () => {
      imagesLoaded++
      if (imagesLoaded === imageRefs.length) {
        cb()
      }
    }
    images.push({
      image,
      speed: layer.speed,
      name: layer.image,
    })
  })
}
