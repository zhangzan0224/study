const {
  log
} = console
log(NaN === NaN) // false
log(+0 === -0) // true
// Object.is()
log(Object.is(NaN, NaN)) // true
log(Object.is(+0, -0)) // false


// Object.assign()
// Object.assign(target, ...sources) 会更改 target的值

// Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。
// 3 getOwnPropertyNames() 获取返回对象上找到的自有属性对于的字符串数组，规则，先排数组升序排序，然后按照书写熟悉排序
// Object.getOwnPropertyNames()

// 4 设置某个对象的隐式原型
const obj1 = {
  a: 1
}
const obj2 = {
  b: 2
}
Object.setPrototypeOf(obj1, obj2) // 相当于 obj1.__proto__ = obj2
console.log(obj1.b); // 2