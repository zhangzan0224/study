// 生成一个a-z的字符串
// let arr = [...Array(26).keys()].map(i => String.fromCharCode(i + 'a').charCodeAt(0))
// console.log(arr.join(''))

// var a = 1;
// a.toString()
// console.log(new Number(a))
var arr = []
for (var i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
  arr.push(String.fromCharCode(i))
}