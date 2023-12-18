/**
 * 获取所传递多少个参数的和
 * @param  {...any} args 剩余参数
 * @returns 剩余参数所求的和
 */
function sum(...args) {
  let sum = 0
  return args.reduce((a, b) => {
    sum += b
    return sum
  })
}
/**
 * 获取一个指定长度的随机数组成的数组
 * @param {number} length 
 * @returns 指定长度的数组
 */
function getRandomNumbers(length) {
  let numbers = []
  for (let i = 0; i < length; i++) {
    numbers.push(Math.floor(Math.random()))
  }
  return numbers
}

/**  */