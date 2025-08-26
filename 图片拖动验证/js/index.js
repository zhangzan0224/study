// 封装一个 DOM 查询方法

function $(selector) {
    return document.querySelector(selector);
}

// 接下来我们来获取一下 DOM 节点
var imgBox = $('.imgBox'); // 图片容器
var imgBlock = $('.imgBlock'); // 可以拖动的图片
var imgGap = $('.imgGap'); // 图片缺口
var title = $('.imgContainer h3'); // 获取标题
var slider = $('.slider'); // 滑块条
var btn = $('#btn'); // 拖动的滑块
var span = $('.slider span'); // 滑块条的文字

// 初始化函数
/**
 * The init function is responsible for initializing the image verification process.
 * It sets up the images, calculates the positions of the draggable image block and the image gap,
 * and binds the necessary mouse events for the user to perform the verification.
 */
function init() {

init();
// 初始化函数
function init() {
    // 随机生成一张图片
    var imgSrc = 'https://picsum.photos/300/150?random=' + Math.random();
    imgBlock.style.backgroundImage = 'url(' + imgSrc + ')';
    imgGap.style.backgroundImage = 'url(' + imgSrc + ')';
    // 随机生成一个位置
    var gap = Math.floor(Math.random() * 50 + 50);
    imgGap.style.backgroundPosition = gap + '% 0';
    // 绑定鼠标事件
    btn.onmousedown = function (e) {
        var disX = e.clientX - btn.offsetLeft;
        document.onmousemove = function (e) {
            var btnLeft = e.clientX - disX;
            if (btnLeft < 0) {
                btnLeft = 0;
            } else if (btnLeft > slider.offsetWidth - btn.offsetWidth) {
                btnLeft = slider.offsetWidth - btn.offsetWidth;
            }
            btn.style.left = btnLeft + 'px';
            imgBlock.style.width = btnLeft + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
            if (btn.offsetLeft >= slider.offsetWidth - btn.offsetWidth - 2) {
                title.innerHTML = '验证通过';
                btn.onmousedown = null;
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
        return false;
    };
}

$('.changeImg').onclick = init;