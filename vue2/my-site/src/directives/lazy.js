// 定义一个用于懒加载图片的指令
import eventBus from "@/utils/eventBus";
import { debounce } from "@/utils";
// 图片未加载出来时默认图片
import defaultGif from "@/assets/default.gif";
let imgs = []; // 定义一个图片的数组，判断图片是否加载过
function handleScroll(dom) {
  setImgs();
}
function setImg(img) {
  const rect = img.dom.getBoundingClientRect();
  const height = rect.height || 150; // 如果高度为0，设置默认高度
  img.dom.src = defaultGif; // 先把所有的都设置为默认图片，当进入可展示的区域之后再进行修改
  if (
    rect.top <= document.documentElement.clientHeight &&
    rect.top >= -height
  ) {
    const tempImage = new Image();
    tempImage.onload = () => {
      img.dom.src = img.src; // 临时图片加载成功后，再把dom的src设置为真正的图片地址
      img.dom.src = img.src; // 十大注释
      imgs = imgs.filter((item) => item !== img); // 将已经加载过的去处掉
    };
    tempImage.src = img.src;
  }
}
function setImgs() {
  imgs.forEach((item, index) => {
    setImg(item);
  });
}
eventBus.$on("mainScroll", debounce(handleScroll, 100));
export default {
  // 当被绑定的元素插入到 父节点时使用
  inserted(el, binding) {
    const img = {
      dom: el,
      src: binding.value,
    };
    imgs.push(img);
    setImg(img);
  },
  // 当指令所在组件的 VNode 更新时……
  unbind(el) {
    imgs = imgs.filter((item) => item.dom !== el);
  },
};
