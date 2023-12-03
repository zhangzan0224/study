import { timeLog } from 'console'

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

const tempArr: Array<number> = [1, 2, 3, 4, 5, 6, 7]

function printValue(obj: object) {
  Object.values(obj).forEach(value => console.log(value))
}
printValue({
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
})
// null 和 undefined是所有类型的其他的子类型， 通过添加 "strictNullChecks": true 更严格的空类型检查

// let n: string = undefined 报错
// 联合类型

let n: string | undefined

if (typeof n === 'string') {
  console.log(n.length)
}

// 接口
interface Person {
  readonly id: number
  name: string
  age?: number
  [propName: string]: any // [propName: string] 代表 任意属性，值可以为string或者number
}

// 类型
type Gender = 'male' | 'female'
type Person1 = {
  name: string
  age: number
  gender: Gender 
}
