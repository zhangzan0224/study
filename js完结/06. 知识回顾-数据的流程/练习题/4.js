/*
1. 数组中是否存在某个数，输出 是 或 否
*/
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let flag = false
let target = 8
for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
        flag = true
        break   // 找到了
    }
}
console.log(flag)
/*
2. 数组中是否存在某个数，如果存在，则输出它所在的下标，如果不存在，则输出-1
*/

/*
3. 找到数组中第一个奇数和最后一个奇数，将它们求和
*/
var arr = [32, 24, 32, 33, 34, 35, 36, 37, 38, 39];
// 找到第一个奇数
var first = 0
for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2!== 0) {
        break
    }
}
// 找到最后一个奇数
/*
4. 有两个数组，看两个数组中是否都存在奇数，输出 是 或 否
*/
