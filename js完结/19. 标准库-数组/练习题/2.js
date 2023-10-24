// 删除数组中的所有字符串
var nums = [1, 1, '1', 'a', 'b', 'a', 3, 5, 3, 7];

// var newNums = nums.filter(function (item) {
//   return typeof item !== 'string';
// });

// console.log(newNums);
// 如果需要改变原数组呢？
for (var i = 0; i < nums.length; i++) {
  if (typeof nums[i] === 'string') {
    nums.splice(i, 1);
    i--; // 注意下标得重新处理下
  }
}
console.log(nums);