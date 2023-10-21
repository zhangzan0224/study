// 将下面的rgb格式转换成为HEX格式
var rgb = 'rgb(253, 183, 25)';
var tempArr = rgb.replace('rgb(', '').replace(')', '').split(',');

var r = parseInt(tempArr[0]).toString(16);
var g = parseInt(tempArr[1]).toString(16);
var b = parseInt(tempArr[2]).toString(16);

var result = '#' + r + g + b
console.log(result);