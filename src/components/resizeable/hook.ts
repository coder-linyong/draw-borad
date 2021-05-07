import Shape, { ShapeOption } from 'components/resizeable/shape'

export interface HookOption extends ShapeOption {
  borderWidth?: number;
}

export default class Hook extends Shape {
  // eslint-disable-next-line no-useless-constructor
  constructor (option: HookOption) {
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
    ctx.moveTo(w / 2, -h)
    ctx.lineTo(w, -h / 2)
    ctx.lineTo(-w / 4, h)
    ctx.lineTo(-w, 0)
    ctx.lineTo(-w / 2, -h / 2)
    ctx.lineTo(-w / 4, 0)
    ctx.closePath()
    this.complete(ctx)
  }

  [Symbol.toStringTag] = 'Hook'
}
