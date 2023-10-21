// name转换成驼峰命名
var name = 'has own property'; // --> hasOwnProperty
var parts = name.split(' ');
var result = []
for (var i = 0; i < parts.length; i++) {
  var s = parts[i];
  if (i > 0) {
    s = s[0].toUpperCase() + s.substring(1)
  }
  result.push(s)
}

console.log(result.join(''));