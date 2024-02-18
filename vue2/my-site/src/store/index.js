import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
    decrement(context) {
      context.commit("decrement");
    },

    asyncIncrement(context) {
      setTimeout(() => {
        context.commit("increment");
      }, 1000);
    },
    // 异步处理较少时，可以直接使用箭头函数
    asyncDecrement: (context) => {
      setTimeout(() => {
        context.commit("decrement");
      }, 1000);
    },
  },
});
window.store = store;
export default store;
