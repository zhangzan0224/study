/**
 * 修改对象，仅保留需要的属性
 * @param {Object} obj 要修改的对象
 * @param {Array<string>} keys 需要保留的属性名数组
 */
function pick(obj, keys) {
  for (const key in obj) {
    if (!includes(keys, key)) {
      delete obj[key];
    }
  }
}
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
var obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
}

pick(obj, ['a', 'c']) // {a:1, c:3}
console.log(obj)