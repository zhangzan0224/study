// 入口文件
import Vue from "vue";
import App from "./App.vue";
import "./styles/global.less";
import showMessage from "./utils/showMessage";
window.showMessage = showMessage;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
