## new做了什么

1.  创建一个简单的对象
2.  修改该对象的__proto__属性对应的值
3.  将this指向这个对象
4.  如果没有显示的返回对象或者函数，那么就隐式的返回this

```javascript
function Preson(name, age) {
  // 1 创建一个新的对象
  var obj = {}
  // 修改该对象的__proto__属性，形成三角关系
  obj.__prpto = Person.protptype
  // this指向这个新的对象
  this.name = name // obj.name = name
  this.age = age  // obj.age = age
  // 如果没有显示的返回对象或者函数，那么隐式的返回this
  return this
} 
```
## 能否手动实现new

```javascript

function _new(target) {
  // 创建一个空对象
  var obj = {}
  // 我们还需要获取到后面的参数
  var params = Array.prototype.slice.call(arguments, 1)
  console.log(arguments);
  // 存储函数的执行结果
  var result = null
  // 执行构造函数并且通过apply指定了this的指向，指向obj这个对象
  result = target.apply(obj, params)
  if (result !== null && typeof result === 'object' || typeof result === 'function') {
    // 进入此分支，说明函数的执行结果有返回值，并且泛会所是一个对象或者函数
    return result
  }
  // 没有进入上面的if，则返回obj
  return obj;
}

function Person(name, age) {
  this.name = name
  this.age = age
}
var abc = _new(Person, '张三', 18)
console.log(abc);
```

func


## 面试题 class方式和构造函数之间有什么区别
1. 构造函数的方式可以将构造函数当成普通函数来调用，但是class方式不可以
2. class的方式在进行美剧的时候，不会枚举出
3. class 内部的代码默认都是严格模式 默认严格模式下面是补支持重复参数的
4. class 上面的原型方法无法使用new
```javascript
function _new(target) {
  // 创建一个空对象
  var obj = {}
  // 我们还需要获取到后面的参数
  var params = Array.prototype.slice.call(arguments, 1)
  console.log(arguments);
  // 存储函数的执行结果
  var result = null
  // 执行构造函数并且通过apply指定了this的指向，指向obj这个对象
  result = target.apply(obj, params)
  if (result !== null && typeof result === 'object' || typeof result === 'function') {
    // 进入此分支，说明函数的执行结果有返回值，并且泛会所是一个对象或者函数
    return result
  }
  // 没有进入上面的if，则返回obj
  return obj;
}

function Person(name, age) {
  this.name = name
  this.age = age
}
var abc = _new(Person, '张三', 18)
console.log(abc);


function Computer1(name, price) {
  this.name = name
  this.price = price
}
Computer1.prototype.showSth = function () {
  console.log(`这是一台${this.name}的价格是${this.price}`);
}


// 这是通过类的方式
class Computer2 {
  constructor(name, price) {
    this.name = name
    this.price = price
  }
  // 原型方法
  showSth() {
    console.log(`这是一台${this.name}的价格是${this.price}`);
  }
}

var c1 = new Computer1('联想', 1000)
var c2 = new Computer2('话说', 2000)

// 1 构造函数的方式可以将构造函数当成普通函数来调用，但是class方式不可以
// Computer1('联想', 1000);  可以
// Computer2('话说', 2000); 不可以

// 2 class的方式在进行美剧的时候，不会枚举出

for (var key in c1) {
  console.log(key); // name , price, showSth
}

for (var key in c2) {
  console.log(key); // name , price 
}

// 3 class 内部的代码默认都是严格模式 默认严格模式下面是补支持重复参数的

// 4 class 上面的原型方法无法使用new
new c1.showSth()
new c2.showSth() // 报错
```    