/**
 * 交换数组两个位置的值
 * @param {Array} arr 数组
 * @param {number} i1 下标1
 * @param {number} i2 下标2
 */
function swap(arr, i1, i2) {
  const temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
}

var arr = [1,2]
swap(arr, 0,1)
console.log(arr)
