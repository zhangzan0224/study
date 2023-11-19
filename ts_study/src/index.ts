let say: string = 'hello'
console.log('aaaabbb')

function sum(a: number, b: number): number {
  return a + b
}
let num: number = sum(1, 2)

let nums: number[] = [1, 2, 3]

// 联合类型

let name: string | undefined
name = 'abc'
if (typeof name === 'string') {
  console.log('====================================')
  console.log(name.toUpperCase())
  console.log('====================================')
}
