// 入口文件
import Vue from "vue";
import App from "./App.vue";
import "./styles/global.less";
import router from "@/router";
import showMessage from "./utils/showMessage";
import loading from "@/directives/loading"
Vue.directive('loading', loading)
import "./mock/index.js";
import './api/banner.js'
import { getBlogs, getBlogTypes } from './api/blog.js'
getBlogs().then(res => console.log(res))
Vue.prototype.$showMessage = showMessage;
new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");
