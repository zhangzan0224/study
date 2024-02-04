// 事件总线
// export default {
//   // 保存事件的容器
//   callbacks: {},
//   // 订阅事件
//   $on(event, callback) {
//     // 如果之前事件没有,需要初始化一个Set
//     if (!this.callbacks[event]) {
//       this.callbacks[event] = new Set();
//     }
//     this.callbacks[event].add(callback);
//   },
//   // 触发事件
//   $emit(event, ...args) {
//     if (!this.callbacks[event]) {
//       return;
//     }
//     for (const callback of this.callbacks[event]) {
//       callback(...args);
//     }
//   },
//   // 取消订阅
//   $off(event, callback) {
//     if (!this.callbacks[event]) {
//       return;
//     }
//     this.callbacks[event].delete(callback);
//   },
// };

// 更简单的写法
import Vue from "vue";
export default new Vue({});
