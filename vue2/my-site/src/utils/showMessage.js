import getComponentRootDom from "./getComponentRootDom";
import Icon from "@/components/Icon";
import styles from "./showMessage.module.less";

/**
 * 弹出消息
 * @param {String} content 消息内容
 * @param {String} type 消息类型  info  error  success  warn
 * @param {Number} duration 多久后消失
 * @param {HTMLElement} container 容器，消息会显示到该容器的正中；如果不传，则显示到页面正中
 */
export default function (options = {}) {
  const content = options.content || "";
  const type = options.type || "info";
  const duration = options.duration || 2000;
  const container = options.container || document.body;
  // 创建消息元素
  const div = document.createElement("div");
  const iconDom = getComponentRootDom(Icon, {
    type,
  });
  // outerHTML: 返回一个序列化的 Element 对象的HTML片段,为字符串
  div.innerHTML = `<span class="${styles.icon}">${iconDom.outerHTML}</span><div>${content}</div>`;
  // 设置样式
  const typeClassName = styles[`message-${type}`]; //类型样式名
  div.className = `${styles.message} ${typeClassName}`;
  // 将div加入到容器中

  // 判断容器的position是否为static，如果为static，则设置为relative，否则无法定位
  /**
这段 JavaScript 代码是在检查一个名为 options 的对象是否有一个名为 container 的属性。如果 options.container 存在，那么它将进一步检查 container 的 CSS 属性 position 是否为 static。

getComputedStyle(container).position 这行代码是获取 container 元素的计算样式中的 position 属性值。计算样式是元素的最终样式，它包括了 CSS 样式表、内联样式和浏览器默认样式等所有样式的最终结果。

如果 position 属性的值为 static，那么代码将会改变 container 的 position 属性值为 relative。这是因为 static 是 position 属性的默认值，它会使元素按照正常的文档流进行布局，而 relative 则会使元素相对于其正常位置进行定位。

这段代码的目的可能是为了确保 container 元素可以作为其子元素的定位上下文，这样，子元素就可以使用 position: absolute 或 position: relative 来相对于 container 元素进行定位。
  !为什么不能给body设置为relative呢？
  将 body 元素的 position 设置为 relative 可能会导致一些不预期的布局问题。因为 body 元素是所有 HTML 元素的父元素，改变它的定位方式可能会影响到页面上所有使用了绝对定位 (position: absolute) 或固定定位 (position: fixed) 的元素。

例如，一个元素如果设置了 position: absolute，它会相对于最近的非 static 定位的祖先元素进行定位。如果 body 元素设置为 relative，那么所有没有非 static 定位的祖先元素的绝对定位元素都会相对于 body 元素进行定位，这可能会打乱原有的布局。

因此，通常我们会避免直接改变 body 元素的 position 属性，而是在 body 元素内部创建一个新的 div 元素，将这个 div 元素设置为 relative，然后将需要定位的元素放入这个 div 元素中。这样就可以避免影响到其他元素的布局。
  
  */
  if (options.container) {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
  }
  container.appendChild(div);
  // 浏览器强行渲染 如何强制重绘？ 重绘：重新渲染页面中的元素，重新计算样式；回流：重新计算元素的位置和结构
  // 回流和重绘？
  // 回流：重新计算元素的位置和结构
  // 重绘：重新计算元素的样式 回流肯定会引起重绘，重绘不一定会引起回流
  div.clientHeight; // 导致reflow

  // 回归到正常位置
  div.style.opacity = 1;
  div.style.transform = `translate(-50%, -50%)`;

  // 等一段时间，消失
  setTimeout(() => {
    div.style.opacity = 0;
    div.style.transform = `translate(-50%, -50%) translateY(-25px)`;
    // 添加一个监听动画结束的函数，移除元素，执行回调函数
    div.addEventListener(
      "transitionend",
      function () {
        div.remove(); // 删除元素
        // 运行回调函数
        options.callback && options.callback(); // 如果options.callback存在，则执行options.callback()
      }, {
        once: true
      } // once: true 事件只触发一次
    );
  }, duration);
}