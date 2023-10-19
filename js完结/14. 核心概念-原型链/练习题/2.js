var arr1 = [1, 2, 3, 4]; // 真数组
// 类数组(伪数组)
var arr2 = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4,
};

// 判断arr1和arr2是否是真数组
console.log(arr1 instanceof Array, 'js完结/14. 核心概念-原型链/练习题/2.js-第13行') // true
console.log(arr1 instanceof Object, 'js完结/14. 核心概念-原型链/练习题/2.js-第13行') // true
console.log(arr2 instanceof Array, 'js完结/14. 核心概念-原型链/练习题/2.js-第14行') // false
console.log(arr1.__proto__, 'js完结/14. 核心概念-原型链/练习题/2.js-第15行')
// []
console.log(arr2.__proto__, 'js完结/14. 核心概念-原型链/练习题/2.js-第15行') // {}