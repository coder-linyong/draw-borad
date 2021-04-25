export default class Brush {
  static maxSize = 100
  static minSize = 1
  static maxTransparency = 255
  static minTransparency = 1
  size
  transparency
  color

  constructor ({
    size = 1,
    transparency = 255,
    color = '#000'
  } = {}) {
    const {
      maxSize,
      minSize,
      maxTransparency,
      minTransparency
    } = Brush
    this.size = size < minSize ? minSize : Math.min(maxSize, size)
    this.transparency = transparency < minTransparency ? minTransparency : Math.min(maxTransparency, transparency)
    this.color = color
  }
}
