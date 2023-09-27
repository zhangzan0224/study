/*
1. 输出一个对象的所有键值对
*/
const obj = {a: 1, b: 2, c: 3, d: 4}
for (var key in obj) {
    console.log(key, obj[key])
}
/*
2. 计算对象中字符串属性的数量
*/

const obj2 = {a: 1, b: 2, c: 3,d: 'aaa', e: 'bbb'}
var count = 0
for (var obj2Key in obj2) {
    if (typeof obj2[obj2Key] === 'string') {
        count++
    }
}
console.log(count)
/*
3. 将一个对象所有的数字属性，转换为字符串，并在其前面加上￥
例如：
{
    name:"xxx",
    balance: 199.8, //余额
    taken: 3000 //消费
}
-->
{
    name:"xxx",
    balance: '￥199.8', //余额
    taken: '￥3000' //消费
}
*/

const obj3 = {
    name: 'xxx',
    balance: 199.8, //余额
    taken: 3000 //消费
}
var newObj = {}
for (var obj3Key in obj3) {
    if (typeof obj3[obj3Key] === 'number') {
        newObj[obj3Key] = '￥' + obj3[obj3Key]
    } else {
        newObj[obj3Key] = obj3[obj3Key]
    }
}
console.log(newObj)

/*
4. 按照下面的要求进行转换
[1, 2, 3]
-->
[
    {number:1, doubleNumber: 2},
    {number:2, doubleNumber: 4},
    {number:3, doubleNumber: 6},
]
*/
const tempArr = [1, 2, 3]
var newArr = []
for (var i = 0; i < tempArr.length; i++) {
    newArr.push({
        number: tempArr[i],
        doubleNumber: tempArr[i] * 2
    })
}
console.log(newArr)
