// 下面的代码输出什么？（京东）
Function.prototype.a = 1;
Object.prototype.b = 2;

function A() {}

var a = new A();

console.log(a.a, a.b); // undefined 2 市里对象的隐式原型上找不到a 能找到b
console.log(A.a, A.b); // 1 2  Function原型的隐式原型能到Object上