import fs from 'fs' // 必须得使用esModuleInterop,使用非es的话会报错，因为fs导出的时候使用的不是export default
// 或者使用 import { readFileSync } from 'fs'
let name: string = 'hello'
console.log(name)
/**
 * 冒泡排序
 * @param {number[]} arr
 */
function bubbleSort(arr:Array<number>) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap arr[j] and arr[j + 1]
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([1,2,4,3,6]))
