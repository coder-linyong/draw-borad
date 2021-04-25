export default class Eraser {
  static maxSize = 100
  static minSize = 1
  size

  constructor ({
    size = 1
  } = {}) {
    const {
      maxSize,
      minSize
    } = Eraser
    this.size = size < minSize ? minSize : Math.min(maxSize, size)
  }
}
