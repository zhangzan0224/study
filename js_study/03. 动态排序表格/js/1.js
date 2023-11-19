const numberArray = [40, 1, 5, 200];

function compareNumbers(a, b) {
  console.log(a, b, 'Untitled-1-第3行')
  return a - b;
}
// numberArray.sort(compareNumbers); // [1, 5, 40, 200]

// let arr = [311, 43, 54, 4, 40, 26, 31, 33];
// arr.sort((a, b) => {
//   if (!(a % 2) && b % 2) return 1; // 首先满足条件a为偶数,b为奇数
//   if ((a % 2 && b % 2 || !(a % 2) && !(b % 2)) && a > b) return 1; // 判断a b 均为奇数或偶数 且a > b 即可进行升序排序
//   return -1;
// });
// console.log(arr); // [31, 33, 43, 311, 4, 26, 40, 54]
let arr = [311, 43, 54, 4, 40, 26, 31, 33];
arr.sort((a, b) => {
  console.log(a, b, b - a, 'xxxx');
  return b - a
});
console.log(arr); // [311, 54, 43, 40, 33, 31, 26, 4]