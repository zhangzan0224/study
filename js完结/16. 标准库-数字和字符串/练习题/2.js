// 将下面的字符串分割成一个单词数组，同时去掉数组中每一项的,和.
var str =
  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci impedit voluptatem cupiditate, est corporis, quis sunt quod tempore officiis hic voluptates eaque commodi. Repudiandae provident animi quia qui harum quasi.';

var tmpArr = str.split(' ')
var result = tmpArr.map((item) => {
  return item.replaceAll(/,|\./g, '')
  // console.log(item);
})
console.log(result, 'js完结/16. 标准库-数字和字符串/练习题/2.js-第9行')