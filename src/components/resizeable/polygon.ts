import Shape, { ShapeOption } from 'components/resizeable/shape'

export interface PolygonOption extends ShapeOption {
  radius: number;
  borderNumber: number;
}

export default class Polygon extends Shape {
  static minRadius = 50
  static minBorderNumber = 3
  radius: number
  borderNumber: number

  constructor (option: PolygonOption) {
    super(option)
    this.radius = option.radius
    this.borderNumber = Math.max(option.borderNumber, Polygon.minBorderWidth)
  }

  /**
   * 绘制方法
   * @param {CanvasRenderingContext2D} ctx 渲染上下文对象
   */
  draw (ctx: CanvasRenderingContext2D) {
    const {
      borderNumber,
      radius
    } = this
    const { canvas: { width, height } } = ctx
    ctx.clearRect(0, 0, width, height)
    this.setStyle(ctx)
    const step = Math.PI * 2 / borderNumber
    ctx.beginPath()
    for (let i = 0; i < Math.PI * 2; i += step) {
      const posX = Math.cos(i) * radius
      const posY = Math.sin(i) * radius
      ctx.lineTo(posX, posY)
    }
    ctx.closePath()
    this.complete(ctx)
  }

  [Symbol.toStringTag] = 'Polygon'
}
