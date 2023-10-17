// 为所有对象添加方法print，打印对象的键值对
var obj = {
  a: 1,
  b: 2,
  c: 3
}
var obj2 = {
  a: 'a',
  b: 'b',
  c: 'c'
}
Object.prototype.print = function () {
  for (var key in this) {
    // 判断这个属性是不是在对象本身上，而不是在隐式原型上
    // if (Object.prototype.hasOwnProperty.call(this, key))
    if (this.hasOwnProperty(key)) {
      console.log('打印对象的键值对', key + '值是' + this[key]);
    }
  }
}

obj.print();
obj2.print();