export interface ShapeOption {
  lineDash?: [number, number];
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
  fillColor?: string;
  transparency?: number;
  x?: number;
  y?: number;
}

export default class Shape {
  static maxTransparency = 100
  static minTransparency = 1
  static maxBorderWidth = 100
  static minBorderWidth = 1

  lineDash?: [number, number]
  border?: boolean
  borderColor?: string
  borderWidth?: number
  fill?: boolean
  fillColor?: string
  transparency?: number
  rotate?: number
  x?: number
  y?: number

  /**
   * 所有形状的父类
   * @param {[number,number]} lineDash 虚线模式的值
   * @param {boolean} border 是否有边框，如果没有填充，则必须有边框
   * @param {string} borderColor 边框颜色
   * @param {number} borderWidth 边框宽度
   * @param {boolean} fill 是否填充
   * @param {string} fillColor 填充颜色
   * @param {number} transparency 透明度
   * @param {number} rotate 旋转角度
   * @param {number} x x轴位置
   * @param {number} y y轴位置
   */
  constructor ({
    lineDash = [0, 0],
    border = true,
    borderColor = '#000',
    borderWidth = 10,
    fill = false,
    fillColor = '#000',
    transparency = 100,
    x = 0,
    y = 0
  } = {}) {
    this.lineDash = [lineDash[0], lineDash[1]]
    this.border = (!border && !fill) ? true : border
    this.borderColor = borderColor
    this.borderWidth = [Shape.minBorderWidth, Shape.maxBorderWidth, borderWidth].sort()[1]
    this.fill = fill
    this.fillColor = fillColor
    this.transparency = [Shape.minTransparency, Shape.maxTransparency, transparency].sort()[1]
    this.x = x
    this.y = y
  }

  setStyle (ctx: CanvasRenderingContext2D) {
    const {
      x = 0,
      y = 0,
      borderColor = '#000',
      borderWidth = 10,
      fillColor = '#000',
      lineDash = [0, 0],
      transparency = 100
    } = this
    ctx.save()
    ctx.translate(x, y)
    ctx.setLineDash(lineDash)
    ctx.fillStyle = fillColor
    ctx.lineWidth = borderWidth
    ctx.globalAlpha = transparency / 100
    ctx.strokeStyle = borderColor
  }

  complete (ctx: CanvasRenderingContext2D) {
    const {
      border,
      fill
    } = this
    if (!border && !fill) {
      this.border = true
    }
    border && ctx.stroke()
    fill && ctx.fill()
    ctx.restore()
  }

  [Symbol.toStringTag] ='Shape'
}
