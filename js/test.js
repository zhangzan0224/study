/*
 * @Description: 编写完美的求和函数，若都是数字返回数字即可，若Nan的数值都返回0，其他类型的数据需要返回数值
 * @Version: 2.0
 * @Author: ZhangZan
 * @Date: 2023-09-25 23:55:30
 * @LastEditors: ZhangZan
 * @LastEditTime: 2023-09-26 00:21:41
 */

function sum(a, b) {
  // `false` `null` `undefined` `0` `NaN` `''` 都被定义为 false
  a = +a || 0
  b = +b || 0
  return a + b
}

/* 
  不使用if，判断一个年份是否是闰年，输出是或否

  闰年规则：
  1. 4年一闰，百年不闰
  2. 400年必闰
  上述两点满足其一即可
*/
var year = 1900

// 判断变量year是否是闰年
function isLeapyear(year) {
  /*   if (year % 400 === 0) {
    return true
  } else if (year % 100 === 0) {
    return false
  } else if (year % 4 === 0) {
    return true
  } else {
    return false
  } */
  /*
   * 第一个条件 能被4整除，但是不能被100整除，或者能被400整除
   */
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? '是' : '不是'
}

console.log(isLeapyear(year))

/* 
  不使用if
  根据身高、体重，计算健康状况

  健康状况取决于BMI   BMI=体重÷身高的平方。（体重单位：千克；身高单位：米。）
  BMI的正常值在20~25之间，少于20偏瘦，高于25偏胖

  输出 正常、偏瘦、偏胖
*/
var height = 185, // 身高（厘米）
  weight = 80; // 体重（千克）


// 计算BMI
function calculateBMI(height, weight) {
  const  BMI =  weight / Math.pow(height / 100, 2)
  return BMI >= 20 && BMI <= 25 ? '正常' : (BMI < 20 ? '偏瘦' :'偏胖')
}

console.log(calculateBMI(height, weight))
