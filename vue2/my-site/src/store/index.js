import { Store, install } from "vuex";
import Vue from "vue";
import banner from "./banner";
import setting from "./setting";
import project from "@/store/project";
import about from "./about";
if (!window.Vuex) {
  install(Vue);
}
const store = new Store({
  modules: {
    banner,
    setting,
    about,
    project,
  },
  strict: true,
});
// 导出 store
export default store;
