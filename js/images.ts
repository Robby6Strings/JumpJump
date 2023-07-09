export const imageRefs = [
  { image: "space.png", speed: 0.166 },
  { image: "coin.png", speed: 0.166 },
  { image: "portal.png", speed: 0 },
  { image: "portal2.png", speed: 0 },
]

type Image = {
  image: HTMLImageElement
  speed: number
  name: string
}
const images: Image[] = []
export const getImages = () => images
let imagesLoaded = 0

export const loadImages = (cb: { (): void }) => {
  imageRefs.forEach((imgRef) => {
    const image = new Image()
    image.src = `../img/${imgRef.image}`
    image.onload = () => {
      console.log("Image loaded", image)
      imagesLoaded++
      if (imagesLoaded === imageRefs.length) {
        console.log("All images loaded", images)
        cb()
      }
    }
    images.push({
      image,
      speed: imgRef.speed,
      name: imgRef.image,
    })
  })
}
