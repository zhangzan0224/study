// 数组去重
var nums = [1, 1, '1', 'a', 'b', 'a', 3, 5, 3, 7];

// var arr = [];
// for (var i = 0; i < nums.length; i++) {
//   if (arr.indexOf(nums[i]) === -1) {
//     arr.push(nums[i]);
//   }
// }
// console.log(arr);
// console.log([...new Set(nums)])

for (var i = 0; i < nums.length; i++) {
  var item = nums[i];
  // 判断item 在下标i之后是否还有重复的，有的话全部删除
  while (nums.indexOf(item, i + 1) !== -1) {
    nums.splice(nums.indexOf(item, i + 1), 1);
  }
}
console.log(nums);