/*
1. 输出1-100的所有奇数
*/
/*for (var i = 0; i<= 100; i++) {
    if (i % 2 !== 0) {
        console.log(i);
    }
}*/
/*
2. 定义一个数组，输出数组中所有的奇数
*/
const tempArray = []
for (var i = 0; i<= 100; i++) {
    if (i % 2!== 0) {
        tempArray.push(i);
    }
}
console.log(tempArray);
/*
3. 定义一个数组，找出所有的奇数，放入到一个新数组中
*/
const nums = [1,2,3,4,5,6,7,8,9,10]
const tempArr = []
for(i = 0; i < nums.length; i++) {
    if (nums[i] % 2!== 0) {
        tempArr.push(nums[i])
    }
}
