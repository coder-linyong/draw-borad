export default function (fn: (...arg: Array<any>) => void, wait = 10) {
  let timer: number
  return function (...args: Array<any>) {
    if (!timer) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = 0
      }, wait)
      return fn(...args)
    }
  }
}
