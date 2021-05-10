/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */

export default class FixedHeap extends Array {
  #pos = -1 // 指针，初始值为-1

  constructor (length: number, ...args: Array<any>) {
    super(...args)
    this.length = length
  }

  get pointerPos () {
    return this.#pos
  }

  get realLength () {
    let num = 0
    this.forEach(item => item && num++)
    return num
  }

  /**
   * 为固定堆追加内容，如果堆空间满了，先进入的内容会被清除出堆空间以腾出空间给后面的内容
   * @param items 追加的内容
   * @returns {number} 返回数组长度
   */
  push (...items: Array<any>): number {
    const length = this.length
    const pos = this.#pos
    const surplus = (length - pos - 1)
    items.splice(0, items.length - length)
    if (surplus < items.length) {
      const delNum = items.length - surplus
      super.splice(0, delNum)
      this.move(-delNum)
    }
    if (this.#pos < this.realLength - 1) {
      for (let i = this.#pos + 1; i <= length; i++) {
        this[i] = undefined
      }
    }
    for (let i = ++this.#pos, j = 0; j < items.length; i++, j++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this[i] = items[j]
    }
    return this.length
  }

  /**
   * 固定堆栈的开头插入新元素并清除溢出的内容，返回数组的新长度。
   * @param items 在数组开头插入的元素。
   * @returns {number}
   */
  unshift (...items: Array<any>): number {
    super.unshift(...items)
    super.splice(this.length)
    return this.length
  }

  /**
   * 在固定堆上位置后退
   * @param {number} num 后退多少步
   * @returns {T} 返回后退后位置上的数据
   */
  move (num = 1) {
    if (num > 0) {
      this.#pos = this.#pos + num >= this.length ? this.length - 1 : this.#pos + num
    } else if (num < 0) {
      this.#pos = this.#pos + num < 0 ? 0 : this.#pos + num
    }
    return this[this.#pos]
  }
}

export function newFixedHeap (length: number): FixedHeap {
  return new FixedHeap(length)
  // return new Proxy(new FixedHeap(length), {
  //   get (target, p) {
  //     return Reflect.get(target, p)
  //   },
  //   set (target, p, value) {
  //     try {
  //       Reflect.set(target, p, value)
  //       return true
  //     } catch (e) {
  //       return false
  //     }
  //   }
  // })
}
