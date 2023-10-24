// 将下面的伪数组转换为真数组
var fakeArr = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};

var arr = Array.prototype.slice.call(fakeArr);
console.log(arr);
// 或者使用
var arr1 = [].slice.call(fakeArr);
console.log(arr1);