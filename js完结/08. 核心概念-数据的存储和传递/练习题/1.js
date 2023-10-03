
/**
 * 交换两个变量的值
 * @param {*} a 变量1
 * @param {*} b 变量2
 */
var a = 2, b= 10;
var { a, b} = swap(a, b);

function swap(a, b) {
  var temp = a +b 
  b = temp - b
  a = temp - a
  return { a , b }
}

console.log(a, b)

