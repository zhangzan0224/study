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
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
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