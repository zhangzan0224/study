// 入口文件
import Vue from "vue";
import App from "./App.vue";
import "./styles/global.less";
import router from "@/router";
import showMessage from "./utils/showMessage";
import loading from "@/directives/loading";
import lazy from "@/directives/lazy";
import store from "@/store/index";
store.dispatch("setting/fetchSetting");
Vue.directive("lazy", lazy);
Vue.directive("loading", loading);
import "./mock/index.js";
import "./api/banner.js";
import eventBus from "@/utils/eventBus";
Vue.prototype.$showMessage = showMessage;
Vue.prototype.$bus = eventBus;
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
