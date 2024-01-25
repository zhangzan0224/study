import Vue from "vue";

// 根据组件获取组件渲染的dom根元素
/**
 * 获取Vue组件的根DOM元素。
 *
 * @param {Object} comp - Vue组件。
 * @param {Object} props - 传递给组件的属性。
 * @returns {HTMLElement} - 组件的根DOM元素。
 */
export default function getComponentRootDom(comp, props) {
  const vm = new Vue({
    render: (h) => h(comp, {
      props
    }),
  });
  vm.$mount();
  return vm.$el;
}