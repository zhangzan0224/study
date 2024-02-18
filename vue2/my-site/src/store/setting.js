import { getSetting } from "@/api/setting";
export default {
  namespaced: true,
  state: {
    loading: false,
    data: null,
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setData(state, payload) {
      state.data = payload;
    },
  },
  actions: {
    async fetchSetting({ commit }) {
      commit("setLoading", true);
      const resp = await getSetting();
      commit("setData", resp);
      commit("setLoading", false);
    },
  },
};
