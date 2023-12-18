// 柯里化 用于固定某个函数的前面的参数,得到一个新的函数,新的函数在调用的时候,可以接收剩余的参数
function curry(fn, ...args) {
  return function (...subArgs) {
    const allArgs = [...args, ...subArgs]
    if (allArgs.length >= fn.length) {
      return fn(...allArgs)
    } else {
      return curry(fn, ...allArgs)
    }
  }
}

function cal(a, b, c, d) {
  return a + b * c - d
}

console.log(cal(1, 2, 3, 4));
console.log(cal(1, 2, 4, 5));
console.log(cal(1, 2, 5, 6));
console.log(cal(1, 2, 6, 7));

const newCal = curry(cal, 1, 2)
console.log(newCal(3)(4));
console.log(newCal(4, 5));
console.log(newCal(5, 6));
console.log(newCal(6, 7));