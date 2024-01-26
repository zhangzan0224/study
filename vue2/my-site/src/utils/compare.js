const iterator = walk('1-2-3-44-55')
console.log(iterator.next()); // { value: '1', done: false }
console.log(iterator.next()); // { value: '2', done: false }
console.log(iterator.next()); // { value: '3', done: false }
console.log(iterator.next()); // { value: '44', done: false }
console.log(iterator.next()); // { value: '55', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
// 帮我写一下这个walk函数 使用迭代器
function* walk(str) {
  let n = ''
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '-') {
      yield n
      n = ''
    } else {
      n += str[i]
    }
  }
  if (n) yield n // 最后一个
}

//使用迭代器对两个字符串进行比较， 如果str1大于str2 返回1， 如果str1小于str2 返回-1， 如果相等返回0
function compare(str1, str2) {
  const iterator1 = walk(str1)
  const iterator2 = walk(str2)
  while(1) {
    // 取出迭代器的值
    const res1 = iterator1.next()
    const res2 = iterator2.next()
    // 比较
    if(res1.done && res2.done){
      return 0
    } else if (res1.done) {return -1}
    else if (res2.done) {return 1}
    else if (res1.value > res2.value) {return 1}
    else if (res1.value < res2.value) {return -1}
    else {continue}
  }
}