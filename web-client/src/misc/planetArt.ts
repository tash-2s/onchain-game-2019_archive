import BN from "bn.js"

import { PlanetKind } from "../constants"

const canvasCache: { [key: string]: HTMLCanvasElement } = {}

export const draw = (
  canvas: HTMLCanvasElement,
  sideLength: number,
  planetKind: PlanetKind,
  artVersion: number,
  artRarity: number,
  artSeed: BN
) => {
  const cacheKey = `${planetKind}-${artVersion}-${artRarity}-${artSeed.toString()}`

  if (!canvasCache[cacheKey]) {
    if (artVersion !== 0) {
      throw new Error(`unimplemented version: ${artVersion}`)
    }
    canvasCache[cacheKey] = drawV0(
      planetKind,
      artRarity,
      new SeededRandomish(artSeed)
      // ArtStringController.generate(planetKind, artVersion, artRarity, artSeed)
    )
  }

  const drawnOffscreenCanvas = canvasCache[cacheKey]

  canvas.width = drawnOffscreenCanvas.width
  canvas.height = drawnOffscreenCanvas.height
  canvas.style.width = `${sideLength}px`
  canvas.style.height = `${sideLength}px`
  getCanvasContext(canvas).drawImage(drawnOffscreenCanvas, 0, 0)
  canvas.dataset.drawn = "1"
}

const drawV0 = (kind: PlanetKind, rarity: number, r: SeededRandomish, debugStr?: string) => {
  const canvas = document.createElement("canvas")
  const ctx = getCanvasContext(canvas)

  canvas.width = canvasSideLength
  canvas.height = canvasSideLength

  const { hue, saturation, lightness, opacity } = getColorAttributes(r)
  const { hueTheory, hueTheoryBase } = getHueTheory(hue, r)
  const colorRands = getColorRands(r)

  ctx.save()

  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, canvasSideLength, canvasSideLength)

  ctx.globalCompositeOperation = r.random() < 0.2 ? "lighter" : "source-over"

  const shapeCount = Math.ceil(r.midpointWeightedRandom() * 16)
  for (let n = 0; n < shapeCount; n++) {
    ctx.beginPath()
    ctx.lineWidth = Math.ceil(r.midpointWeightedRandom() * 75)

    ctx.strokeStyle = getColor(
      r.sampleArrayElement(colorRands),
      hue,
      saturation,
      lightness,
      opacity,
      hueTheory,
      hueTheoryBase
    )

    const sizeBase = r.random()

    const rotationOrCutout = r.random() < 0.5
    const rotationDeg = rotationOrCutout ? Math.floor(r.random() * FULL_DEG) : 0

    switch (kind) {
      case "residence":
        drawSquare(ctx, sizeBase, rotationDeg)
        break
      case "goldmine":
        drawTriangle(ctx, sizeBase, rotationDeg)
        break
      case "technology":
        const startRad = rotationOrCutout ? r.random() * FULL_RAD : 0
        const endRad = rotationOrCutout ? r.random() * FULL_RAD : FULL_RAD
        drawCircle(ctx, sizeBase, startRad, endRad)
        break
      default:
        throw new Error("undefined kind")
    }

    ctx.stroke()
  }

  ctx.restore()

  // if (debugStr) {
  //   const parentDiv = document.createElement("div"),
  //     textDiv = document.createElement("div")

  //   parentDiv.style.position = "relative"
  //   parentDiv.style.display = "inline-block"

  //   textDiv.style.color = "white"
  //   textDiv.style.position = "absolute"
  //   textDiv.style.top = "0px"
  //   textDiv.innerText = debugStr

  //   parentDiv.appendChild(canvas)
  //   parentDiv.appendChild(textDiv)
  //   document.body.appendChild(parentDiv)
  // } else {
  //   document.body.appendChild(canvas)
  // }

  return canvas
}

const FULL_DEG = 360
const FULL_RAD = Math.PI * 2
const ONE_THIRD = 1 / 3

const degToRad = (deg: number) => (deg * Math.PI) / 180

const canvasSideLength = 1000
const centerX = canvasSideLength / 2,
  centerY = canvasSideLength / 2

const getCanvasContext = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d", { alpha: false })
  if (!ctx) {
    throw new Error("couldn't get a context from the canvas")
  }
  return ctx
}

class SeededRandomish {
  static seedBit = 64

  private _a: number
  private _b: number
  private _toggle: boolean

  constructor(seed: BN) {
    const str = seed.toString(2, SeededRandomish.seedBit)
    const halfBit = SeededRandomish.seedBit / 2

    let shuffledStr = ""
    for (let i = 0; i < halfBit; i++) {
      shuffledStr = shuffledStr + str.charAt(i) + str.charAt(SeededRandomish.seedBit - 1 - i)
    }
    const shuffledSeed = new BN(shuffledStr, 2)

    this._a = shuffledSeed.maskn(halfBit).toNumber()
    this._b = shuffledSeed.shrn(halfBit).toNumber()
    this._toggle = true
  }

  random() {
    let t: number

    const c = 0x6d2b79f5
    if (this._toggle) {
      t = this._a += c
    } else {
      t = this._b += c
    }
    this._toggle = !this._toggle

    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  midpointWeightedRandom(count = 3) {
    let sum = 0
    for (let i = 0; i < count; i++) {
      sum += this.random()
    }
    return sum / count
  }

  sampleArrayElement<T>(arr: Array<T>) {
    return arr[Math.floor(this.random() * arr.length)]
  }
}

const getRandomFromInclusiveRange = (randomNumber: number, min: number, max: number) => {
  const ceiledMin = Math.ceil(min)
  const flooredMax = Math.floor(max)
  return Math.floor(randomNumber * (flooredMax - ceiledMin + 1)) + ceiledMin
}

const getRandomHue = (randomNumber: number) => {
  return Math.floor(FULL_DEG * randomNumber)
}

const getRandomSaturation = (randomNumber: number) => {
  return getRandomFromInclusiveRange(randomNumber, 40, 100)
}

const getRandomLightness = (randomNumber: number) => {
  return getRandomFromInclusiveRange(randomNumber, 20, 100)
}

const getRandomOpacity = (randomNumber: number) => {
  return getRandomFromInclusiveRange(randomNumber, 50, 100)
}

const resetTransform = (c: CanvasRenderingContext2D) => c.setTransform(1, 0, 0, 1, 0, 0)

const rotate = (c: CanvasRenderingContext2D, deg: number) => {
  if (deg !== 0) {
    c.translate(centerX, centerY)
    c.rotate(degToRad(deg))
    c.translate(-centerX, -centerY)
  }
}

const resetRotation = (c: CanvasRenderingContext2D, deg: number) => {
  if (deg !== 0) {
    resetTransform(c)
  }
}

const drawSquare = (c: CanvasRenderingContext2D, sizeBase: number, rotationDeg: number) => {
  const sideLength = Math.ceil(sizeBase * 600),
    halfSideLength = sideLength / 2

  rotate(c, rotationDeg)

  c.moveTo(centerX - halfSideLength, centerY - halfSideLength)
  c.lineTo(centerX + halfSideLength, centerY - halfSideLength)
  c.lineTo(centerX + halfSideLength, centerY + halfSideLength)
  c.lineTo(centerX - halfSideLength, centerY + halfSideLength)
  c.closePath()

  resetRotation(c, rotationDeg)
}

const drawTriangle = (c: CanvasRenderingContext2D, sizeBase: number, rotationDeg: number) => {
  const sideLength = Math.ceil(sizeBase * 700),
    halfSideLength = sideLength / 2
  const centerFromTopLength = sideLength / Math.sqrt(3)
  const topY = centerY - centerFromTopLength
  const height = (sideLength * Math.sqrt(3)) / 2

  rotate(c, rotationDeg)

  c.moveTo(centerX, topY)
  c.lineTo(centerX + halfSideLength, topY + height)
  c.lineTo(centerX - halfSideLength, topY + height)
  c.closePath()

  resetRotation(c, rotationDeg)
}

const drawCircle = (
  c: CanvasRenderingContext2D,
  sizeBase: number,
  startRad: number,
  endRad: number
) => {
  const radius = Math.ceil(sizeBase * 450)
  c.arc(centerX, centerY, radius, startRad, endRad)
}

const getColorAttributes = (r: SeededRandomish) => {
  let hue: number | null = null
  let saturation: number | null = null
  let lightness: number | null = null

  const rn = r.random()
  if (rn < ONE_THIRD) {
    saturation = getRandomSaturation(r.random())
    lightness = getRandomLightness(r.random())
  } else if (rn < ONE_THIRD * 2) {
    hue = getRandomHue(r.random())
    lightness = getRandomLightness(r.random())
  } else {
    hue = getRandomHue(r.random())
    saturation = getRandomSaturation(r.random())
  }

  const opacity = getRandomOpacity(r.random())

  return { hue, saturation, lightness, opacity }
}

type HueTheory = "analogous" | "complementary" | "triadic"

const getHueTheory = (hue: number | null, r: SeededRandomish) => {
  let theory: HueTheory | null = null
  let theoryBase: number | null = null

  if (!hue && r.random() < 0.5) {
    theoryBase = getRandomHue(r.random())
    const rn = r.random()
    if (rn < ONE_THIRD) {
      theory = "analogous"
    } else if (rn < ONE_THIRD * 2) {
      theory = "complementary"
    } else {
      theory = "triadic"
    }
  }

  return { hueTheory: theory, hueTheoryBase: theoryBase }
}

const getColorRands = (r: SeededRandomish) => {
  const quantity = r.random() < 0.5 ? 32 : r.random() < 0.5 ? 2 : 3
  const rands: Array<number> = []
  for (let i = 0; i < quantity; i++) {
    rands.push(r.random())
  }
  return rands
}

const getColor = (
  rn: number,
  hue: number | null,
  saturation: number | null,
  lightness: number | null,
  opacity: number,
  hueTheory: HueTheory | null,
  hueTheoryBase: number | null
) => {
  if ([hue, saturation, lightness].filter(n => n === null).length !== 1) {
    throw new Error(`wrong hsl: ${hue}, ${saturation}, ${lightness}`)
  }

  if (hue) {
    const _saturation = saturation || getRandomSaturation(rn)
    const _lightness = lightness || getRandomLightness(rn)
    return `hsla(${hue}deg, ${_saturation}%, ${_lightness}%, ${opacity}%)`
  }

  let _hue: number | null = null

  if (hueTheory && hueTheoryBase) {
    const w = 60
    const d = Math.floor(w * rn)

    switch (hueTheory) {
      case "analogous":
        _hue = (hueTheoryBase + d) % FULL_DEG
        break
      case "complementary":
        if (d < w / 2) {
          _hue = (hueTheoryBase + d) % FULL_DEG
        } else {
          _hue = (hueTheoryBase + FULL_DEG / 2 + (d - w / 2)) % FULL_DEG
        }
        break
      case "triadic":
        if (d < (w / 3) * 1) {
          _hue = (hueTheoryBase + d) % FULL_DEG
        } else if (d < (w / 3) * 2) {
          _hue = (hueTheoryBase + (FULL_DEG / 3) * 1 + (d - (w / 3) * 1)) % FULL_DEG
        } else {
          _hue = (hueTheoryBase + (FULL_DEG / 3) * 2 + (d - (w / 3) * 2)) % FULL_DEG
        }
        break
      default:
        throw new Error("wrong theory")
    }
  } else {
    _hue = Math.floor(FULL_DEG * rn)
  }

  return `hsla(${_hue}deg, ${saturation}%, ${lightness}%, ${opacity}%)`
}
