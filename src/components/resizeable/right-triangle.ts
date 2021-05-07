import Shape, { ShapeOption } from 'components/resizeable/shape'

export interface TriangleOption extends ShapeOption {
  borderWidth?: number;
}

export default class RightTriangle extends Shape {
  // eslint-disable-next-line no-useless-constructor
  constructor (option: TriangleOption) {
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
    const w = (width - borderWidth * 2) / 2
    const h = (height - borderWidth * 2) / 2
    this.setStyle(ctx)
    ctx.lineJoin = 'miter'
    ctx.beginPath()
    ctx.moveTo(-w, -h)
    ctx.lineTo(-w, h)
    ctx.lineTo(w, h)
    ctx.closePath()
    this.complete(ctx)
  }

  [Symbol.toStringTag] = 'RightTriangle'
}
