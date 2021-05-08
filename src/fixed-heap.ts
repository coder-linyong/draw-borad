/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */

export default class FixedHeap extends Array {
  constructor (length: number, ...args: Array<any>) {
    super(...args)
    this.length = length
  }

  /**
   * 为固定堆追加内容，如果堆空间满了，先进入的内容会被清除出堆空间以腾出空间给后面的内容
   * @param items 追加的内容
   * @returns {number} 返回数组长度
   */
  push (...items: Array<any>): number {
    const length = this.length
    const realLength = this.getRealLength()
    items.splice(0, items.length - length)
    if ((length - realLength) < items.length) {
      super.splice(0, items.length - (length - realLength))
    }
    for (let i = this.getRealLength(), j = 0; j < items.length; i++, j++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this[i] = items[j]
    }
    return this.length
  }

  unshift (...items:Array<any>): number {
    super.unshift(...items)
    super.splice(this.length)
    return this.length
  }

  getRealLength (): number {
    let num = 0
    this.forEach(item => item && num++)
    return num
  }
}

export function newFixedHeap (length: number):FixedHeap {
  const fixedHeap = new FixedHeap(length)
  return new Proxy(fixedHeap, {
    get (target, p) {
      return Reflect.get(target, p)
    },
    set (target, p, value) {
      try {
        Reflect.set(target, p, value)
        return true
      } catch (e) {
        return false
      }
    }
  })
}
