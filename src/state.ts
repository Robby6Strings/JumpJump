import { createSignal } from "cinnabun"
import { constants } from "./constants"
import { Game } from "./game"
import { GameImage } from "./images"

type HtmlElements = {
  canvas?: HTMLCanvasElement
  ctx?: CanvasRenderingContext2D
  bgCanvas?: HTMLCanvasElement
  bgCtx?: CanvasRenderingContext2D
  fgCanvas?: HTMLCanvasElement
  fgCtx?: CanvasRenderingContext2D
}

export const HtmlElements = createSignal<HtmlElements>({})
HtmlElements.subscribe((elements) => {
  if (elements.canvas) {
    elements.canvas.width = constants.screenWidth
    elements.canvas.height = constants.screenHeight
    elements.ctx = elements.canvas.getContext("2d")!
  }
  if (elements.bgCanvas) {
    elements.bgCanvas.width = constants.screenWidth
    elements.bgCanvas.height = constants.screenHeight
    elements.bgCtx = elements.bgCanvas.getContext("2d")!
  }
})

export let game: Game | undefined = undefined
export const createNewGame = () => {
  game = new Game()
}
export const isShopOpen = createSignal<boolean>(false)
isShopOpen.subscribe((open) => {
  console.log("shop open", open)
})

export const frameRef = createSignal<number | null>(null)
export const images = createSignal<GameImage[]>([])
export const bgImage = createSignal<HTMLImageElement | null>(null)
export const bgImageSpeed = createSignal<number>(0)
