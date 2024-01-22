// 封装一个 DOM 查询方法

function $(selector) {
  return document.querySelector(selector);
}
// 获取 dom 元素
const imgBox = $('.imgBox'); // 图片容器
const imgBlock = $('.imgBlock'); // 可以拖动的图片
const imgGap = $('.imgGap'); // 图片缺口
const title = $('.imgContainer h3'); // 获取标题
const slider = $('.slider'); // 滑块条
const btn = $('#btn'); // 拖动的滑块
const span = $('.slider span'); // 滑块条的文字
// 初始化函数
function init() {
  // 随机图片放到数组里
  const imgArr = ['t1.png', 't2.png', 't3.png', 't4.png', 't5.png'];
  // 每次初始化的时候，从里面随机挑选一张图片
  const randomImgIndex = Math.floor(Math.random() * imgArr.length);
  // 设置图片容器和可拓拽的图片的背景图为随机的图片
  imgBox.style.backgroundImage = `url('../img/${imgArr[randomImgIndex]}')`;
  imgBlock.style.backgroundImage = `url('../img/${imgArr[randomImgIndex]}')`;
  // 设置图片缺口为随机的位置
  // 空缺图块可以设置的最大 top 值 = 盒子容器的高度 - 空缺图块的高度
  const maxTop = imgBox.offsetHeight - imgBlock.offsetHeight;
  // 空缺图库可以设置的最大的 left值 = 盒子容器的宽度的一半 - 空缺图块的宽度
  const maxLeft = imgBox.offsetWidth / 2 - imgBlock.offsetWidth;
  // 生成随机的 left 和 top 值
  let left = Math.random() * maxLeft + imgBox.offsetWidth / 2;
  let top = Math.random() * maxTop;
  // 设置图片缺口的 left 和 top 值
  imgGap.style.left = left + 'px';
  imgGap.style.top = top + 'px';
  // 设置拖动图片的 left 和 top 值
  imgBlock.style.left = 0;
  imgBlock.style.top = top + 'px';
  // 设置拖动图片的背景图的位置
  imgBlock.style.backgroundPositionY = -top + 'px';
  imgBlock.style.backgroundPositionX = -left + 'px';
  // 初始化拖动图片块、空缺图块以及下面滑块的一些设置
  imgGap.style.opacity = 1; // 空缺图块可见
  imgBlock.style.opacity = 0; // 拖动图片块刚开始时不可见
  btn.style.left = '-2px'; // 滑块位置初始化
  span.style.opacity = 1; // 显示滑块区域的文字
  // 初始化 title
  title.style.color = 'black';
  title.innerHTML = '请完成图片验证'
  // 当鼠标按下在按钮的时候，通过 offsetX 能拿到按钮的 x 坐标 offsetY 能拿到按钮的 y 坐标
  btn.onmousedown = function (e) {
    // 展示可拖拽的图片
    imgBlock.style.opacity = 1;
    imgBlock.style.transition = 'none'; // 关闭拖动图片块的过渡效果，让整个拖动更加的丝滑
    // 获取鼠标按下的时候的 x 坐标
    let x = e.offsetX;
    // 获取鼠标按下的时候的 y 坐标
    let y = e.offsetY;
    // 设置标题
    title.innerHTML = '拖动图片完成验证';
    title.style.color = 'black';

    // 设置滑动条的文字不可见
    span.style.opacity = 0;
    // 将按钮的过渡也关闭掉
    btn.style.transition = 'none'; // 关闭按钮的过渡效果，让整个拖动更加的丝滑
    // 当在滑块上拖动的时候，拖拽图片跟着移动
    slider.onmousemove = function (es) {
      // 设置拖动图片的 left 和 top 值
      // 按钮实时的 left 值计算 = 滑条的 clientX - 滑条的 offsetLeft - 按钮的 offsetX
      var newLeft = es.clientX - slider.offsetLeft - x;
      // console.log(newLeft, 'newLeft')

      // 我们还需要进行一个边界判断
      if (newLeft < 0) {
        newLeft = 0
      }
      if (newLeft > (imgBox.offsetWidth - imgBlock.offsetWidth)) {
        newLeft = imgBox.offsetWidth - imgBlock.offsetWidth;
      }

      imgBlock.style.left = newLeft + 'px';
      btn.style.left = newLeft + 'px';
    }
    // 鼠标抬起的时候，拖拽图片停止，同时拖拽的按钮也停止
    document.onmouseup = function () {
      // 判断拖拽图片的 left 值 和 空缺图块的 left 值
      // 如果拖拽图片的 left 值 和 空缺图块的 left 值 之间的差值小于 5 像素的话，则证明拖拽成功
      if (Math.abs(imgBlock.offsetLeft - imgGap.offsetLeft) < 5) {
        imgBlock.style.opacity = 0
        imgGap.style.opacity = 0
        title.innerHTML = '验证成功';
        title.style.color = 'green';

        // 删除所有的事件
        slider.onmousemove = btn.onmousedown = document.onmouseup = null;
      } else {
        // 设置拖动图块和按钮的 left 值
        imgBlock.style.left = '0px';
        btn.style.left = '-2px';

        // 还需要添加上过渡
        // imgBlock.style.transition = 'all .5s';
        // btn.style.transition = 'all .5s';

        slider.onmousemove = document.onmouseup = null;

        // 设置 title
        title.innerHTML = '验证失败';
        title.style.color = 'red';

        // 显示滑块区域的文字
        span.style.opacity = 1;
      }
    }
  }
}

init()

$('.changeImg').onclick = init;