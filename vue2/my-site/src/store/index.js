import Vuex from "vuex";
import Vue from "vue";
import banner from "./banner";
import setting from "./setting";
import project from "@/store/project";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    banner,
    setting,
    project,
  },
  strict: true,
});
export default store;
