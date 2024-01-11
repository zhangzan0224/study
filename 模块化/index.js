// import {
//   sum
// } from './math.js'
// console.log('tag', sum(1, 2)) // 静态导入


// 动态导入 相当于导入了一个promise 
setTimeout(() => {
  import('./math.js').then((m) => {
    console.log('tag', m.sum(1, 2))
  })
}, 1000);
// 或者使用async await

setTimeout(async () => {
  const res = await import('./math.js')
  console.log('tag', res.sum(1, 2))
}, 2000);