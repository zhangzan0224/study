// 判断下面的文件是否符合后缀名要求
// 合法的后缀名：.jpg  .gif  .bmp .webp  .png

var filename = 'd://files/mymap/3.jpg';
var fileType = filename.substring(filename.lastIndexOf('.'))
// 判断后缀名是否合法
var allowedExtensions = ['.jpg', '.gif', '.bmp', '.webp', '.png'];
if (allowedExtensions.includes(fileType)) {
  console.log('合法');
}