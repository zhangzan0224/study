// 创建一个没有隐式原型的用户对象，随意添加一些属性
// console.log(Object.prototype)
// 第一种
const abc = Object.create(null)
abc.a = 1
abc.b = 2
console.log(abc, 'js完结/14. 核心概念-原型链/练习题/3.js-第11行')

// 第二种

var user = {
  abc: 1
}

Object.setPrototypeOf(user, null)
console.log(user, 'js完结/14. 核心概念-原型链/练习题/3.js-第16行')