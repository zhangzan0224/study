/**
 * 交换对象两个属性的值
 * @param {Object} obj 对象
 * @param {string} key1 属性名1
 * @param {string} key2 属性名2
 */
function swap(obj, key1, key2) {
  const temp = obj[key1];
  obj[key1] = obj[key2];
  obj[key2] = temp;
}
const obj = {a: 1, b: 2}
swap(obj, 'a', 'b');
console.log(obj);