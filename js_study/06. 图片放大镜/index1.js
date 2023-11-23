// 单一元素
function $(selector) {
  return document.querySelector(selector);
}

// 多个元素
function $$(selector) {
  return document.querySelectorAll(selector);
}

// 初始化数据图片
var imgs = {
  // 小图
  small: ['imgA_1.jpg', 'imgB_1.jpg', 'imgC_1.jpg'],
  // 中图
  middle: ['imgA_2.jpg', 'imgB_2.jpg', 'imgC_2.jpg'],
  // 大图
  large: ['imgA_3.jpg', 'imgB_3.jpg', 'imgC_3.jpg']
}

// 获取元素
var container = $('.container');
var midImg = $('.left-img');
var largeImg = $('.right-img');
var smallImg = $('.img-list');
var mask = $('.mask');


// 初始化的时候，先显示缩略图

function initPage() {
  var str = '';
  for (var i = 0; i < imgs.small.length; i++) {
    str += '<li style="background-image: url(./images/' + imgs.small[i] + ');"></li>'
  }
  smallImg.innerHTML = str;
  // 2. 默认选中第一个缩略图
  $('.img-list li').style.border = '2px solid #000';
}



smallImg.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    // 去除缩略图的border
    var lis = this.querySelectorAll('li')
    for (var i = 0; i < lis.length; i++) {
      lis[i].style.border = 'none'
    }
    e.target.style.border = '1px solid #000';
    // var lisArray = Array.from(lis)
    // var index = lisArray.findIndex(item => item === e.target)
    var index = [].slice.call(lis).indexOf(e.target);
    // 'url(./images/' + imgs.middle[index] + ')';
    midImg.style.backgroundImage = `url(./images/${imgs.middle[index]})`
    largeImg.style.backgroundImage = `url(./images/${imgs.large[index]})`
  }

})

function addEvent() {
  midImg.addEventListener('mousemove', (e) => {
    // 让遮罩层和大图展示
    // mask.style.opacity = 1;
    // largeImg.style.opacity = 1;
    // 根据鼠标位置计算遮罩层的位置
    var left = e.clientX - midImg.offsetLeft - mask.offsetWidth / 2;
    // 同理
    var top = e.clientY - midImg.offsetTop - mask.offsetHeight / 2;
    // 能移动的最大距离是中等图的宽度减去阴影的宽度
    // var maxleft = midImg.offsetWidth - mask.offsetWidth;
    // var maxTop = midImg.offsetHeight - mask.offsetHeight;
    // 边界条件
    if (left <= 0) {
      left = 0;
    }
    if (top <= 0) {
      top = 0;
    }
    if (left >= midImg.offsetWidth - mask.offsetWidth) {
      left = midImg.offsetWidth - mask.offsetWidth
    }
    if (top >= midImg.offsetHeight - mask.offsetHeight) {
      top = midImg.offsetHeight - mask.offsetHeight
    }
    // 根据top和left调整mask的位置
    mask.style.left = left + 'px';
    mask.style.top = top + 'px';
    // 根据top 和 left，修改大图的位置，background-position-x
    largeImg.style.backgroundPositionX = -left + 'px';
    largeImg.style.backgroundPositionY = -top + 'px';
  });

  // 2. 移出
  midImg.onmouseleave = function (e) {
    // 让遮罩层和大图消失
    mask.style.opacity = 0;
    largeImg.style.opacity = 0;
  }
}

function main() {
  initPage()
  addEvent()
}

main()