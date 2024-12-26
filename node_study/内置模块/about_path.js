const path = require('path');
console.log(path.posix)
console.log(path.sep) // linux 是/  windows的是\
console.log(path.delimiter) // path的分隔符
console.log(path.dirname('a/b/c/d')) // 返回文件的文件夹
const basePath = 'a/b'
const fullPath = path.join(basePath, '../', 'd.js')
console.log(fullPath)
const rel = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
console.log(rel)
const absPath = path.resolve(__dirname, "./a.js");
console.log(absPath);