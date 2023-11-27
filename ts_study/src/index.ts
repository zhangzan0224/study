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

function isOdd(n: number): boolean {
  return n % 2 === 1
}
console.log('idOdd1111122', isOdd(4))

// 数组
const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function printValue(obj:object) {
   
}