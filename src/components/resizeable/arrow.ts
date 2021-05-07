import Shape, { ShapeOption } from 'components/resizeable/shape'

export interface ArrowOption extends ShapeOption {
  borderWidth?: number;
}

export default class Arrow extends Shape {
  // eslint-disable-next-line no-useless-constructor
  constructor (option: ArrowOption) {
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
    const w = width / 2 - borderWidth
    const h = height / 2 - borderWidth
    this.setStyle(ctx)
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(-w, h)
    ctx.lineTo(0, -h)
    ctx.lineTo(w, h)
    ctx.closePath()
    this.complete(ctx)
  }

  [Symbol.toStringTag] = 'Arrow'
}
