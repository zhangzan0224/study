// 入口文件
import Vue from "vue";
import App from "./App.vue";
import "./styles/global.less";
import router from "@/router";
import showMessage from "./utils/showMessage";
import "./mock/index.js";
import './api/banner.js'
Vue.prototype.$showMessage = showMessage;
new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");
