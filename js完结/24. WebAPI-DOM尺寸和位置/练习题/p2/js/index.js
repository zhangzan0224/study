// 让小球向右下运动，遇到边缘后反弹

// 每隔一段时间，让小球向右下运动，改变小球的left 和 top
const ball = document.querySelector('.ball');
var disX = 2,
  disY = 2
// 让小球向右下运动，遇到边缘后反弹
var w = document.documentElement.clientWidth
var h = document.documentElement.clientHeight;
// 获取小球的宽和高
var ballW = ball.offsetWidth;
var ballH = ball.offsetHeight;

// 获取最大的横纵坐标
var maxLeft = w - ballW
var maxTop = h - ballH
setInterval(() => {
  var reac = ball.getBoundingClientRect();
  var left = reac.left;
  var top = reac.top;
  left += disX;
  top += disY;
  // 控制范围
  if (left > maxLeft) {
    left = maxLeft
    disX = -disX;
    changeBackColor()
  }

  if (top > maxTop) {
    top = maxTop
    disY = -disY;
    changeBackColor()
  }

  if (left < 0) {
    left = 0
    disX = -disX;
    changeBackColor()
  }
  if (top < 0) {
    top = 0
    disY = -disY;
    changeBackColor()
  }
  ball.style.left = `${left}px`;
  ball.style.top = `${top}px`;
}, 20); // Change the interval time (in milliseconds) as needed

// 生成指定范围内的随机数
/**
 * 生成一个介于最小值和最大值之间的随机数。
 * @param {number} min - 最小值。
 * @param {number} max - 最大值。
 * @returns {number} - 生成的随机数。
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 改变球元素的背景颜色为随机的RGB值。
 *
 * @param {number} min - RGB组件的最小值。
 * @param {number} max - RGB组件的最大值。
 * @return {void} 此函数不返回任何值。
 */
function changeBackColor() {
  ball.style.backgroundColor = 'rgb(' + getRandom(0, 256) + ',' + getRandom(0, 256) + ',' + getRandom(0, 256) + ')'
}