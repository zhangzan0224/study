// function calculateOneYearAgo(inputDate) {
//   // 解析输入日期
//   const dateParts = inputDate.split('/');
//   const year = parseInt(dateParts[0]);
//   const month = parseInt(dateParts[1]) - 1; // 月份从0开始
//   const day = parseInt(dateParts[2]);

//   // 创建一个日期对象
//   const date = new Date(year, month, day);

//   // 减少一年
//   date.setFullYear(date.getFullYear() - 1);

//   // 处理2月份和闰年
//   const isLeapYear = (year) => {
//     return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
//   };

//   if (date.getMonth() === 1 && date.getDate() === 29 && !isLeapYear(date.getFullYear() + 1)) {
//     date.setDate(28); // 处理闰年的2月29日
//   }

//   return date;
// }

// // 示例用法
// const inputDate = "2021/2/28";
// const resultDate = calculateOneYearAgo(inputDate);
// console.log(`滚动一年后的日期：${resultDate.toDateString()}`);

const dayjs = require('dayjs')
console.log(dayjs('2020/02/29').subtract(1, 'year').format('YYYY/MM/DD'))