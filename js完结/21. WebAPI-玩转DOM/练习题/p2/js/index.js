// 每隔一段时间，切换英雄的图片，让英雄动起来
function $(selector) {
  return document.querySelector(selector);
}
var imgIndex = 1;
setInterval(function () {
  imgIndex++;
  if (imgIndex > 4) {
    imgIndex = 1;
  }
  $("#hero").src = './img/' + imgIndex + '.png';
}, 200);
// 每隔一段时间，改变英雄的位置，让英雄向右移动

var remove = 0;
setInterval(function () {
    remove++;
    $("#hero").style.left = remove + 'px';
  },
  100);