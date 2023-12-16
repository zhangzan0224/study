/**
 * 
 * @param {string} char
 * @param {number} i 索引值
 * @returns 判断一个字符串是否为32位的
 * @example is32bit('𠮷')
 */
function is32bit(char, i = 0) {
  return char.codePointAt(i) > 0xffff;
}
console.log(is32bit('𠮷'));
console.log('𠮷'.length) // 2
console.log(/^.$/.test('𠮷')) // false, 因为他是两个字符
console.log(/^.$/u.test('𠮷')) // true 使用码点测试
/**
 * @description 获取一个字符串码点的真实长度,一般情况下获取的是码元的长度
 * @param {string} str 
 * @returns 
 */
function getLengthOfCodePoint(str) {
  let length = 0
  for (let i = 0; i < str.length; i++) {
    // i 是在索引码元
    if (is32bit(str, i)) {
      // 当前字符串在i这个位置,占用了两个码元,下一个位置就不看了 
      i++
    }
    length++
  }
  return length
}
console.log('𠮷'.codePointAt(0).toString(16));
console.log('getLengthOfCodePoint', getLengthOfCodePoint('𠮷123'), '𠮷123'.length); // 4 和 5 码点的长度是4
console.log('getLengthOfCodePoint', getLengthOfCodePoint('☃★♲'), '☃★♲'.length); // 4 和 5 码点的长度是4