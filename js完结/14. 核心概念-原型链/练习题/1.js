// toString方法属于Object.prototype，它会把对象转换为字符串的形式 [object Object]
// 这种格式并非每个对象想要的
// 1. 解释数组的toString为什么能得到不同的格式
// 2. 如果自己的构造函数希望改变toString，如何改变
console.log(Array.prototype.toString === Object.prototype.toString, 'js完结/14. 核心概念-原型链/练习题/1.js-第5行')

var obj = {
  a: 1,
  b: 2,
  c: 3
}
console.log(obj.toString(), 'js完结/14. 核心概念-原型链/练习题/1.js-第12行')
var arr = [1, 2, 3]
console.log(arr.toString(), 'js完结/14. 核心概念-原型链/练习题/1.js-第14行')

console.log(Object.prototype.toString.call(arr), 'js完结/14. 核心概念-原型链/练习题/1.js-第16行') // [object Array]