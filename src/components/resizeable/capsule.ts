import Shape, { ShapeOption } from 'components/resizeable/shape'

export interface CapsuleOption extends ShapeOption {
  borderWidth?: number;
}

export default class Capsule extends Shape {
  // eslint-disable-next-line no-useless-constructor
  constructor (option: CapsuleOption) {
    super(option)
  }

  draw (ctx: CanvasRenderingContext2D) {
    const {
      canvas: {
        width,
        height
      }
    } = ctx
    ctx.clearRect(0, 0, width, height)
    const { borderWidth = 10 } = this
    const radius = Math.min(width, height) / 2 - borderWidth
    this.setStyle(ctx)
    ctx.beginPath()
    ctx.arc(0, -height / 2 + borderWidth + radius, radius, 0, Math.PI, true)
    ctx.arc(0, height / 2 - borderWidth - radius, radius, Math.PI, 0, true)
    ctx.closePath()
    this.complete(ctx)
  }

  [Symbol.toStringTag] = 'Capsule'
}
