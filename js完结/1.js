/**
 * 打印一个对象的名字
 * @param {Object} obj 对象
 * @param {String} key key值
 * @return {String} 返回值
 */

function  getObjectKeyValue (obj, key) {
    return obj[key];
}

console.log(getObjectKeyValue({abc: '1'}, 'abc'))