import Shape, { ShapeOption } from 'components/resizeable/shape'

export interface StarOption extends ShapeOption {
  angleNum: number;
}

export default class Star extends Shape {
  angleNum: number

  // eslint-disable-next-line no-useless-constructor
  constructor (option: StarOption) {
    super(option)
    this.angleNum = option.angleNum
  }

  draw (ctx: CanvasRenderingContext2D) {
    const {
      canvas: {
        width,
        height
      }
    } = ctx
    ctx.clearRect(0, 0, width, height)
    const {
      borderWidth = 10,
      angleNum
    } = this
    const r1 = Math.min(width, height) / 2 - borderWidth
    const r2 = r1 / 2
    const step = Math.PI * 2 / angleNum
    this.setStyle(ctx)
    ctx.beginPath()
    ctx.moveTo(0, r2)
    for (let i = 0; i < angleNum; i++) {
      const ag1 = i * step + Math.PI / 2
      const ag2 = i * step + Math.PI / 2 + step / 2
      ctx.lineTo(Math.cos(ag1) * r2, Math.sin(ag1) * r2)
      ctx.lineTo(Math.cos(ag2) * r1, Math.sin(ag2) * r1)
    }
    ctx.closePath()
    this.complete(ctx)
  }

  [Symbol.toStringTag] = 'Star'
}
