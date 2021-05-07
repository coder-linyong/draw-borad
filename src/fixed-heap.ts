// @todo 完成所有继承自数组的添加删除方法
class FixedHeap extends Array {
  #length = 0

  constructor (length: number, ...args: Array<any>) {
    super(...args)
    this.setLength(length)
  }

  push (...items:Array<any>): number {
    //
    return this.#length
  }

  unshift (...items:Array<any>): number {
    return this.#length
  }

  getLength () {
    return this.#length
  }

  setLength (length: number) {
    this.#length = length
    this.length = length
  }
}

export function getFixedHeap (length: number, ...args: Array<any>) {
  const fixedHeap = new FixedHeap(length, ...args)
  const proxy = new Proxy(fixedHeap, {
    get (target: FixedHeap, p: string | symbol, receiver: any): any {
      if (p === 'length') {
        return target.getLength()
      }
    },
    set (target: FixedHeap, p: string | symbol, value: any, receiver: any): boolean {
      try {
        if (p === 'length') {
          target.setLength(value)
        }
        return true
      } catch (e) {
        return false
      }
    }
  })
  return proxy
}
