/**
 * 得到一个指定长度的随机字符串
 * 字符串包含：数字、字母
 * @param {number} length 字符串的长度
 * @return {number} 随机字符串
 */
function getRandomString(length) {
  var temp = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var result = ''
  for (var i = 0; i < length; i++) {
    result += temp[Math.floor(Math.random() * length)];
  }
  return result;
}

function getRandomString(length) {
  // 36进制有 0-9a-z
  return Math.random().toString(36).substring(2, length + 2)
}
console.log(getRandomString(7))