// 完成下面的函数
/**
 * 在arr中寻找是否存在target
 * @param {Array} arr 要遍历寻找的数组
 * @param {any} target 要寻找的目标
 * @return {boolean} 是否找到
 */
function includes(arr, target) {
	for (var i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return true;
    }
  }
  return false;
}

// 利用上面的函数，完成下面的练习题
var nums = [1, 3, 8, 2, 5, 1, 9];
/*
1. 判断nums中是否存在8，输出是或否
*/
// console.log(includes(nums, 8))
var nums2 = [6, 3, 2, 7, 11, 33];
/*
2. 判断数字2是否同时存在于nums和nums2中，输出是或否
*/
// console.log(includes(nums, 2) && includes(nums2, 2));
var nums3 = [11, 5, 1];
/*
3. 思考题：判断nums3中是否所有数字都在nums中存在，输出是或否
*/
// function check () {
// 	for (var i = 0; i < nums3.length; i++){
// 		if(!includes(nums, nums3[i])){
// 			return false;
// 		}
// 		return true
// 	}
// }
// console.log(check())
// 刚开始定义所有的数字都在nums中存在
console.log(includes(nums, 11))
var flag = true

function check() {
	for (var index = 0; index < nums3.length; index++) {
		flag = flag && includes(nums, nums3[index])
		if (!flag) {
			break
		}
}
}
console.log(flag)