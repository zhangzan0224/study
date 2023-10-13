const dayjs = require("dayjs");
// var moment = require('moment');
console.log(dayjs('2023/10/21').subtract(1, 'year').format('YYYY/MM/DD'))

function calculateOneYearAgo(inputDate) {
  // 解析输入日期
  const dateParts = inputDate.split('/');
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);

  // 减少一年
  const newYear = year - 1;

  // 判断是否是闰年
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // 处理2月29日
  if (month === 2 && day === 29 && isLeapYear(newYear)) {
    return `${newYear}/02/29`;
  }

  // 处理其他日期
  if (month === 2 && day === 29 && !isLeapYear(newYear)) {
    return `${newYear}/02/28`;
  } else {
    return `${newYear}/${(month).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  }
}

// 示例用法
const inputDate = "2023/10/21";
const resultDate = calculateOneYearAgo(inputDate);
console.log(`滚动一年后的日期：${resultDate}`);
