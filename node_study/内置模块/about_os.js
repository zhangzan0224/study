const os = require('os');
console.log(os.EOL);
console.log(os.arch());
console.log(os.cpus().length);
console.log(os.freemem()/1024**3); // 返回空余内存
console.log(os.homedir()) // 返回用户的目录
console.log(os.hostname()) // 返回系统的主机名字