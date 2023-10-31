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
  }

  if (top > maxTop) {
    top = maxTop
    disY = -disY;
  }

  if (left < 0) {
    left = 0
    disX = -disX;
  }
  if (top < 0) {
    top = 0
    disY = -disY;
  }
  ball.style.left = `${left}px`;
  ball.style.top = `${top}px`;
}, 20); // Change the interval time (in milliseconds) as needed