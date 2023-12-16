// 正则中的粘连标记
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
// 标记名 y 含义,匹配时,完全按照正则对象的lastIndex位置进行匹配,并且匹配的位置必须在lastIndex位置
const text = 'hello World!!!!'
const reg = /W\w+/
console.log('reg.lastIndex', reg.lastIndex);
console.log(`output->${reg.test(text)}`)
const reg1 = /W\w+/y
console.log('reg1.lastIndex', reg1.lastIndex);
console.log(`output->${reg1.test(text)}`)
reg1.lastIndex = 6
console.log(`output->${reg1.test(text)}`)