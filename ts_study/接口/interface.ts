// 定义一个接口
interface Person {
  readonly id: number
  name: string
  age?: number
}
interface A {
  T1: string
}
interface B {
  T2: string
}

interface C extends A, B {
  T3: string,
  readonly T4: string,
  readonly T5?: string
}
let u: C = {
  T1: '1',
  T2: '2',
  T3: '3',
  T4: '4'
}
// u.T4 = '5' // 报错
const arr: readonly number[] = [1, 2, 3]
// arr.push(4)
const arr1: ReadonlyArray<number> = [1, 2, 3] // 泛型数组
// arr1.push(5)

